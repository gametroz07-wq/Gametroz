/**
 * Syncs the Guides catalog from lib/guides/definitions.ts to the database.
 *   npm run guides:sync                         dry run: prints the plan and the reference check, writes nothing
 *   npm run guides:sync -- --apply              applies it
 *   npm run guides:sync -- --apply --confirm-archive   required when more than 10 guides would be archived
 *
 * Upserts guides (PUBLISHED; reading time derived from the body's word count; updatedAt taken from the definition),
 * their tags, and their relations to games, tools and apps, which are derived from every reference in the body
 * (inline links and item cards) so game, tool and app pages link back to the guides that mention them.
 * ARCHIVES published guides that are no longer defined. It never deletes rows.
 *
 * Reference check (dry run and apply): every referenced game must be PUBLISHED in the target database, every
 * tool and app must be defined, every guide link must point to a defined guide and every listing page must exist.
 * `--apply` refuses when anything is missing or unpublished, and when a referenced tool or app is not yet in the
 * database (run `npm run tools:sync` and `npm run apps:sync` first).
 */
import { parseArgs } from "node:util";
import { appCategoryDefinitions, appDefinitions, platformDefinitions } from "@/lib/apps/definitions";
import { extractReferences } from "@/lib/guides/blocks";
import { guideDefinitions } from "@/lib/guides/definitions";
import {
  buildSyncPlan,
  checkArchiveGuard,
  findMissingReferences,
  type ExistingGuideRow,
  type SyncPlan,
} from "@/lib/guides/sync-plan";
import { guideSections } from "@/lib/guide-sections";
import { toolCategoryDefinitions, toolDefinitions } from "@/lib/tools/definitions";
import type { GuideBlock } from "@/types/content";
import { createCliPrisma } from "./lib/cli-prisma";

const { values } = parseArgs({
  options: {
    apply: { type: "boolean", default: false },
    "confirm-archive": { type: "boolean", default: false },
  },
});

const tagRefs = (tags: string[]) => tags.map((slug) => ({ slug }));
const slugRefs = (slugs: string[]) => slugs.map((slug) => ({ slug }));

function printPlan(plan: SyncPlan) {
  const rows = [
    ...plan.create.map((row) => ({ action: "create", slug: row.slug, detail: `${row.section.toLowerCase()}, ${row.readingMinutes} min` })),
    ...plan.update.map(({ row, changed }) => ({ action: "update", slug: row.slug, detail: changed.join(", ") })),
    ...plan.archive.map((row) => ({ action: "ARCHIVE", slug: row.slug, detail: row.title })),
  ];
  if (rows.length) console.table(rows);
  else console.log("Nothing to change.");
  console.log(`Guides: ${plan.create.length} create, ${plan.update.length} update, ${plan.unchanged.length} unchanged, ${plan.archive.length} archive.`);
}

