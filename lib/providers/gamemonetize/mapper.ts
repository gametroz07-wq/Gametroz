import { parseDimension, slugify, splitTags, toPlainText, toShortDescription } from "../text";
import type { NormalizedGame } from "../types";
import { GAMEMONETIZE, mapGameMonetizeCategory } from "./config";
import type { GameMonetizeGame } from "./types";

/** Maps one GameMonetize feed item to Gametroz fields. Never trusts or renders provider HTML. */
export function normalizeGameMonetizeGame(game: GameMonetizeGame): NormalizedGame {
  const name = toPlainText(game.title);
  const description = toPlainText(game.description);
  const width = parseDimension(game.width);
  const height = parseDimension(game.height);
  const providerCategory = toPlainText(game.category);
  const category = mapGameMonetizeCategory(providerCategory);

  return {
    provider: GAMEMONETIZE.slug,
    providerGameId: (game.id ?? "").trim(),
    name,
    slug: slugify(name),
    shortDescription: toShortDescription(description),
    description,
    instructions: toPlainText(game.instructions),
    embedUrl: (game.url ?? "").trim(),
    thumbnailUrl: (game.thumb ?? "").trim(),
    // The feed has no hero image; editors can add one during review.
    heroImageUrl: null,
    orientation: width !== null && height !== null && height > width ? "PORTRAIT" : "LANDSCAPE",
    width,
    height,
    // The feed has no language field; GameMonetize games are listed in English.
    language: "en",
    category: category.slug,
    categoryMatch: category.match,
    providerCategory,
    tags: splitTags(game.tags),
    status: "REVIEW",
  };
}
