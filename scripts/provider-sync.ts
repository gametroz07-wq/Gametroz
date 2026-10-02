/**
 * Provider sync CLI. --limit is required: 10, 50, 100 or 500 (500 needs PROVIDER_SYNC_MAX=500 and
 * --confirm-large). New games always land in REVIEW; nothing is published.
 *   npm run provider:dryrun:gamemonetize -- --limit 10 --source live
 *   npm run provider:sync:gamemonetize   -- --limit 50 --source live
 * Live requests need GAMEMONETIZE_FEED_ENABLED=true. Thumbnails are checked remotely for live data.
 * Plan source: syncs entries [offset, offset + limit) of a popularity snapshot (npm run provider:plan:gamemonetize).
 *   npm run provider:sync:gamemonetize -- --source plan --plan-file plan.json --offset 0 --limit 100
 */
import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { parsePlanSnapshot, parseOffset, selectPlanSlice } from "@/lib/providers/gamemonetize/popularity-plan";
import { isProviderSlug, providerFactories } from "@/lib/providers/registry";
import { syncProviderGames } from "@/lib/providers/sync";
import { createCliPrisma } from "./lib/cli-prisma";

const { values } = parseArgs({
  options: {
    provider: { type: "string" },
    limit: { type: "string" },
    "dry-run": { type: "boolean", default: false },
    "confirm-large": { type: "boolean", default: false },
    "skip-image-check": { type: "boolean", default: false },
    source: { type: "string", default: "fixture" },
    "plan-file": { type: "string" },
    offset: { type: "string" },
  },
});

async function loadPlanSlice() {
  if (!values["plan-file"]) throw new Error("--plan-file <path> is required with --source plan.");
  const offset = parseOffset(values.offset);
  const limit = values.limit === undefined ? Number.NaN : Number(values.limit);
  const snapshot = parsePlanSnapshot(JSON.parse(await readFile(values["plan-file"], "utf8")));
  // The limit itself is validated by the sync service (10, 50, 100 or 500, safety limit, --confirm-large).
  return selectPlanSlice(snapshot.entries, offset, Number.isFinite(limit) ? limit : 0);
}

async function main() {
  const slug = values.provider ?? "";
  if (!isProviderSlug(slug)) throw new Error(`Unknown provider "${slug}". Known: ${Object.keys(providerFactories).join(", ")}`);
  if (values.source !== "fixture" && values.source !== "live" && values.source !== "plan") {
    throw new Error('--source must be "fixture", "live" or "plan".');
  }
  const planEntries = values.source === "plan" ? await loadPlanSlice() : undefined;
  if (values.source !== "plan" && (values["plan-file"] !== undefined || values.offset !== undefined)) {
    throw new Error("--plan-file and --offset only apply to --source plan.");
  }

  const prisma = createCliPrisma();
  try {
    const result = await syncProviderGames(providerFactories[slug](values.source, planEntries), {
      prisma,
      limit: values.limit === undefined ? Number.NaN : Number(values.limit),
      dryRun: values["dry-run"],
      maxLimit: Number(process.env.PROVIDER_SYNC_MAX) || undefined,
      confirmLarge: values["confirm-large"],
      checkImages: values.source !== "fixture" && !values["skip-image-check"],
    });

    console.log(`\n${result.dryRun ? "DRY RUN — nothing was written" : "SYNC"} · ${result.provider} · source=${values.source}${values.source === "plan" ? ` offset=${values.offset}` : ""} · limit=${result.limit}\n`);
    console.table(
      result.items.map((item) => ({
        id: item.providerGameId,
        ...(item.source ? { source: item.source } : {}),
        slug: item.slug,
        action: result.dryRun ? `would ${item.outcome}` : item.outcome,
        validation: item.validation,
        issues: [...new Set(item.issues.map((issue) => issue.code))].join(", "),
      })),
    );
    console.log(
      `received=${result.received} created=${result.created} updated=${result.updated} ignored=${result.ignored} ` +
        `rejected=${result.rejected} needsReview=${result.needsReview} failed=${result.failed}`,
    );
    console.log(`ImportRecord: ${result.importRecordId}${result.dryRun ? " (dry run)" : ""}`);
    if (!result.dryRun) console.log("New games are in REVIEW. Inspect with npm run provider:review -- --issues, then publish explicitly.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
