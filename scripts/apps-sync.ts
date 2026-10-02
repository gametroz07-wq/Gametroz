/**
 * Syncs the Apps catalog from lib/apps/definitions.ts to the database.
 *   npm run apps:sync                          dry run: prints the plan, writes nothing
 *   npm run apps:sync -- --apply               applies it
 *   npm run apps:sync -- --apply --confirm-archive    required when more than 10 apps would be archived
 *
 * Upserts platforms (the legacy `browser` row is renamed to `web` in place, so its app joins survive),
 * categories, apps (PUBLISHED, no version, no icon file, verified links), their platform joins and their
 * ordered alternatives, and ARCHIVES published apps that are no longer defined. It never deletes rows.
 * Categories without published apps stay in the table but no page lists them.
 */
import { parseArgs } from "node:util";
import { appCategoryDefinitions, appDefinitions, platformDefinitions } from "@/lib/apps/definitions";
import {
  LEGACY_PLATFORM_SLUGS,
  buildSyncPlan,
  checkArchiveGuard,
  type CatalogRow,
  type ExistingAppRow,
  type SyncPlan,
} from "@/lib/apps/sync-plan";
import { createCliPrisma } from "./lib/cli-prisma";

const { values } = parseArgs({
  options: {
    apply: { type: "boolean", default: false },
    "confirm-archive": { type: "boolean", default: false },
  },
});

const tagRefs = (tags: string[]) => tags.map((slug) => ({ slug }));
const catalogData = ({ name, description, iconKey, sortOrder }: CatalogRow) => ({ name, description, iconKey, sortOrder });

function printPlan(plan: SyncPlan) {
  const rows = [
    ...plan.platforms.create.map((row) => ({ kind: "platform", action: "create", slug: row.slug, detail: "" })),
    ...plan.platforms.rename.map(({ from, row, changed }) => ({ kind: "platform", action: "RENAME", slug: `${from} -> ${row.slug}`, detail: changed.join(", ") })),
    ...plan.platforms.update.map(({ row, changed }) => ({ kind: "platform", action: "update", slug: row.slug, detail: changed.join(", ") })),
    ...plan.categories.create.map((row) => ({ kind: "category", action: "create", slug: row.slug, detail: "" })),
    ...plan.categories.update.map(({ row, changed }) => ({ kind: "category", action: "update", slug: row.slug, detail: changed.join(", ") })),
    ...plan.apps.create.map((row) => ({ kind: "app", action: "create", slug: row.slug, detail: "" })),
    ...plan.apps.update.map(({ row, changed }) => ({ kind: "app", action: "update", slug: row.slug, detail: changed.join(", ") })),
    ...plan.apps.archive.map((row) => ({ kind: "app", action: "ARCHIVE", slug: row.slug, detail: row.name })),
  ];
  if (rows.length) console.table(rows);
  else console.log("Nothing to change.");
  console.log(
    `Platforms: ${plan.platforms.create.length} create, ${plan.platforms.rename.length} rename, ${plan.platforms.update.length} update, ${plan.platforms.unchanged.length} unchanged. ` +
      `Categories: ${plan.categories.create.length} create, ${plan.categories.update.length} update, ${plan.categories.unchanged.length} unchanged. ` +
      `Apps: ${plan.apps.create.length} create, ${plan.apps.update.length} update, ${plan.apps.unchanged.length} unchanged, ${plan.apps.archive.length} archive.`,
  );
}

