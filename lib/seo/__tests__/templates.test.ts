import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  appCategoryDescription,
  appCategoryIntro,
  appCategoryTitle,
  appDescription,
  appIconAlt,
  appTitle,
  platformTitle,
  extendDescription,
  fitTitle,
  gameCategoryDescription,
  gameCategoryIntro,
  gameCategoryTitle,
  gameImageAlt,
  gameMetaDescription,
  gameSummary,
  gameTitle,
  orientationFact,
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
  it("targets the download intent with the platforms when it fits 60 characters", () => {
    const title = appTitle("VLC Media Player", ["windows", "mac", "linux", "android", "ios"]);
    assert.equal(title, "VLC Media Player Download for Windows, Mac & More");
    assert.ok(title.length + SUFFIX.length <= 60);
    assert.equal(appTitle("7-Zip", ["windows"]), "7-Zip Download for Windows");
    assert.equal(appTitle("Signal", ["windows", "mac"]), "Signal Download for Windows & Mac");
    assert.equal(appTitle("Photopea", ["web"]), "Photopea Download for Web");
  });

  it("falls back to shorter forms for long names or missing platforms", () => {
    const long = appTitle("Extremely Long Application Name", ["windows", "mac", "linux"]);
    assert.ok(long.length + SUFFIX.length <= 60);
    assert.ok(long.startsWith("Extremely Long Application Name"));
    assert.equal(appTitle("Git"), "Git Download (Official Link)");
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
    assert.ok(platformIntro({ name: "iOS", slug: "ios", count: 1, examples: [] }).includes("1 app for iOS"));
  });

  it("describes web apps differently", () => {
    const text = platformIntro({ name: "Web", slug: "web", count: 2, examples: [] });
    assert.ok(text.includes("2 apps"));
    assert.ok(text.includes("web browser"));
  });
});

describe("platformTitle", () => {
  it("uses a platform specific title that fits 60 characters", () => {
    assert.equal(platformTitle("Windows", "windows"), "Windows Apps: Official Download Links");
    assert.equal(platformTitle("Web", "web"), "Web Apps That Run in Your Browser");
    for (const [name, slug] of [["macOS", "mac"], ["Android", "android"], ["iOS", "ios"], ["Linux", "linux"]] as const) {
      assert.ok(platformTitle(name, slug).length + SUFFIX.length <= 60, slug);
    }
  });
});

describe("appCategoryTitle", () => {
  it("fits 60 characters with the suffix and falls back for long names", () => {
    assert.equal(appCategoryTitle("Browsers"), "Browsers: Software With Official Download Links");
    for (const name of ["Communication", "Productivity", "Development"]) {
      assert.ok(appCategoryTitle(name).length + SUFFIX.length <= 60, name);
    }
    assert.equal(appCategoryTitle("Communication"), "Communication Software: Official Links");
  });
});

describe("appCategoryDescription", () => {
  it("extends the category description to 120-160 characters without passing 160", () => {
    const text = appCategoryDescription("Short base text about browsers.");
    assert.ok(text.length >= 120 && text.length <= 160, `${text.length}: ${text}`);
    const long = "L".repeat(130);
    assert.equal(appCategoryDescription(long), long);
  });
});

describe("appCategoryIntro", () => {
  it("is unique per category: real count and example names", () => {
    const text = appCategoryIntro({ name: "Media", count: 12, examples: ["VLC Media Player", "Audacity", "OBS Studio"] });
    assert.ok(text.includes("12 apps in the Media category"));
    assert.ok(text.includes("VLC Media Player, Audacity and OBS Studio"));
    assert.ok(text.includes("official"));
    assert.notEqual(text, appCategoryIntro({ name: "Browsers", count: 8, examples: [] }));
    assert.ok(appCategoryIntro({ name: "Cloud", count: 1, examples: [] }).includes("1 app in the Cloud category"));
  });
});

describe("image alt text", () => {
  it("describes game thumbnails and app icons", () => {
    assert.equal(gameImageAlt("Neon Drift"), "Neon Drift online game");
    assert.equal(appIconAlt("VLC Media Player"), "VLC Media Player icon");
  });
});

describe("gameTitle", () => {
  it("prefers the Play ... Online for Free form when it fits 60 characters with the suffix", () => {
    assert.equal(gameTitle("Neon Drift"), "Play Neon Drift Online for Free");
  });

  it("falls back to the shorter form, then to the bare name", () => {
    const medium = "A".repeat(30);
    assert.equal(gameTitle(medium), `${medium} - Free Online Game`);
    const long = "B".repeat(45);
    assert.equal(gameTitle(long), long);
  });
});

describe("gameSummary", () => {
  it("answers what the game is using only data", () => {
    assert.equal(gameSummary("Neon Drift", "Racing"), "Neon Drift is a free racing game you can play in your web browser.");
  });
});

describe("orientationFact", () => {
  it("notes that portrait games suit phones", () => {
    assert.equal(orientationFact("landscape"), "Landscape");
    assert.match(orientationFact("portrait"), /^Portrait.*phones/);
  });
});

describe("gameMetaDescription", () => {
  const CTA = "Play free in your browser, no download.";

  it("never starts with the bare game name repeated as a sentence", () => {
    const text = gameMetaDescription({
      name: "SPLATCHA!",
      category: "Puzzle",
      description:
        "SPLATCHA! Splatcha is a colorful puzzle game where you match paint splats to clear each level. Plan your moves and chain combos.",
    });
    assert.ok(text.startsWith("Splatcha is a colorful puzzle game"), text);
    assert.ok(text.length >= 120 && text.length <= 158, `${text.length}: ${text}`);
  });

  it("uses first sentences and appends the call to action when it fits", () => {
    const description = "Drive fast through neon streets and dodge traffic. Collect boosts to climb the leaderboard.";
    const text = gameMetaDescription({ name: "Neon Drift", category: "Racing", description });
    assert.equal(text, `${description} ${CTA}`);
  });

  it("cuts at a word boundary with an ellipsis only when the text is cut", () => {
    const words = Array.from({ length: 60 }, (_, i) => `word${i}`).join(" ");
    const text = gameMetaDescription({ name: "Long", category: "Action", description: `${words}.` });
    assert.ok(text.length <= 158);
    assert.ok(text.endsWith("…"));
    assert.match(text.slice(0, -1), /word\d+$/);
    assert.ok(!text.includes(CTA));
  });

  it("does not add an ellipsis when nothing was cut", () => {
    const text = gameMetaDescription({
      name: "Tiny",
      category: "Puzzle",
      description: "Slide the tiles into place and solve each board with as few moves as you can manage today.",
    });
    assert.ok(!text.includes("…"));
    assert.ok(text.endsWith(CTA));
  });

  it("combines very short descriptions with truthful category info", () => {
    const text = gameMetaDescription({ name: "Pong Plus", category: "Arcade", description: "Classic paddle fun." });
    assert.ok(text.startsWith("Classic paddle fun."));
    assert.ok(text.includes("free arcade game"));
    assert.ok(text.length >= 120 && text.length <= 158, `${text.length}: ${text}`);
  });

  it("falls back to a category sentence when there is no description", () => {
    const text = gameMetaDescription({ name: "Blank", category: "Arcade", description: "" });
    assert.ok(text.startsWith("Blank is a free arcade game you can play in your web browser."));
    assert.ok(text.length <= 158);
  });
});
