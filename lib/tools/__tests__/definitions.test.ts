import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getToolDefinition, toolCategoryDefinitions, toolDefinitions } from "../definitions";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function duplicates(values: string[]) {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

describe("tool category definitions", () => {
  it("covers the six planned categories with unique slugs and sort orders", () => {
    assert.deepEqual(
      toolCategoryDefinitions.map((category) => category.slug).sort(),
      ["calculators", "converters", "developer", "generators", "images", "text"],
    );
    assert.deepEqual(duplicates(toolCategoryDefinitions.map((category) => String(category.sortOrder))), []);
    for (const category of toolCategoryDefinitions) {
      assert.ok(category.name && category.description.length >= 40, category.slug);
    }
  });
});

describe("tool definitions", () => {
  it("has unique, URL-safe slugs", () => {
    const slugs = toolDefinitions.map((tool) => tool.slug);
    assert.deepEqual(duplicates(slugs), []);
    for (const slug of slugs) assert.match(slug, SLUG);
  });

  it("has unique names, meta titles and meta descriptions", () => {
    assert.deepEqual(duplicates(toolDefinitions.map((tool) => tool.name)), []);
    assert.deepEqual(duplicates(toolDefinitions.map((tool) => tool.metaTitle)), []);
    assert.deepEqual(duplicates(toolDefinitions.map((tool) => tool.metaDescription)), []);
  });

  it("keeps meta titles and descriptions within search result limits", () => {
    for (const tool of toolDefinitions) {
      assert.ok(tool.metaTitle.length >= 20 && tool.metaTitle.length <= 50, `${tool.slug} metaTitle (${tool.metaTitle.length})`);
      assert.ok(
        tool.metaDescription.length >= 70 && tool.metaDescription.length <= 160,
        `${tool.slug} metaDescription (${tool.metaDescription.length})`,
      );
    }
  });

  it("points every tool at an existing category", () => {
    const categories = new Set(toolCategoryDefinitions.map((category) => category.slug));
    for (const tool of toolDefinitions) assert.ok(categories.has(tool.categorySlug), `${tool.slug} -> ${tool.categorySlug}`);
  });

  it("has complete, bounded content", () => {
    for (const tool of toolDefinitions) {
      assert.ok(tool.shortDescription.length >= 20 && tool.shortDescription.length <= 120, `${tool.slug} shortDescription`);
      assert.ok(tool.description.length >= 60, `${tool.slug} description`);
      assert.ok(tool.howTo.length >= 3 && tool.howTo.length <= 6, `${tool.slug} howTo`);
      assert.ok(tool.intro.length >= 1 && tool.intro.length <= 3, `${tool.slug} intro`);
      assert.ok(tool.examples.length >= 1, `${tool.slug} examples`);
      assert.ok(tool.faq.length <= 4, `${tool.slug} faq`);
      assert.ok(tool.tags.length >= 2, `${tool.slug} tags`);
      for (const tag of tool.tags) assert.match(tag, SLUG, `${tool.slug} tag`);
      for (const item of tool.faq) assert.ok(item.question.endsWith("?") && item.answer.length >= 40, `${tool.slug} faq item`);
    }
  });

  it("does not use placeholder marketing copy", () => {
    for (const tool of toolDefinitions) {
      const copy = JSON.stringify(tool).toLowerCase();
      assert.ok(!copy.includes("coming soon"), tool.slug);
      assert.ok(!copy.includes("lorem"), tool.slug);
    }
  });

  it("looks tools up by slug", () => {
    assert.equal(getToolDefinition("word-counter")?.name, "Word Counter");
    assert.equal(getToolDefinition("does-not-exist"), undefined);
    assert.equal(getToolDefinition("constructor"), undefined);
  });

  it("defines the three foundation tools", () => {
    assert.deepEqual(
      toolDefinitions.map((tool) => tool.slug),
      ["word-counter", "json-formatter", "percentage-calculator"],
    );
    assert.ok(toolDefinitions.every((tool) => tool.localOnly));
  });
});
