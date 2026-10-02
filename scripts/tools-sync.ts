/**
 * Syncs the Tools catalog from lib/tools/definitions.ts to the database.
 *   npm run tools:sync                         dry run: prints the plan, writes nothing
 *   npm run tools:sync -- --apply              applies it
 *   npm run tools:sync -- --apply --confirm-archive   required when more than 10 tools would be archived
 *
 * Upserts categories and tools (PUBLISHED, componentKey = slug, tags created as needed) and ARCHIVES
 * published tools that are no longer defined. It never deletes rows.
 */
import { parseArgs } from "node:util";
import { toolCategoryDefinitions, toolDefinitions } from "@/lib/tools/definitions";
import {
  buildSyncPlan,
  checkArchiveGuard,
  type CategoryRow,
  type ExistingToolRow,
  type SyncPlan,
} from "@/lib/tools/sync-plan";
import { createCliPrisma } from "./lib/cli-prisma";

const { values } = parseArgs({
  options: {
    apply: { type: "boolean", default: false },
    "confirm-archive": { type: "boolean", default: false },
  },
});

const tagRefs = (tags: string[]) => tags.map((slug) => ({ slug }));

function printPlan(plan: SyncPlan) {
  const rows = [
    ...plan.categories.create.map((row) => ({ kind: "category", action: "create", slug: row.slug, detail: "" })),
    ...plan.categories.update.map(({ row, changed }) => ({ kind: "category", action: "update", slug: row.slug, detail: changed.join(", ") })),
    ...plan.tools.create.map((row) => ({ kind: "tool", action: "create", slug: row.slug, detail: "" })),
    ...plan.tools.update.map(({ row, changed }) => ({ kind: "tool", action: "update", slug: row.slug, detail: changed.join(", ") })),
    ...plan.tools.archive.map((row) => ({ kind: "tool", action: "ARCHIVE", slug: row.slug, detail: row.name })),
  ];
  if (rows.length) console.table(rows);
  else console.log("Nothing to change.");
  console.log(
    `Categories: ${plan.categories.create.length} create, ${plan.categories.update.length} update, ${plan.categories.unchanged.length} unchanged. ` +
      `Tools: ${plan.tools.create.length} create, ${plan.tools.update.length} update, ${plan.tools.unchanged.length} unchanged, ${plan.tools.archive.length} archive.`,
  );
}

async function main() {
  const prisma = createCliPrisma();
  try {
    const [categoryRows, toolRows] = await Promise.all([
      prisma.toolCategory.findMany(),
      prisma.tool.findMany({ include: { category: { select: { slug: true } }, tags: { select: { slug: true } } } }),
    ]);
    const existingCategories: CategoryRow[] = categoryRows.map((row) => ({
      slug: row.slug,
      name: row.name,
      description: row.description,
      iconKey: row.iconKey,
      sortOrder: row.sortOrder,
    }));
    const existingTools: ExistingToolRow[] = toolRows.map((row) => ({
      slug: row.slug,
      name: row.name,
      shortDescription: row.shortDescription,
      description: row.description,
      howTo: row.howTo,
      iconKey: row.iconKey,
      componentKey: row.componentKey,
      status: row.status,
      featured: row.featured,
      popularity: row.popularity,
      sortOrder: row.sortOrder,
      categorySlug: row.category.slug,
      tags: row.tags.map((tag) => tag.slug),
      publishedAt: row.publishedAt,
    }));

    const plan = buildSyncPlan({
      categories: toolCategoryDefinitions,
      tools: toolDefinitions,
      existingCategories,
      existingTools,
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

    const now = new Date();
    for (const row of [...plan.categories.create, ...plan.categories.update.map((entry) => entry.row)]) {
      const { slug, ...data } = row;
      await prisma.toolCategory.upsert({ where: { slug }, create: { slug, ...data }, update: data });
    }

    const allTags = new Set(toolDefinitions.flatMap((tool) => tool.tags));
    for (const slug of allTags) {
      await prisma.tag.upsert({ where: { slug }, create: { slug, name: slug }, update: {} });
    }

    const writes = [
      ...plan.tools.create.map((row) => ({ row, setPublishedAt: true })),
      ...plan.tools.update.map(({ row, setPublishedAt }) => ({ row, setPublishedAt })),
    ];
    for (const { row, setPublishedAt } of writes) {
      const { slug, categorySlug, tags, status, ...fields } = row;
      const data = { ...fields, status: status as "PUBLISHED", category: { connect: { slug: categorySlug } } };
      await prisma.tool.upsert({
        where: { slug },
        create: { slug, ...data, publishedAt: now, tags: { connect: tagRefs(tags) } },
        update: { ...data, ...(setPublishedAt ? { publishedAt: now } : {}), tags: { set: tagRefs(tags) } },
      });
    }

    if (plan.tools.archive.length) {
      await prisma.tool.updateMany({
        where: { slug: { in: plan.tools.archive.map((row) => row.slug) }, status: "PUBLISHED" },
        data: { status: "ARCHIVED" },
      });
    }
    console.log("Applied. Pages refresh on their ISR timer (10 min for /tools, 1 h for tool pages).");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
