import { GAMEMONETIZE } from "./config";
import { gameMonetizeMockFeed } from "./fixtures";
import type { GameMonetizeFeedQuery, GameMonetizeGame } from "./types";

const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BYTES = 2_000_000;
// `amount=All` returns thousands of items, so popularity snapshots get a longer timeout and a larger cap.
const SNAPSHOT_TIMEOUT_MS = 60_000;
const SNAPSHOT_MAX_RESPONSE_BYTES = 40_000_000;

export type GameMonetizeSource = "fixture" | "live";

/** Live requests are off unless explicitly enabled; fixtures never touch the network. */
export function isLiveFeedEnabled() {
  return process.env.GAMEMONETIZE_FEED_ENABLED === "true";
}

const STRING_FIELDS = ["id", "title", "description", "instructions", "url", "category", "tags", "thumb", "width", "height"] as const;

/** Keeps only known string fields; anything else in the payload is dropped. */
function toFeedItem(value: unknown): GameMonetizeGame | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const item: GameMonetizeGame = {};
  for (const field of STRING_FIELDS) {
    const raw = record[field];
    if (typeof raw === "string" || typeof raw === "number") item[field] = String(raw);
  }
  return item;
}

export function buildFeedUrl(query: GameMonetizeFeedQuery = {}) {
  const url = new URL(GAMEMONETIZE.feedUrl);
  url.search = new URLSearchParams({
    format: "json",
    type: "html5",
    category: query.category ?? "All",
    popularity: query.popularity ?? "newest",
    company: query.company ?? "All",
    amount: String(query.amount ?? 10),
  }).toString();
  return url;
}

type RequestLimits = { timeoutMs: number; maxBytes: number };

export class GameMonetizeClient {
  constructor(private readonly source: GameMonetizeSource = "fixture") {}

  async fetchFeed(query: GameMonetizeFeedQuery = {}): Promise<GameMonetizeGame[]> {
    if (this.source === "fixture") {
      return gameMonetizeMockFeed.slice(0, typeof query.amount === "number" ? query.amount : gameMonetizeMockFeed.length);
    }
    return this.request(query, { timeoutMs: REQUEST_TIMEOUT_MS, maxBytes: MAX_RESPONSE_BYTES });
  }

  /** Whole popularity feed (`amount=All`) for the operator-side snapshot. Live only; never used by the site. */
  async fetchPopularityFeed(popularity: NonNullable<GameMonetizeFeedQuery["popularity"]>): Promise<GameMonetizeGame[]> {
    return this.request(
      { popularity, amount: "All" },
      { timeoutMs: SNAPSHOT_TIMEOUT_MS, maxBytes: SNAPSHOT_MAX_RESPONSE_BYTES },
    );
  }

  private async request(query: GameMonetizeFeedQuery, { timeoutMs, maxBytes }: RequestLimits): Promise<GameMonetizeGame[]> {
    if (!isLiveFeedEnabled()) {
      throw new Error("GameMonetize live feed is disabled. Set GAMEMONETIZE_FEED_ENABLED=true to allow network requests.");
    }

    const response = await fetch(buildFeedUrl(query), {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { accept: "application/json" },
    });
    if (!response.ok) throw new Error(`GameMonetize feed responded ${response.status}`);

    const body = await response.text();
    if (body.length > maxBytes) throw new Error("GameMonetize feed response is too large.");

    const data: unknown = JSON.parse(body);
    if (!Array.isArray(data)) throw new Error("GameMonetize feed did not return a JSON array.");
    return data.map(toFeedItem).filter((item): item is GameMonetizeGame => item !== null);
  }
}
