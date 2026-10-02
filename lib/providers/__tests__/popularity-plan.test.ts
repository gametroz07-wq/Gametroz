import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { GameMonetizeGame } from "../gamemonetize/types";
import {
  buildPopularityPlan,
  parsePlanSnapshot,
  planEntryPopularity,
  popularityScore,
  parseOffset,
  selectPlanSlice,
  type PopularityFeeds,
} from "../gamemonetize/popularity-plan";

const item = (id: string, title = `Game ${id}`): GameMonetizeGame => ({ id, title });
const feed = (prefix: string, count: number) => Array.from({ length: count }, (_, i) => item(`${prefix}${i + 1}`));

const feeds = (overrides: Partial<PopularityFeeds> = {}): PopularityFeeds => ({
  mostplayed: feed("m", 20),
  bestgames: feed("b", 20),
  hotgames: feed("h", 20),
  editorpicks: feed("e", 20),
  ...overrides,
});

describe("popularityScore", () => {
  it("uses one band per source and ranks inside the band", () => {
    assert.equal(popularityScore("best", 1), 4999);
    assert.equal(popularityScore("hot", 1), 3999);
    assert.equal(popularityScore("trending", 1), 2999);
    assert.equal(popularityScore("editors_pick", 1), 1999);
    assert.equal(popularityScore("best", 2), 4998);
    assert.equal(popularityScore("hot", 1000), 3000);
    assert.equal(popularityScore("hot", 5000), 3000);
  });
});

describe("buildPopularityPlan", () => {
  it("takes 30/30/20/20 percent per group in priority order", () => {
    const plan = buildPopularityPlan(feeds(), 10);
    assert.equal(plan.length, 10);
    assert.deepEqual(
      plan.map((entry) => entry.item.id),
      ["m1", "m2", "m3", "b1", "b2", "b3", "h1", "h2", "e1", "e2"],
    );
    assert.deepEqual(
      plan.map((entry) => entry.source),
      ["trending", "trending", "trending", "best", "best", "best", "hot", "hot", "editors_pick", "editors_pick"],
    );
    assert.deepEqual(plan.slice(0, 4).map((entry) => entry.sourceRank), [1, 2, 3, 1]);
  });

  it("defaults to a 500 target with 150/150/100/100 groups", () => {
    const big = (prefix: string) => feed(prefix, 600);
    const plan = buildPopularityPlan({ mostplayed: big("m"), bestgames: big("b"), hotgames: big("h"), editorpicks: big("e") });
    assert.equal(plan.length, 500);
    const count = (source: string) => plan.filter((entry) => entry.source === source).length;
    assert.deepEqual([count("trending"), count("best"), count("hot"), count("editors_pick")], [150, 150, 100, 100]);
  });

  it("skips ids and slugs already taken and keeps the feed rank", () => {
    const plan = buildPopularityPlan(
      feeds({
        mostplayed: [item("m1", "Alpha"), item("m2", "Beta"), item("m3", "Gamma"), item("m4", "Delta")],
        // b1 repeats id m1, b2 collides by slug with "Beta", b3 is new.
        bestgames: [item("m1", "Alpha"), item("b2", "Beta!"), item("b3", "Epsilon"), item("b4", "Zeta"), item("b5", "Eta")],
      }),
      10,
    );
    const best = plan.filter((entry) => entry.source === "best");
    assert.deepEqual(best.map((entry) => entry.item.id), ["b3", "b4", "b5"]);
    assert.deepEqual(best.map((entry) => entry.sourceRank), [3, 4, 5]);
    assert.equal(new Set(plan.map((entry) => entry.item.id)).size, plan.length);
  });

  it("skips items without id or without a usable slug", () => {
    const plan = buildPopularityPlan(
      feeds({ mostplayed: [item("", "No id"), item("x1", "!!!"), item("x2", "Real Game"), ...feed("m", 5)] }),
      10,
    );
    assert.ok(plan.every((entry) => entry.item.id));
    assert.equal(plan[0].item.id, "x2");
    assert.equal(plan[0].sourceRank, 3);
  });

  it("fills the remainder from mostplayed, bestgames, hotgames, editorpicks in order", () => {
    const plan = buildPopularityPlan(
      { mostplayed: feed("m", 8), bestgames: feed("b", 3), hotgames: feed("h", 2), editorpicks: feed("e", 2) },
      10,
    );
    assert.equal(plan.length, 10);
    // Groups: m1-3, b1-3, h1-2, e1-2 = 10 exactly, so no fill is needed here.
    const short = buildPopularityPlan(
      { mostplayed: feed("m", 8), bestgames: feed("b", 1), hotgames: feed("h", 1), editorpicks: feed("e", 1) },
      10,
    );
    assert.equal(short.length, 10);
    assert.deepEqual(
      short.map((entry) => entry.item.id),
      ["m1", "m2", "m3", "b1", "h1", "e1", "m4", "m5", "m6", "m7"],
    );
    assert.equal(short[6].source, "trending");
    assert.equal(short[6].sourceRank, 4);
  });

  it("flags trending membership by the trending group and editors pick membership by the full list", () => {
    const plan = buildPopularityPlan(
      feeds({ mostplayed: [item("m1"), item("m2"), item("m3"), item("m4")], editorpicks: [item("m2"), item("e2"), item("e3"), item("m4")] }),
      10,
    );
    const byId = new Map(plan.map((entry) => [entry.item.id, entry]));
    assert.equal(byId.get("m1")?.inTrending, true);
    assert.equal(byId.get("m1")?.inEditorsPick, false);
    // m2 is taken by trending first, and is also an editors pick.
    assert.equal(byId.get("m2")?.source, "trending");
    assert.equal(byId.get("m2")?.inEditorsPick, true);
    assert.equal(byId.get("b1")?.inTrending, false);
    assert.equal(byId.get("e2")?.inEditorsPick, true);
    // m4 sits outside the 3-game trending group, so it is not "trending" even if present in the feed.
    assert.equal(byId.has("m4") ? byId.get("m4")?.inTrending : false, false);
  });

  it("returns fewer entries when the feeds cannot reach the target", () => {
    const plan = buildPopularityPlan({ mostplayed: feed("m", 2), bestgames: [], hotgames: [], editorpicks: [] }, 10);
    assert.equal(plan.length, 2);
  });

  it("rejects an invalid target", () => {
    assert.throws(() => buildPopularityPlan(feeds(), 0), /target/i);
    assert.throws(() => buildPopularityPlan(feeds(), 1001), /target/i);
    assert.throws(() => buildPopularityPlan(feeds(), 1.5), /target/i);
  });
});

