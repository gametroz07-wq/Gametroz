import { slugify } from "../text";
import type { NormalizedGame } from "../types";
import type { GameMonetizeGame } from "./types";

/**
 * Pure builder for the popularity-based initial catalog. It takes the raw items of the four
 * popularity feeds and returns an ordered, deduplicated plan; it never touches the network or the DB.
 */

/** Documented `popularity` feed values used by the plan. There is no "trending" feed: mostplayed stands in. */
export const POPULARITY_FEEDS = ["mostplayed", "bestgames", "hotgames", "editorpicks"] as const;
export type PopularityFeed = (typeof POPULARITY_FEEDS)[number];
export type PopularityFeeds = Record<PopularityFeed, GameMonetizeGame[]>;

export type PopularitySource = "trending" | "best" | "hot" | "editors_pick";

export const DEFAULT_PLAN_TARGET = 500;
export const MAX_PLAN_TARGET = 1000;

/** Groups in priority order with their share of the target (30/30/20/20 → 150/150/100/100 of 500). */
const GROUPS: readonly { source: PopularitySource; feed: PopularityFeed; share: number }[] = [
  { source: "trending", feed: "mostplayed", share: 0.3 },
  { source: "best", feed: "bestgames", share: 0.3 },
  { source: "hot", feed: "hotgames", share: 0.2 },
  { source: "editors_pick", feed: "editorpicks", share: 0.2 },
];
/** Remainder fill order. */
const FILL_ORDER: readonly (typeof GROUPS)[number][] = GROUPS;

const BANDS: Record<PopularitySource, number> = { best: 4000, hot: 3000, trending: 2000, editors_pick: 1000 };
const SOURCES = new Set<string>(Object.keys(BANDS));

/** Band by primary source plus the rank inside it (rank 1 → band + 999). Always stays inside its band. */
export function popularityScore(source: PopularitySource, sourceRank: number) {
  return BANDS[source] + Math.max(0, 999 - (sourceRank - 1));
}

export type PlanEntry = {
  /** Raw feed item, exactly as the feed sent it. */
  item: GameMonetizeGame;
  source: PopularitySource;
  /** 1-based position of the item in the feed named by `source`. */
  sourceRank: number;
  inTrending: boolean;
  inEditorsPick: boolean;
};

const idOf = (item: GameMonetizeGame) => (item.id ?? "").trim();

export function buildPopularityPlan(feeds: PopularityFeeds, target = DEFAULT_PLAN_TARGET): PlanEntry[] {
  if (!Number.isInteger(target) || target < 1 || target > MAX_PLAN_TARGET) {
    throw new Error(`target must be an integer between 1 and ${MAX_PLAN_TARGET}.`);
  }

  const takenIds = new Set<string>();
  const takenSlugs = new Set<string>();
  const selected: Pick<PlanEntry, "item" | "source" | "sourceRank">[] = [];
  const trendingGroupIds = new Set<string>();

  /** Takes the next eligible items of one feed, in feed order, until `quota` items were added. */
  const take = (source: PopularitySource, items: GameMonetizeGame[], quota: number) => {
    let added = 0;
    for (const [index, item] of items.entries()) {
      if (added >= quota) break;
      const id = idOf(item);
      const slug = slugify(item.title);
      // An item without id or slug can never be written, so it does not use up a slot.
      if (!id || !slug || takenIds.has(id) || takenSlugs.has(slug)) continue;
      takenIds.add(id);
      takenSlugs.add(slug);
      selected.push({ item, source, sourceRank: index + 1 });
      if (source === "trending") trendingGroupIds.add(id);
      added++;
    }
  };

  for (const group of GROUPS) take(group.source, feeds[group.feed], Math.floor(target * group.share));
  // The groups may fall short or round down; fill the rest from the remaining items in feed priority.
  for (const group of FILL_ORDER) {
    const remaining = target - selected.length;
    if (remaining <= 0) break;
    take(group.source, feeds[group.feed], remaining);
  }

  // Membership flags: trending is checked against the trending GROUP's selected ids (the curated top of
  // mostplayed, not remainder fill); editors pick is checked against the FULL editorpicks list, so a game
  // chosen for another source still gets featured when editors picked it.
  const editorsPickIds = new Set(feeds.editorpicks.map(idOf).filter(Boolean));
  return selected.map((entry) => ({
    ...entry,
    inTrending: trendingGroupIds.has(idOf(entry.item)),
    inEditorsPick: editorsPickIds.has(idOf(entry.item)),
  }));
}

/** Popularity metadata the sync writes for one plan entry. */
export function planEntryPopularity(entry: PlanEntry): NonNullable<NormalizedGame["popularity"]> {
  return {
    source: entry.source,
    rank: entry.sourceRank,
    score: popularityScore(entry.source, entry.sourceRank),
    trending: entry.inTrending,
    featured: entry.inEditorsPick,
  };
}

export type PopularitySnapshot = {
  fetchedAt: string;
  endpoint: string;
  params: Record<string, string>;
  target: number;
  entries: PlanEntry[];
};

/** Validates a snapshot read from disk. The file is operator-made, but is still parsed defensively. */
export function parsePlanSnapshot(value: unknown): PopularitySnapshot {
  if (!value || typeof value !== "object") throw new Error("Invalid plan file: expected a JSON object.");
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.entries)) throw new Error("Invalid plan file: entries must be an array.");

  const entries = record.entries.map((raw, index): PlanEntry => {
    const entry = raw as Partial<PlanEntry> | null;
    const valid =
      entry &&
      typeof entry === "object" &&
      entry.item &&
      typeof entry.item === "object" &&
      typeof entry.source === "string" &&
      SOURCES.has(entry.source) &&
      Number.isInteger(entry.sourceRank) &&
      (entry.sourceRank as number) >= 1;
    if (!valid) throw new Error(`Invalid plan file: entry ${index} is malformed.`);
    return {
      item: entry.item as GameMonetizeGame,
      source: entry.source as PopularitySource,
      sourceRank: entry.sourceRank as number,
      inTrending: entry.inTrending === true,
      inEditorsPick: entry.inEditorsPick === true,
    };
  });

  return {
    fetchedAt: typeof record.fetchedAt === "string" ? record.fetchedAt : "",
    endpoint: typeof record.endpoint === "string" ? record.endpoint : "",
    params: (record.params && typeof record.params === "object" ? record.params : {}) as Record<string, string>,
    target: typeof record.target === "number" ? record.target : entries.length,
    entries,
  };
}

/** Parses the --offset CLI value: required with --source plan, a non-negative integer. */
export function parseOffset(value: string | undefined) {
  if (value === undefined || !/^\d+$/.test(value)) throw new Error("--offset is required with --source plan and must be a non-negative integer.");
  return Number(value);
}

/** Exactly the entries [offset, offset + limit). */
export function selectPlanSlice(entries: PlanEntry[], offset: number, limit: number) {
  if (!Number.isInteger(offset) || offset < 0) throw new Error("--offset must be a non-negative integer.");
  return entries.slice(offset, offset + limit);
}
