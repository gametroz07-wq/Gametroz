import { GAMEMONETIZE_FEED_CATEGORIES } from "./config";
import type { GameMonetizeFeedQuery } from "./types";

// Amounts the feed accepts. Observed: requests return amount + 1 items and `page` is ignored,
// so the newest query tops out at ~100 games and larger batches need per-category queries.
const AMOUNTS = [10, 20, 30, 40, 100] as const;

/**
 * Queries needed to collect `limit` unique games. Up to 100: one "newest" query.
 * Above 100: the newest query plus one per verified category; the sync dedupes by id and stops
 * at `limit`.
 */
export function planFeedQueries(limit: number): GameMonetizeFeedQuery[] {
  const amount = AMOUNTS.find((value) => value >= limit) ?? 100;
  if (limit <= 100) return [{ amount }];
  return [{ amount: 100 }, ...GAMEMONETIZE_FEED_CATEGORIES.map((category) => ({ amount: 100 as const, category }))];
}
