import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { editorialIssues } from "../editorial";
import { normalizeGameMonetizeGame } from "../gamemonetize/mapper";
import { validGame } from "../gamemonetize/fixtures";
import { validateGameMonetizeGame } from "../gamemonetize/validator";

const game = (overrides: Parameters<typeof normalizeGameMonetizeGame>[0]) =>
  normalizeGameMonetizeGame({ ...validGame, ...overrides });
const messages = (overrides: Parameters<typeof normalizeGameMonetizeGame>[0]) =>
  editorialIssues(game(overrides)).map((issue) => issue.message).join(" | ");

describe("editorial review rules", () => {
  it("passes a clean game", () => {
    assert.deepEqual(editorialIssues(game({})), []);
  });

  it("flags known third-party brands in titles and tags (never auto-rejects)", () => {
    assert.match(messages({ title: "Resident Evil 2: Beat Em Up" }), /brand.*resident evil/i);
    assert.match(messages({ tags: "3D, Roblox, cut" }), /brand.*roblox/i);
    const result = validateGameMonetizeGame({ ...validGame, title: "Resident Evil 2: Beat Em Up" });
    assert.equal(result.status, "NEEDS_REVIEW");
    assert.ok(result.issues.some((issue) => issue.code === "EDITORIAL_REVIEW_REQUIRED" && issue.severity === "warning"));
  });

  it("does not flag look-alike words", () => {
    assert.equal(messages({ title: "Geometry Vibes 3D" }), "");
    assert.equal(messages({ title: "Halloween Fighters" }), "");
  });

  it("flags SEO-spam titles", () => {
    assert.match(messages({ title: "Mother Simulator Husband Wife Games" }), /SEO/i);
    assert.match(messages({ title: "Car Racing Games Online Free Play Now Unblocked" }), /SEO/i);
  });

  it("flags poor instructions", () => {
    assert.match(messages({ instructions: "Tap to play" }), /instructions/i);
  });

  it("flags brands, misspelled franchises and real people seen in the live popularity feeds", () => {
    for (const title of [
      "Pou Online",
      "Talking Tom Gold Run Online",
      "Tom & Jerry Run",
      "Baldi's Basics v1.4.3",
      "Amongus Escape",
      "Minescraft Steve Adventures",
      "SoniK Run",
      "Cuphead Rush",
      "Poppy Playtime Survival",
      "Ben10 Omnirush",
      "Fireboy and Watergirl 6",
      "Friday Night Funkin VS Garcello",
      "Teen Titans Go ! Swamp Attack",
      "Trump the Ragdoll",
      "Ronaldo Kick Run",
      "Labubu Auto Adventure",
      "Chainsaw Man Anime",
      "Brookhaven Real Life",
      "Red Impostor vs. Crew",
      "Red and Blue Stickman Huggy",
      "Hugi Wugi",
      "Flappy Poppy",
      "Skibidi Titans Hide And Seek",
      "HIll climb Racings 2",
      "Shadowgun War Game",
      "Fiva 26: Soccer",
      "Fire Boy Run Adventure",
      "WorldCup2026",
      "Cyber Truck Drive Simulator",
    ]) {
      assert.match(messages({ title }), /brand/i, title);
    }
  });

  it("flags the expanded brand list with word-boundary matching", () => {
    for (const [title, brand] of [
      ["Half-Life Escape", "half-life"],
      ["Halo Runner", "halo"],
      ["Terminator Dash", "terminator"],
      ["Star Wars Defender", "star wars"],
      ["Harry Potter Quest", "harry potter"],
      ["Spongebob Jump", "spongebob"],
      ["Naruto Fighters", "naruto"],
      ["Dragon Ball Clash", "dragon ball"],
      ["Shrek Swamp Run", "shrek"],
      ["Minions Rush", "minions"],
      ["Bluey Adventure", "bluey"],
      ["NBA Shootout", "nba"],
      ["WWE Smash", "wwe"],
      ["Transformers Battle", "transformers"],
      ["Valorant Aim Trainer", "valorant"],
      ["Counter-Strike Online", "counter-strike"],
      ["Temple Run Remix", "temple run"],
      ["Cut the Rope Deluxe", "cut the rope"],
    ] as const) {
      assert.match(messages({ title }), new RegExp(`brand.*${brand}`, "i"), title);
    }
  });

  it("does not flag generic words or look-alikes as brands", () => {
    for (const title of ["Sims Of Mine", "Cars And Trucks Rally", "Halloween Heroes", "Halogen Lamp Puzzle", "Banana Run"]) {
      assert.doesNotMatch(messages({ title }), /brand/i, title);
    }
  });

  it("flags descriptions shorter than 60 characters for editorial review", () => {
    const description = "A short description of fifty characters, roughly.";
    assert.match(messages({ description }), /description.*short/i);
    assert.doesNotMatch(messages({}), /description/i);
    const result = validateGameMonetizeGame({ ...validGame, description });
    assert.ok(result.issues.some((issue) => issue.code === "EDITORIAL_REVIEW_REQUIRED" && /description/i.test(issue.message)));
  });

  it("flags unusual characters and punctuation runs in titles", () => {
    assert.match(messages({ title: "Super Racer 🚗" }), /unusual characters/i);
    assert.match(messages({ title: "Cool Game ★ Deluxe" }), /unusual characters/i);
    assert.match(messages({ title: "Wow!!! Racer" }), /unusual characters/i);
    assert.match(messages({ title: "Dash ... Go" }), /unusual characters/i);
  });

  it("accepts accented letters, digits and ordinary punctuation in titles", () => {
    for (const title of ["Café Rush 2", "Mini-Golf: The Return!", "Jack's Big Day (Remastered)", "Niño Sprint & Co."]) {
      assert.doesNotMatch(messages({ title }), /unusual characters/i, title);
    }
  });

  it("flags approximate category mappings for confirmation", () => {
    assert.match(messages({ category: "Girls" }), /category/i);
  });
});

describe("unknown categories", () => {
  it("are imported for review instead of being rejected", () => {
    const result = validateGameMonetizeGame({ ...validGame, category: "Brand New Thing" });
    assert.equal(result.status, "NEEDS_REVIEW");
    assert.ok(result.issues.some((issue) => issue.code === "CATEGORY_UNMAPPED" && issue.severity === "warning"));
    assert.equal(normalizeGameMonetizeGame({ ...validGame, category: "Brand New Thing" }).category, "casual");
  });
});
