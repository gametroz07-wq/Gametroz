import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  appDescription,
  appIconAlt,
  appTitle,
  extendDescription,
  fitTitle,
  gameCategoryDescription,
  gameCategoryIntro,
  gameCategoryTitle,
  gameImageAlt,
  limitDescription,
  platformIntro,
} from "../templates";

const SUFFIX = " | Gametroz";

describe("fitTitle", () => {
  it("returns the first candidate that fits 60 characters with the site suffix", () => {
    const long = "A".repeat(55);
    assert.equal(fitTitle([long, "Short one"]), "Short one");
    assert.equal(fitTitle(["Fits fine", "Never used"]), "Fits fine");
  });

  it("falls back to the shortest candidate when nothing fits", () => {
    assert.equal(fitTitle(["B".repeat(80), "C".repeat(70)]), "C".repeat(70));
  });
});

describe("appTitle", () => {
  it("keeps long app titles within 60 characters", () => {
    const title = appTitle("VLC Media Player");
    assert.equal(title, "VLC Media Player: Free Download & Features");
    assert.ok(title.length + SUFFIX.length <= 60);
  });

  it("drops the extras for long names", () => {
    const title = appTitle("Extremely Long Application Name");
    assert.ok(title.length + SUFFIX.length <= 60);
    assert.ok(title.startsWith("Extremely Long Application Name"));
  });
});

describe("limitDescription", () => {
  it("leaves short text alone and cuts long text at a word boundary", () => {
    assert.equal(limitDescription("Short.", 160), "Short.");
    const cut = limitDescription("word ".repeat(60).trim(), 160);
    assert.ok(cut.length <= 160);
    assert.ok(cut.endsWith("…"));
    assert.ok(!cut.includes("wor…"));
  });
});

describe("appDescription", () => {
  it("adds the standard tail only while it fits in 160 characters", () => {
    assert.equal(
      appDescription("Free player for almost any video or audio format."),
      "Free player for almost any video or audio format. Official download link, features, requirements and alternatives.",
    );
    assert.ok(appDescription("X".repeat(120)).length <= 160);
  });
});

describe("extendDescription", () => {
  const tails = ["First tail sentence that adds some more useful detail.", "Second tail sentence with a little more detail again."];

  it("appends tails until the minimum length is reached", () => {
    const out = extendDescription("Base text.", tails, { min: 60, max: 160 });
    assert.equal(out, "Base text. First tail sentence that adds some more useful detail.");
  });

  it("does not exceed the maximum and does not touch long text", () => {
    const long = "L".repeat(130);
    assert.equal(extendDescription(long, tails, { min: 120, max: 160 }), long);
    const out = extendDescription("L".repeat(100), tails, { min: 120, max: 130 });
    assert.ok(out.length <= 130);
  });
});

describe("gameCategoryTitle", () => {
  it("uses the category title template", () => {
    assert.equal(gameCategoryTitle("Racing"), "Free Racing Games - Play Online");
    assert.ok(gameCategoryTitle("Racing").length + SUFFIX.length <= 60);
  });
});

describe("gameCategoryDescription", () => {
  const input = { name: "Racing", count: 42, examples: ["Neon Drift", "Moto Stunts", "Kart Rally"] };

  it("is 120 to 155 characters and mentions the real count and examples", () => {
    const text = gameCategoryDescription(input);
    assert.ok(text.length >= 120 && text.length <= 155, `${text.length}: ${text}`);
    assert.ok(text.includes("42"));
    assert.ok(text.includes("Neon Drift"));
  });

  it("is unique per category and stays within range for other inputs", () => {
    const puzzle = gameCategoryDescription({ name: "Puzzle", count: 87, examples: ["Block Cascade", "Pipe Flow", "Word Grid"] });
    assert.notEqual(puzzle, gameCategoryDescription(input));
    assert.ok(puzzle.length >= 120 && puzzle.length <= 155, `${puzzle.length}: ${puzzle}`);
    const long = gameCategoryDescription({
      name: "Strategy",
      count: 3,
      examples: ["An Extremely Long Strategy Game Title", "Another Very Long Strategy Game Name", "Third Long Name Here"],
    });
    assert.ok(long.length <= 155, `${long.length}: ${long}`);
  });

  it("handles one game and no examples", () => {
    const single = gameCategoryDescription({ name: "Sports", count: 1, examples: [] });
    assert.ok(single.includes("1 free sports game"));
    assert.ok(single.length <= 155);
  });
});

describe("gameCategoryIntro", () => {
  it("is a short factual paragraph with the real count", () => {
    const text = gameCategoryIntro({ name: "Puzzle", count: 87, examples: ["Block Cascade", "Pipe Flow", "Word Grid"] });
    assert.ok(text.includes("87 free puzzle games"));
    assert.ok(text.includes("Block Cascade, Pipe Flow and Word Grid"));
    assert.ok(text.split(/(?<=\.)\s/).length <= 3);
  });

  it("works without examples", () => {
    const text = gameCategoryIntro({ name: "Sports", count: 1, examples: [] });
    assert.ok(text.includes("1 free sports game"));
    assert.ok(!text.includes("Popular picks"));
  });
});

describe("platformIntro", () => {
  it("describes desktop and mobile platforms", () => {
    const text = platformIntro({ name: "Windows", slug: "windows", count: 12, examples: ["VLC Media Player", "7-Zip"] });
    assert.ok(text.includes("12 apps for Windows"));
    assert.ok(text.includes("official"));
    assert.ok(text.includes("VLC Media Player and 7-Zip"));
  });

  it("describes browser apps differently", () => {
    const text = platformIntro({ name: "Browser", slug: "browser", count: 2, examples: [] });
    assert.ok(text.includes("2 apps"));
    assert.ok(text.includes("web browser"));
  });
});

describe("image alt text", () => {
  it("describes game thumbnails and app icons", () => {
    assert.equal(gameImageAlt("Neon Drift"), "Neon Drift online game");
    assert.equal(appIconAlt("VLC Media Player"), "VLC Media Player icon");
  });
});
