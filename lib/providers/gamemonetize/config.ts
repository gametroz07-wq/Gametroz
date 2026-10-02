// Static facts about the GameMonetize integration, verified against the live feed on 2026-10-01.

export const GAMEMONETIZE = {
  slug: "gamemonetize",
  name: "GameMonetize",
  baseUrl: "https://gamemonetize.com",
  /** Documented by the public RSS builder (https://gamemonetize.com/rss-builder). No API key is required. */
  feedUrl: "https://gamemonetize.com/rssfeed.php",
  embedHosts: ["html5.gamemonetize.co"],
  imageHosts: ["img.gamemonetize.com"],
} as const;

/**
 * Feed `category` values that actually return games (probed 2026-10-01). The RSS builder also lists
 * "Puzzle", "Stickman", "Baby Hazel" and "AI", which return nothing; the feed itself sends "Puzzles".
 */
export const GAMEMONETIZE_FEED_CATEGORIES = [
  "Arcade",
  "Action",
  "Adventure",
  "Puzzles",
  "Racing",
  "Sports",
  "Soccer",
  "Shooting",
  "Hypercasual",
  "Clicker",
  "Cooking",
  "Bejeweled",
  "Girls",
  "Boys",
  "3D",
  "Multiplayer",
  "2 Player",
  ".IO",
] as const;

export type CategoryMatch = "exact" | "approximate" | "fallback";

/** Where unknown categories land. They are imported for review, never rejected. */
export const FALLBACK_CATEGORY = "casual";

/**
 * GameMonetize category → Gametroz GameCategory slug.
 * "exact": the genre matches. "approximate": a style/audience label (3D, Girls, Multiplayer...)
 * mapped to the closest genre, which an editor must confirm before publishing.
 */
const CATEGORY_MAP: Record<string, { slug: string; match: Exclude<CategoryMatch, "fallback"> }> = {
  action: { slug: "action", match: "exact" },
  shooting: { slug: "action", match: "exact" },
  stickman: { slug: "action", match: "approximate" },
  adventure: { slug: "adventure", match: "exact" },
  arcade: { slug: "arcade", match: "exact" },
  ".io": { slug: "arcade", match: "approximate" },
  "2 player": { slug: "arcade", match: "approximate" },
  multiplayer: { slug: "arcade", match: "approximate" },
  "3d": { slug: "arcade", match: "approximate" },
  hypercasual: { slug: "casual", match: "exact" },
  clicker: { slug: "casual", match: "exact" },
  cooking: { slug: "casual", match: "exact" },
  girls: { slug: "casual", match: "approximate" },
  boys: { slug: "casual", match: "approximate" },
  "baby hazel": { slug: "casual", match: "approximate" },
  puzzle: { slug: "puzzle", match: "exact" },
  // The live feed sends "Puzzles" (plural) although the RSS builder lists "Puzzle".
  puzzles: { slug: "puzzle", match: "exact" },
  bejeweled: { slug: "puzzle", match: "exact" },
  racing: { slug: "racing", match: "exact" },
  sports: { slug: "sports", match: "exact" },
  soccer: { slug: "sports", match: "exact" },
  strategy: { slug: "strategy", match: "exact" },
};

export function mapGameMonetizeCategory(raw: string | undefined): { slug: string; match: CategoryMatch } {
  const mapped = CATEGORY_MAP[(raw ?? "").trim().toLowerCase()];
  return mapped ? { slug: mapped.slug, match: mapped.match } : { slug: FALLBACK_CATEGORY, match: "fallback" };
}
