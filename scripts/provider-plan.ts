/**
 * Builds a popularity snapshot of the GameMonetize catalog (operator machine only, no DB access).
 *   GAMEMONETIZE_FEED_ENABLED=true npm run provider:plan:gamemonetize -- --target 500 --out plan.json
 * Fetches the mostplayed, bestgames, hotgames and editorpicks feeds (amount=All), selects the games
 * (see lib/providers/gamemonetize/popularity-plan.ts) and writes the entries as JSON. Sync the result in
 * batches with: npm run provider:sync:gamemonetize -- --source plan --plan-file plan.json --offset 0 --limit 100
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { parseArgs } from "node:util";
import { GameMonetizeClient, buildFeedUrl, isLiveFeedEnabled } from "@/lib/providers/gamemonetize/client";
import {
  DEFAULT_PLAN_TARGET,
  MAX_PLAN_TARGET,
  POPULARITY_FEEDS,
  buildPopularityPlan,
  type PopularityFeeds,
  type PopularitySnapshot,
} from "@/lib/providers/gamemonetize/popularity-plan";
import { toPlainText } from "@/lib/providers/text";

const { values } = parseArgs({
  options: {
    target: { type: "string", default: String(DEFAULT_PLAN_TARGET) },
    out: { type: "string" },
  },
});

async function main() {
  if (!isLiveFeedEnabled()) throw new Error("Set GAMEMONETIZE_FEED_ENABLED=true to fetch the live feeds.");
  if (!values.out) throw new Error("--out <path> is required.");
  const target = /^\d+$/.test(values.target ?? "") ? Number(values.target) : Number.NaN;
  if (!Number.isInteger(target) || target < 1 || target > MAX_PLAN_TARGET) {
    throw new Error(`--target must be an integer between 1 and ${MAX_PLAN_TARGET}.`);
  }

  const client = new GameMonetizeClient("live");
  const feeds = {} as PopularityFeeds;
  for (const popularity of POPULARITY_FEEDS) {
    feeds[popularity] = await client.fetchPopularityFeed(popularity);
    console.log(`fetched ${popularity}: ${feeds[popularity].length} items`);
  }

  const entries = buildPopularityPlan(feeds, target);
  const endpoint = buildFeedUrl({ amount: "All" });
  const snapshot: PopularitySnapshot = {
    fetchedAt: new Date().toISOString(),
    endpoint: `${endpoint.origin}${endpoint.pathname}`,
    params: { format: "json", category: "All", type: "html5", popularity: "<feed>", company: "All", amount: "All" },
    target,
    entries,
  };

  const out = resolve(values.out);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  const tally = (keyOf: (entry: (typeof entries)[number]) => string) => {
    const counts: Record<string, number> = {};
    for (const entry of entries) counts[keyOf(entry)] = (counts[keyOf(entry)] ?? 0) + 1;
    return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1]));
  };
  console.log(`\nPlan: ${entries.length} of target ${target} → ${out}`);
  console.log("\nBy source:");
  console.table(tally((entry) => entry.source));
  console.log("By provider category:");
  console.table(tally((entry) => toPlainText(entry.item.category) || "(none)"));
  if (entries.length < target) console.warn(`Warning: the feeds only produced ${entries.length} eligible games.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
