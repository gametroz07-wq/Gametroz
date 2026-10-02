import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GAMEMONETIZE_FEED_CATEGORIES, mapGameMonetizeCategory } from "../gamemonetize/config";
import { planFeedQueries } from "../gamemonetize/feed-plan";

describe("mapGameMonetizeCategory", () => {
  it("maps genre categories exactly", () => {
    for (const [raw, slug] of [["Arcade", "arcade"], ["Puzzles", "puzzle"], ["Racing", "racing"], ["Soccer", "sports"], ["Shooting", "action"], ["Hypercasual", "casual"], ["Bejeweled", "puzzle"], ["Fighting", "action"]] as const) {
      assert.deepEqual(mapGameMonetizeCategory(raw), { slug, match: "exact" }, raw);
    }
  });

  it("maps style/audience categories approximately so an editor confirms them", () => {
    for (const raw of ["Girls", "Boys", "3D", "Multiplayer", "2 Player", ".IO"]) {
      assert.equal(mapGameMonetizeCategory(raw).match, "approximate", raw);
    }
  });

  it("never fails on unknown categories: falls back to casual for review", () => {
    assert.deepEqual(mapGameMonetizeCategory("Brand New Thing"), { slug: "casual", match: "fallback" });
    assert.deepEqual(mapGameMonetizeCategory(undefined), { slug: "casual", match: "fallback" });
  });

  it("lists the 18 feed categories verified to return games", () => {
    assert.equal(GAMEMONETIZE_FEED_CATEGORIES.length, 18);
    assert.ok(GAMEMONETIZE_FEED_CATEGORIES.includes("Puzzles"));
    assert.ok(!GAMEMONETIZE_FEED_CATEGORIES.includes("Puzzle" as never));
  });
});

describe("planFeedQueries", () => {
  it("uses one newest query for batches up to 100", () => {
    assert.deepEqual(planFeedQueries(10), [{ amount: 10 }]);
    assert.deepEqual(planFeedQueries(50), [{ amount: 100 }]);
    assert.deepEqual(planFeedQueries(100), [{ amount: 100 }]);
  });

  it("fans out per category for larger batches (the feed has no pagination)", () => {
    const plan = planFeedQueries(500);
    assert.equal(plan.length, 1 + GAMEMONETIZE_FEED_CATEGORIES.length);
    assert.deepEqual(plan[0], { amount: 100 });
    assert.ok(plan.slice(1).every((query) => query.amount === 100 && typeof query.category === "string"));
  });
});