describe("planEntryPopularity", () => {
  it("maps an entry to the metadata the sync writes", () => {
    const [entry] = buildPopularityPlan(feeds({ editorpicks: [item("m1"), ...feed("e", 5)] }), 10);
    assert.deepEqual(planEntryPopularity(entry), { source: "trending", rank: 1, score: 2999, trending: true, featured: true });
  });
});

describe("parsePlanSnapshot / selectPlanSlice", () => {
  const snapshot = () => ({
    fetchedAt: "2026-10-01T00:00:00.000Z",
    endpoint: "https://gamemonetize.com/rssfeed.php",
    params: {},
    target: 10,
    entries: buildPopularityPlan(feeds(), 10),
  });

  it("round-trips a snapshot through JSON", () => {
    const parsed = parsePlanSnapshot(JSON.parse(JSON.stringify(snapshot())));
    assert.equal(parsed.entries.length, 10);
    assert.equal(parsed.entries[0].item.id, "m1");
  });

  it("rejects malformed snapshots", () => {
    assert.throws(() => parsePlanSnapshot(null), /plan/i);
    assert.throws(() => parsePlanSnapshot({ entries: "nope" }), /entries/i);
    assert.throws(() => parsePlanSnapshot({ entries: [{ item: {}, source: "weird", sourceRank: 1 }] }), /entry 0/i);
    assert.throws(() => parsePlanSnapshot({ entries: [{ item: { id: "1" }, source: "best", sourceRank: 0 }] }), /entry 0/i);
  });

  it("selects exactly [offset, offset + limit)", () => {
    const { entries } = snapshot();
    assert.deepEqual(selectPlanSlice(entries, 2, 3).map((entry) => entry.item.id), ["m3", "b1", "b2"]);
    assert.equal(selectPlanSlice(entries, 8, 100).length, 2);
    assert.equal(selectPlanSlice(entries, 50, 10).length, 0);
  });

  it("requires a non-negative integer offset", () => {
    const { entries } = snapshot();
    assert.throws(() => selectPlanSlice(entries, -1, 10), /offset/i);
    assert.throws(() => selectPlanSlice(entries, 1.5, 10), /offset/i);
    assert.throws(() => selectPlanSlice(entries, Number.NaN, 10), /offset/i);
  });
});

describe("parseOffset", () => {
  it("accepts non-negative integers only and requires a value", () => {
    assert.equal(parseOffset("0"), 0);
    assert.equal(parseOffset("300"), 300);
    for (const bad of [undefined, "", "-1", "1.5", "abc", "1e3", " 5"]) {
      assert.throws(() => parseOffset(bad), /--offset/, String(bad));
    }
  });
});
