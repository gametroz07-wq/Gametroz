// Static facts about the GameMonetize integration. Hosts were observed in the public feed on 2026-10-01.

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
 * GameMonetize category → Gametroz GameCategory slug.
 * Unmapped categories ("3D", "AI", "2 Player", "Multiplayer", ...) are rejected until a mapping is added.
 */
export const GAMEMONETIZE_CATEGORY_MAP: Record<string, string> = {
  action: "action",
  shooting: "action",
  stickman: "action",
  adventure: "adventure",
  arcade: "arcade",
  ".io": "arcade",
  hypercasual: "casual",
  clicker: "casual",
  cooking: "casual",
  girls: "casual",
  boys: "casual",
  "baby hazel": "casual",
  puzzle: "puzzle",
  bejeweled: "puzzle",
  racing: "racing",
  sports: "sports",
  soccer: "sports",
};
