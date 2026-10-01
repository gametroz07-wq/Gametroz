/**
 * ⚠️ PROVIDER MOCK DATA — NOT REAL GAMEMONETIZE CONTENT.
 *
 * Fake games shaped like the GameMonetize feed, used for tests and local syncs while
 * gametroz.online is not live. Every id starts with "fixture-", and the publish script
 * refuses to publish these records. The embed and thumbnail paths do not exist.
 */
import type { GameMonetizeGame } from "./types";

const embed = (id: string) => `https://html5.gamemonetize.co/${id}/`;
const thumb = (id: string) => `https://img.gamemonetize.com/${id}/512x384.jpg`;

const LONG_DESCRIPTION =
  "A fast and colorful browser game with short levels, simple controls and plenty of challenges to unlock.";

export const validGame: GameMonetizeGame = {
  id: "fixture-1001",
  title: "Fixture Turbo Rally",
  description: `<p>Race through <b>desert</b> tracks &amp; beat the clock.</p> ${LONG_DESCRIPTION}`,
  instructions: "Use the arrow keys to drive. Press space for nitro.",
  url: embed("fixture-1001"),
  category: "Racing",
  tags: "Cars, Racing, Desert,  Arcade ",
  thumb: thumb("fixture-1001"),
  width: "1280",
  height: "720",
};

export const gameWithoutThumbnail: GameMonetizeGame = {
  ...validGame,
  id: "fixture-1002",
  title: "Fixture No Thumbnail",
  url: embed("fixture-1002"),
  thumb: "",
};

export const gameWithDisallowedEmbed: GameMonetizeGame = {
  ...validGame,
  id: "fixture-1003",
  title: "Fixture Disallowed Embed",
  url: "https://games.example.com/fixture-1003/",
  thumb: thumb("fixture-1003"),
};

/** Same id as validGame: the feed repeats an item. */
export const duplicateGame: GameMonetizeGame = { ...validGame, title: "Fixture Turbo Rally (repeat)" };

export const gameWithMissingFields: GameMonetizeGame = {
  id: "fixture-1004",
  title: "",
  url: embed("fixture-1004"),
  thumb: thumb("fixture-1004"),
};

export const gameWithHttpEmbed: GameMonetizeGame = {
  ...validGame,
  id: "fixture-1005",
  title: "Fixture Insecure Embed",
  url: "http://html5.gamemonetize.co/fixture-1005/",
  thumb: thumb("fixture-1005"),
};

export const gameWithShortDescription: GameMonetizeGame = {
  ...validGame,
  id: "fixture-1006",
  title: "Fixture Short Description",
  description: "Fun game.",
  url: embed("fixture-1006"),
  thumb: thumb("fixture-1006"),
};

export const gameWithUnmappedCategory: GameMonetizeGame = {
  ...validGame,
  id: "fixture-1007",
  title: "Fixture Unmapped Category",
  category: "3D",
  url: embed("fixture-1007"),
  thumb: thumb("fixture-1007"),
};

export const gameWithUnreasonableSize: GameMonetizeGame = {
  ...validGame,
  id: "fixture-1008",
  title: "Fixture Huge Canvas",
  width: "99999",
  height: "abc",
  url: embed("fixture-1008"),
  thumb: thumb("fixture-1008"),
};

export const portraitGame: GameMonetizeGame = {
  ...validGame,
  id: "fixture-1009",
  title: "Fixture Tall Tower",
  category: "Puzzle",
  width: "720",
  height: "1280",
  url: embed("fixture-1009"),
  thumb: thumb("fixture-1009"),
};

/** Title collides with the seeded editorial game "Neon Drift". */
export const gameWithTakenSlug: GameMonetizeGame = {
  ...validGame,
  id: "fixture-1010",
  title: "Neon Drift",
  url: embed("fixture-1010"),
  thumb: thumb("fixture-1010"),
};

const extraCategories = ["Action", "Arcade", "Puzzle", "Sports", "Hypercasual", "Adventure", "Soccer", "Shooting"];

/** Generated valid games so the mock feed is larger than the 20-game sync limit. */
const generatedGames: GameMonetizeGame[] = Array.from({ length: 12 }, (_, index) => {
  const id = `fixture-${2001 + index}`;
  return {
    id,
    title: `Fixture Arcade Game ${index + 1}`,
    description: LONG_DESCRIPTION,
    instructions: "Click or tap to play.",
    url: embed(id),
    category: extraCategories[index % extraCategories.length],
    tags: "Arcade, Casual",
    thumb: thumb(id),
    width: "960",
    height: "600",
  };
});

/** Mock feed: 22 items covering every validation case. */
export const gameMonetizeMockFeed: GameMonetizeGame[] = [
  validGame,
  gameWithoutThumbnail,
  gameWithDisallowedEmbed,
  duplicateGame,
  gameWithMissingFields,
  gameWithHttpEmbed,
  gameWithShortDescription,
  gameWithUnmappedCategory,
  gameWithUnreasonableSize,
  portraitGame,
  gameWithTakenSlug,
  ...generatedGames,
].slice(0, 22);
