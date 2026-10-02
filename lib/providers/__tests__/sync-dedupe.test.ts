import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { duplicateGame, validGame } from "../gamemonetize/fixtures";
import { dedupeByProviderGameId, resolveSyncLimit, SYNC_BATCH_SIZES } from "../sync";

describe("sync helpers", () => {
  it("keeps the first occurrence of a repeated provider id", () => {
    const { unique, duplicates } = dedupeByProviderGameId([validGame, duplicateGame], (game) => game.id ?? "");
    assert.equal(unique.length, 1);
    assert.equal(unique[0].title, validGame.title);
    assert.equal(duplicates.length, 1);
  });
});

describe("resolveSyncLimit", () => {
  it("offers explicit batch sizes only", () => {
    assert.deepEqual([...SYNC_BATCH_SIZES], [10, 50, 100, 500]);
  });

  it("requires an explicit limit (never unlimited by accident)", () => {
    assert.throws(() => resolveSyncLimit(undefined, {}), /--limit is required/);
    assert.throws(() => resolveSyncLimit(Number.NaN, {}), /--limit is required/);
  });

  it("accepts the standard batches up to the default safety limit of 100", () => {
    assert.equal(resolveSyncLimit(10, {}), 10);
    assert.equal(resolveSyncLimit(50, {}), 50);
    assert.equal(resolveSyncLimit(100, {}), 100);
  });

  it("rejects sizes outside the batch list", () => {
    assert.throws(() => resolveSyncLimit(20, {}), /one of 10, 50, 100, 500/);
    assert.throws(() => resolveSyncLimit(1000, {}), /one of 10, 50, 100, 500/);
  });

  it("needs a raised safety limit and an explicit confirmation for 500", () => {
    assert.throws(() => resolveSyncLimit(500, {}), /safety limit of 100/);
    assert.throws(() => resolveSyncLimit(500, { max: 500 }), /--confirm-large/);
    assert.equal(resolveSyncLimit(500, { max: 500, confirmLarge: true }), 500);
  });

  it("clamps a configured safety limit above 500 back to 500", () => {
    assert.equal(resolveSyncLimit(500, { max: 99999, confirmLarge: true }), 500);
  });
});
