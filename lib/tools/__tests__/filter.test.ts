import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterTools, groupToolsByCategory } from "../filter";

const tools = [
  { slug: "word-counter", name: "Word Counter", shortDescription: "Count words and reading time.", category: { name: "Text", slug: "text" }, tags: ["words", "writing"] },
  { slug: "json-formatter", name: "JSON Formatter", shortDescription: "Format and validate JSON.", category: { name: "Developer", slug: "developer" }, tags: ["json", "format"] },
  { slug: "percentage-calculator", name: "Percentage Calculator", shortDescription: "Percent of, change and more.", category: { name: "Calculators", slug: "calculators" }, tags: ["percent", "math"] },
];

const slugs = (list: { slug: string }[]) => list.map((tool) => tool.slug);

describe("filterTools", () => {
  it("returns everything for a blank query", () => {
    assert.deepEqual(slugs(filterTools(tools, "   ")), slugs(tools));
  });

  it("matches name, short description, category and tags case-insensitively", () => {
    assert.deepEqual(slugs(filterTools(tools, "JSON")), ["json-formatter"]);
    assert.deepEqual(slugs(filterTools(tools, "reading")), ["word-counter"]);
    assert.deepEqual(slugs(filterTools(tools, "developer")), ["json-formatter"]);
    assert.deepEqual(slugs(filterTools(tools, "MATH")), ["percentage-calculator"]);
  });

  it("requires every word of the query to match somewhere", () => {
    assert.deepEqual(slugs(filterTools(tools, "word text")), ["word-counter"]);
    assert.deepEqual(filterTools(tools, "word json"), []);
  });

  it("returns nothing when no tool matches", () => {
    assert.deepEqual(filterTools(tools, "zzz"), []);
  });
});

describe("groupToolsByCategory", () => {
  it("keeps category order and drops empty categories", () => {
    const categories = [
      { slug: "developer", name: "Developer" },
      { slug: "images", name: "Images" },
      { slug: "text", name: "Text" },
    ];
    const groups = groupToolsByCategory(categories, tools);
    assert.deepEqual(groups.map((group) => group.category.slug), ["developer", "text"]);
    assert.deepEqual(slugs(groups[1].tools), ["word-counter"]);
  });
});
