import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { slugify, type SlugOptions } from "../slug";

const base: SlugOptions = { separator: "-", maxLength: null, removeStopWords: false };
const slug = (text: string, options: Partial<SlugOptions> = {}) => slugify(text, { ...base, ...options });

describe("slugify", () => {
  it("lowercases and joins words with the separator", () => {
    assert.equal(slug("Hello Big World"), "hello-big-world");
    assert.equal(slug("Hello Big World", { separator: "_" }), "hello_big_world");
  });

  it("transliterates accents and special letters", () => {
    assert.equal(slug("Crème Brûlée & Café: 10 Easy Recipes!"), "creme-brulee-and-cafe-10-easy-recipes");
    assert.equal(slug("Straße Ærø Łódź Đà Nẵng"), "strasse-aero-lodz-da-nang");
    assert.equal(slug("café au lait"), "cafe-au-lait");
  });

  it("drops apostrophes without splitting the word", () => {
    assert.equal(slug("Don't Stop"), "dont-stop");
    assert.equal(slug("Rock 'n' Roll 🎸 Night", { separator: "_" }), "rock_n_roll_night");
  });

  it("collapses repeated symbols and trims separators", () => {
    assert.equal(slug("  --Hello___ ... world!!  "), "hello-world");
    assert.equal(slug("C++ vs C#"), "c-vs-c");
  });

  it("returns an empty slug when nothing usable remains", () => {
    assert.equal(slug("🎉🎉"), "");
    assert.equal(slug("日本語"), "");
    assert.equal(slug(""), "");
  });

  it("removes English stop words but keeps them if nothing else remains", () => {
    assert.equal(slug("The Art of Making Perfect Sourdough Bread at Home", { removeStopWords: true }), "art-making-perfect-sourdough-bread-home");
    assert.equal(slug("The And Of", { removeStopWords: true }), "the-and-of");
  });

  it("limits the length without cutting words when possible", () => {
    const title = "The Art of Making Perfect Sourdough Bread at Home";
    assert.equal(slug(title, { removeStopWords: true, maxLength: 30 }), "art-making-perfect-sourdough");
    assert.equal(slug("one two three", { maxLength: 7 }), "one-two");
    assert.equal(slug("one two three", { maxLength: 13 }), "one-two-three");
  });

  it("cuts the first word only when it alone exceeds the limit", () => {
    assert.equal(slug("extraordinarily long", { maxLength: 8 }), "extraord");
    assert.equal(slug("x", { maxLength: 0 }), "");
  });
});