async function main() {
  const prisma = createCliPrisma();
  try {
    const rows = await prisma.guide.findMany({
      include: {
        tags: { select: { slug: true } },
        games: { select: { slug: true } },
        tools: { select: { slug: true } },
        apps: { select: { slug: true } },
      },
    });
    const existing: ExistingGuideRow[] = rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      section: row.section,
      body: row.body as unknown as GuideBlock[],
      readingMinutes: row.readingMinutes,
      status: row.status,
      featured: row.featured,
      sortOrder: row.sortOrder,
      publishedAt: row.publishedAt ? row.publishedAt.toISOString() : "",
      updatedAt: row.updatedAt.toISOString(),
      tags: row.tags.map((tag) => tag.slug),
      games: row.games.map((game) => game.slug),
      tools: row.tools.map((tool) => tool.slug),
      apps: row.apps.map((app) => app.slug),
    }));

    const plan = buildSyncPlan({ definitions: guideDefinitions, existing });
    printPlan(plan);

    // Reference check against the target database and the code definitions.
    const references = guideDefinitions.map((guide) => extractReferences(guide.body));
    const gameSlugs = [...new Set(references.flatMap((entry) => entry.games))];
    const toolSlugs = [...new Set(references.flatMap((entry) => entry.tools))];
    const appSlugs = [...new Set(references.flatMap((entry) => entry.apps))];
    const [gameRows, gameCategories, toolRows, appRows] = await Promise.all([
      prisma.game.findMany({ where: { slug: { in: gameSlugs } }, select: { slug: true, status: true } }),
      prisma.gameCategory.findMany({ select: { slug: true } }),
      prisma.tool.findMany({ where: { slug: { in: toolSlugs } }, select: { slug: true } }),
      prisma.app.findMany({ where: { slug: { in: appSlugs } }, select: { slug: true } }),
    ]);

    const problems = findMissingReferences(guideDefinitions, {
      games: new Map(gameRows.map((row) => [row.slug, row.status])),
      tools: new Set(toolDefinitions.map((tool) => tool.slug)),
      apps: new Set(appDefinitions.map((app) => app.slug)),
      pages: new Set([
        ...gameCategories.map((category) => `/games/${category.slug}`),
        ...toolCategoryDefinitions.map((category) => `/tools/${category.slug}`),
        ...platformDefinitions.map((platform) => `/apps/${platform.slug}`),
        ...appCategoryDefinitions.map((category) => `/apps/category/${category.slug}`),
        ...guideSections.map((section) => `/guides/${section.slug}`),
      ]),
    });
    const inDb = { tool: new Set(toolRows.map((row) => row.slug)), app: new Set(appRows.map((row) => row.slug)) };
    const notYetInDatabase = [
      ...toolSlugs.filter((slug) => !inDb.tool.has(slug)).map((slug) => `tool ${slug}`),
      ...appSlugs.filter((slug) => !inDb.app.has(slug)).map((slug) => `app ${slug}`),
    ];

    console.log(
      `References: ${gameSlugs.length} games, ${toolSlugs.length} tools, ${appSlugs.length} apps. ` +
        `${problems.length} problem(s), ${notYetInDatabase.length} tool/app reference(s) not yet in the database.`,
    );
    if (problems.length) console.table(problems);
    if (notYetInDatabase.length) {
      console.log(`Not yet in the database (run tools:sync / apps:sync first): ${notYetInDatabase.join(", ")}`);
    }
    const blocked = problems.length > 0 || notYetInDatabase.length > 0;
    if (problems.length) process.exitCode = 1;

    if (!values.apply) {
      console.log("Dry run: nothing was written. Re-run with --apply to apply this plan.");
      return;
    }
    if (blocked) {
      console.error("Refusing to apply: fix the references above first.");
      process.exitCode = 1;
      return;
    }
    const guard = checkArchiveGuard(plan, values["confirm-archive"]);
    if (!guard.ok) {
      console.error(guard.reason);
      process.exitCode = 1;
      return;
    }

    const allTags = new Set(guideDefinitions.flatMap((guide) => guide.tags));
    for (const slug of allTags) {
      await prisma.tag.upsert({ where: { slug }, create: { slug, name: slug }, update: {} });
    }

    const writes = [...plan.create, ...plan.update.map((entry) => entry.row)];
    for (const row of writes) {
      const data = {
        title: row.title,
        excerpt: row.excerpt,
        section: row.section as "GAMES" | "TOOLS" | "APPS",
        body: row.body as unknown as Parameters<typeof prisma.guide.create>[0]["data"]["body"],
        readingMinutes: row.readingMinutes,
        status: row.status as "PUBLISHED",
        featured: row.featured,
        sortOrder: row.sortOrder,
        publishedAt: new Date(row.publishedAt),
        // The page shows this date as "Updated ...", so the definition decides it, not the time of the sync.
        updatedAt: new Date(row.updatedAt),
      };
      await prisma.guide.upsert({
        where: { slug: row.slug },
        create: {
          slug: row.slug,
          ...data,
          tags: { connect: tagRefs(row.tags) },
          games: { connect: slugRefs(row.games) },
          tools: { connect: slugRefs(row.tools) },
          apps: { connect: slugRefs(row.apps) },
        },
        update: {
          ...data,
          tags: { set: tagRefs(row.tags) },
          games: { set: slugRefs(row.games) },
          tools: { set: slugRefs(row.tools) },
          apps: { set: slugRefs(row.apps) },
        },
      });
    }

    if (plan.archive.length) {
      await prisma.guide.updateMany({
        where: { slug: { in: plan.archive.map((row) => row.slug) }, status: "PUBLISHED" },
        data: { status: "ARCHIVED" },
      });
    }
    console.log("Applied. Pages refresh on their ISR timer (10 min for /guides listings, 1 h for guide pages).");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
