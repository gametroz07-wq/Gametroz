/**
 * Provider sync CLI.
 *   npm run provider:dryrun:gamemonetize               # dry run, fixtures, limit 20
 *   npm run provider:sync:gamemonetize -- --limit 5    # writes games in REVIEW
 *   ... -- --source live                               # real feed, needs GAMEMONETIZE_FEED_ENABLED=true
 */
import { parseArgs } from "node:util";
import { isProviderSlug, providerFactories } from "@/lib/providers/registry";
import { MAX_SYNC_LIMIT, syncProviderGames } from "@/lib/providers/sync";
import { createCliPrisma } from "./lib/cli-prisma";

const { values } = parseArgs({
  options: {
    provider: { type: "string" },
    limit: { type: "string", default: String(MAX_SYNC_LIMIT) },
    "dry-run": { type: "boolean", default: false },
    source: { type: "string", default: "fixture" },
  },
});

async function main() {
  const slug = values.provider ?? "";
  if (!isProviderSlug(slug)) throw new Error(`Unknown provider "${slug}". Known: ${Object.keys(providerFactories).join(", ")}`);
  if (values.source !== "fixture" && values.source !== "live") throw new Error('--source must be "fixture" or "live".');

  const prisma = createCliPrisma();
  try {
    const result = await syncProviderGames(providerFactories[slug](values.source), {
      prisma,
      limit: Number(values.limit),
      dryRun: values["dry-run"],
    });

    console.log(`\n${result.dryRun ? "DRY RUN — nothing was written" : "SYNC"} · ${result.provider} · source=${values.source} · limit=${result.limit}\n`);
    console.table(
      result.items.map((item) => ({
        id: item.providerGameId,
        slug: item.slug,
        action: result.dryRun ? `would ${item.outcome}` : item.outcome,
        validation: item.validation,
        issues: item.issues.map((issue) => issue.code).join(", "),
      })),
    );
    console.log(
      `received=${result.received} created=${result.created} updated=${result.updated} ignored=${result.ignored} ` +
        `rejected=${result.rejected} needsReview=${result.needsReview} failed=${result.failed}`,
    );
    console.log(`ImportRecord: ${result.importRecordId}${result.dryRun ? " (dry run)" : ""}`);
    if (!result.dryRun) console.log("New games are in REVIEW. Publish one with: npm run provider:publish -- --slug <slug>");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
