import type { FetchOptions, GameProvider, ValidationContext } from "../types";
import { GameMonetizeClient, type GameMonetizeSource } from "./client";
import { GAMEMONETIZE } from "./config";
import { normalizeGameMonetizeGame } from "./mapper";
import type { GameMonetizeGame } from "./types";
import { validateGameMonetizeGame } from "./validator";

// The documented feed accepts amount=10|20|...; this phase never asks for more than 20.
const feedAmount = (limit: number) => (limit <= 10 ? 10 : 20);

export function createGameMonetizeProvider(source: GameMonetizeSource = "fixture"): GameProvider<GameMonetizeGame> {
  const client = new GameMonetizeClient(source);

  return {
    slug: GAMEMONETIZE.slug,
    name: GAMEMONETIZE.name,
    baseUrl: GAMEMONETIZE.baseUrl,
    embedHosts: GAMEMONETIZE.embedHosts,
    imageHosts: GAMEMONETIZE.imageHosts,

    async getGames({ limit }: FetchOptions) {
      const games = await client.fetchFeed(source === "live" ? { amount: feedAmount(limit) } : {});
      return games.slice(0, limit);
    },

    // The feed has no single-game endpoint, so this searches the latest page only.
    async getGame(id: string) {
      const games = await client.fetchFeed({ amount: 20 });
      return games.find((game) => game.id === id) ?? null;
    },

    getId: (game) => (game.id ?? "").trim(),
    normalize: normalizeGameMonetizeGame,
    validate: (game: GameMonetizeGame, context?: ValidationContext) => validateGameMonetizeGame(game, context),
  };
}
