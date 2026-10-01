import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { duplicateGame, gameMonetizeMockFeed, validGame } from "../gamemonetize/fixtures";
import { assertSyncLimit, dedupeByProviderGameId, MAX_SYNC_LIMIT } from "../sync";

describe("sync helpers", () => {
  it("keeps the first occurrence of a repeated provider id", () => {
    const { unique, duplicates } = dedupeByProviderGameId([validGame, duplicateGame], (game) => game.id ?? "");
    assert.equal(unique.length, 1);
    assert.equal(unique[0].title, validGame.title);
    assert.equal(duplicates.length, 1);
  });

  it("caps syncs at 20 games during this phase", () => {
    assert.equal(MAX_SYNC_LIMIT, 20);
    assert.equal(assertSyncLimit(20), 20);
    assert.equal(assertSyncLimit(5), 5);
    assert.throws(() => assertSyncLimit(21), /at most 20/);
    assert.throws(() => assertSyncLimit(0), /at least 1/);
  });

  it("mock feed is larger than the limit", () => {
    assert.ok(gameMonetizeMockFeed.length > MAX_SYNC_LIMIT);
  });
});
