import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { gameWithMissingFields, gameWithUnmappedCategory, gameWithUnreasonableSize, portraitGame, validGame } from "../gamemonetize/fixtures";
import { normalizeGameMonetizeGame } from "../gamemonetize/mapper";

describe("GameMonetize mapper", () => {
  it("normalizes a valid feed item", () => {
    const game = normalizeGameMonetizeGame(validGame);
    assert.equal(game.provider, "gamemonetize");
    assert.equal(game.providerGameId, "fixture-1001");
    assert.equal(game.name, "Fixture Turbo Rally");
    assert.equal(game.slug, "fixture-turbo-rally");
    assert.equal(game.embedUrl, "https://html5.gamemonetize.co/fixture-1001/");
    assert.equal(game.thumbnailUrl, "https://img.gamemonetize.com/fixture-1001/512x384.jpg");
    assert.equal(game.heroImageUrl, null);
    assert.equal(game.width, 1280);
    assert.equal(game.height, 720);
    assert.equal(game.orientation, "LANDSCAPE");
    assert.equal(game.language, "en");
    assert.equal(game.category, "racing");
    assert.deepEqual(game.tags, ["cars", "racing", "desert", "arcade"]);
  });

  it("always imports as REVIEW", () => {
    assert.equal(normalizeGameMonetizeGame(validGame).status, "REVIEW");
  });

  it("strips HTML and decodes entities from text", () => {
    const game = normalizeGameMonetizeGame(validGame);
    assert.ok(game.description.startsWith("Race through desert tracks & beat the clock."));
    assert.ok(!/[<>]/.test(game.description));
  });

  it("builds a short description of at most 160 characters", () => {
    const game = normalizeGameMonetizeGame(validGame);
    assert.ok(game.shortDescription.length > 0 && game.shortDescription.length <= 160);
  });

  it("detects portrait games", () => {
    assert.equal(normalizeGameMonetizeGame(portraitGame).orientation, "PORTRAIT");
  });

  it("maps the plural \"Puzzles\" category used by the live feed", () => {
    assert.equal(normalizeGameMonetizeGame({ ...validGame, category: "Puzzles" }).category, "puzzle");
  });

  it("falls back to casual for unmapped categories, keeping the original label", () => {
    const game = normalizeGameMonetizeGame(gameWithUnmappedCategory);
    assert.equal(game.category, "casual");
    assert.equal(game.categoryMatch, "fallback");
    assert.equal(game.providerCategory, "Brand New Genre");
  });

  it("tolerates missing fields and non-numeric sizes", () => {
    const game = normalizeGameMonetizeGame(gameWithMissingFields);
    assert.equal(game.name, "");
    assert.equal(game.slug, "");
    assert.equal(game.description, "");
    assert.deepEqual(game.tags, []);
    const sized = normalizeGameMonetizeGame(gameWithUnreasonableSize);
    assert.equal(sized.width, 99999);
    assert.equal(sized.height, null);
  });
});