async function main() {
  const prisma = createCliPrisma();
  try {
    const [platformRows, categoryRows, appRows] = await Promise.all([
      prisma.platform.findMany(),
      prisma.appCategory.findMany(),
      prisma.app.findMany({
        include: {
          category: { select: { slug: true } },
          tags: { select: { slug: true } },
          platforms: { select: { platform: { select: { slug: true } } } },
          alternatives: { select: { alternative: { select: { slug: true } } }, orderBy: { position: "asc" } },
        },
      }),
    ]);

    // While the legacy row still exists under its old slug, joins to it already count as the new platform.
    const platformSlugs = new Set(platformRows.map((row) => row.slug));
    const renamedAs = new Map<string, string>();
    for (const [next, legacy] of Object.entries(LEGACY_PLATFORM_SLUGS)) {
      if (platformSlugs.has(legacy) && !platformSlugs.has(next)) renamedAs.set(legacy, next);
    }

    const existingApps: ExistingAppRow[] = appRows.map((row) => ({
      slug: row.slug,
      name: row.name,
      publisher: row.publisher,
      shortDescription: row.shortDescription,
      description: row.description,
      version: row.version,
      license: row.license,
      officialWebsite: row.officialWebsite,
      officialDownloadUrl: row.officialDownloadUrl,
      iconUrl: row.iconUrl,
      features: row.features,
      requirements: row.requirements,
      status: row.status,
      featured: row.featured,
      sortOrder: row.sortOrder,
      lastVerifiedAt: row.lastVerifiedAt ? row.lastVerifiedAt.toISOString() : null,
      categorySlug: row.category.slug,
      tags: row.tags.map((tag) => tag.slug),
      platforms: row.platforms.map(({ platform }) => renamedAs.get(platform.slug) ?? platform.slug),
      alternatives: row.alternatives.map(({ alternative }) => alternative.slug),
      publishedAt: row.publishedAt,
    }));

    const plan = buildSyncPlan({
      platforms: platformDefinitions,
      categories: appCategoryDefinitions,
      apps: appDefinitions,
      existingPlatforms: platformRows.map((row) => ({
        slug: row.slug,
        name: row.name,
        description: row.description,
        iconKey: row.iconKey,
        sortOrder: row.sortOrder,
      })),
      existingCategories: categoryRows.map((row) => ({
        slug: row.slug,
        name: row.name,
        description: row.description,
        iconKey: row.iconKey,
        sortOrder: row.sortOrder,
      })),
      existingApps,
    });
    printPlan(plan);

    if (!values.apply) {
      console.log("Dry run: nothing was written. Re-run with --apply to apply this plan.");
      return;
    }
    const guard = checkArchiveGuard(plan, values["confirm-archive"]);
    if (!guard.ok) {
      console.error(guard.reason);
      process.exitCode = 1;
      return;
    }

    // Platforms first: the rename keeps the row id, so existing app joins stay attached.
    for (const { from, row } of plan.platforms.rename) {
      await prisma.platform.update({ where: { slug: from }, data: { slug: row.slug, ...catalogData(row) } });
    }
    for (const row of [...plan.platforms.create, ...plan.platforms.update.map((entry) => entry.row)]) {
      await prisma.platform.upsert({ where: { slug: row.slug }, create: row, update: catalogData(row) });
    }
    for (const row of [...plan.categories.create, ...plan.categories.update.map((entry) => entry.row)]) {
      await prisma.appCategory.upsert({ where: { slug: row.slug }, create: row, update: catalogData(row) });
    }

    const allTags = new Set(appDefinitions.flatMap((app) => app.tags));
    for (const slug of allTags) {
      await prisma.tag.upsert({ where: { slug }, create: { slug, name: slug }, update: {} });
    }

    const now = new Date();
    const writes = [
      ...plan.apps.create.map((row) => ({ row, setPublishedAt: true, joins: true })),
      ...plan.apps.update.map(({ row, setPublishedAt, changed }) => ({
        row,
        setPublishedAt,
        joins: changed.includes("platforms") || changed.includes("alternatives"),
      })),
    ];
    for (const { row, setPublishedAt } of writes) {
      const { slug, categorySlug, tags, lastVerifiedAt } = row;
      // Joins (platforms, alternatives) are written separately below, once every app and platform exists.
      const data = {
        name: row.name,
        publisher: row.publisher,
        shortDescription: row.shortDescription,
        description: row.description,
        version: row.version,
        license: row.license,
        officialWebsite: row.officialWebsite,
        officialDownloadUrl: row.officialDownloadUrl,
        iconUrl: row.iconUrl,
        features: row.features,
        requirements: row.requirements,
        status: row.status as "PUBLISHED",
        featured: row.featured,
        sortOrder: row.sortOrder,
        lastVerifiedAt: lastVerifiedAt ? new Date(lastVerifiedAt) : null,
        category: { connect: { slug: categorySlug } },
      };
      await prisma.app.upsert({
        where: { slug },
        create: { slug, ...data, publishedAt: now, tags: { connect: tagRefs(tags) } },
        update: { ...data, ...(setPublishedAt ? { publishedAt: now } : {}), tags: { set: tagRefs(tags) } },
      });
    }

    // Joins need every app and platform to exist first. Alternatives are rewritten in position order.
    const platformIds = new Map((await prisma.platform.findMany({ select: { id: true, slug: true } })).map((row) => [row.slug, row.id]));
    const appIds = new Map((await prisma.app.findMany({ select: { id: true, slug: true } })).map((row) => [row.slug, row.id]));
    for (const { row, joins } of writes) {
      if (!joins) continue;
      const appId = appIds.get(row.slug)!;
      await prisma.appPlatform.deleteMany({ where: { appId } });
      await prisma.appPlatform.createMany({
        data: row.platforms.map((slug) => {
          const platformId = platformIds.get(slug);
          if (!platformId) throw new Error(`Unknown platform "${slug}" for app "${row.slug}"`);
          return { appId, platformId };
        }),
      });
      await prisma.appAlternative.deleteMany({ where: { appId } });
      await prisma.appAlternative.createMany({
        data: row.alternatives.map((slug, position) => {
          const alternativeId = appIds.get(slug);
          if (!alternativeId) throw new Error(`Unknown alternative "${slug}" for app "${row.slug}"`);
          return { appId, alternativeId, position };
        }),
      });
    }

    if (plan.apps.archive.length) {
      await prisma.app.updateMany({
        where: { slug: { in: plan.apps.archive.map((row) => row.slug) }, status: "PUBLISHED" },
        data: { status: "ARCHIVED" },
      });
    }
    console.log("Applied. Pages refresh on their ISR timer (10 min for /apps listings, 1 h for app pages).");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
