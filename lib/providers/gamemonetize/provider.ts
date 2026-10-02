import type { FetchOptions, GameProvider, ValidationContext } from "../types";
import { GameMonetizeClient, type GameMonetizeSource } from "./client";
import { GAMEMONETIZE } from "./config";
import { planFeedQueries } from "./feed-plan";
import { normalizeGameMonetizeGame } from "./mapper";
import { type PlanEntry, planEntryPopularity } from "./popularity-plan";
import type { GameMonetizeGame } from "./types";
import { validateGameMonetizeGame } from "./validator";

/** "plan" syncs a pre-selected slice of a popularity snapshot instead of querying the feed. */
export type GameMonetizeProviderSource = GameMonetizeSource | "plan";

type GameMonetizeProvider = GameProvider<GameMonetizeGame>;

export function createGameMonetizeProvider(
  source: GameMonetizeProviderSource = "fixture",
  planEntries: PlanEntry[] = [],
): GameMonetizeProvider {
  const client = new GameMonetizeClient(source === "plan" ? "fixture" : source);
  const popularityByItem = new Map<GameMonetizeGame, PlanEntry>(planEntries.map((entry) => [entry.item, entry]));

  return {
    slug: GAMEMONETIZE.slug,
    name: GAMEMONETIZE.name,
    baseUrl: GAMEMONETIZE.baseUrl,
    embedHosts: GAMEMONETIZE.embedHosts,
    imageHosts: GAMEMONETIZE.imageHosts,

    // Runs the feed plan (newest first, then per category) until `limit` unique games are collected.
    async getGames({ limit }: FetchOptions) {
      if (source === "plan") return planEntries.map((entry) => entry.item).slice(0, limit);
      if (source === "fixture") return (await client.fetchFeed()).slice(0, limit);
      const collected = new Map<string, GameMonetizeGame>();
      for (const query of planFeedQueries(limit)) {
        for (const game of await client.fetchFeed(query)) {
          const id = (game.id ?? "").trim();
          if (id && !collected.has(id)) collected.set(id, game);
          if (collected.size >= limit) return [...collected.values()];
        }
      }
      return [...collected.values()];
    },

    // The feed has no single-game endpoint, so this searches the newest 100 only.
    async getGame(id: string) {
      const games = await client.fetchFeed({ amount: 100 });
      return games.find((game) => game.id === id) ?? null;
    },

    getId: (game) => (game.id ?? "").trim(),
    getPopularity: (game) => {
      const entry = popularityByItem.get(game);
      return entry ? planEntryPopularity(entry) : undefined;
    },
    normalize: normalizeGameMonetizeGame,
    validate: (game: GameMonetizeGame, context?: ValidationContext) => validateGameMonetizeGame(game, context),
  };
}
