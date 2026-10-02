import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ToolCategoryDefinition, ToolDefinition } from "../definitions";
import {
  MAX_ARCHIVES_WITHOUT_CONFIRMATION,
  buildSyncPlan,
  checkArchiveGuard,
  toCategoryRow,
  toToolRow,
  type ExistingToolRow,
} from "../sync-plan";

const category: ToolCategoryDefinition = {
  slug: "text",
  name: "Text",
  description: "Count, clean and transform text.",
  iconKey: "type",
  sortOrder: 0,
};

function definition(slug: string, overrides: Partial<ToolDefinition> = {}): ToolDefinition {
  return {
    slug,
    name: slug.toUpperCase(),
    categorySlug: "text",
    shortDescription: `Short ${slug}`,
    description: `Long ${slug}`,
    howTo: ["One", "Two", "Three"],
    iconKey: "type",
    featured: false,
    sortOrder: 0,
    tags: ["b", "a"],
    metaTitle: `${slug} title`,
    metaDescription: `${slug} description`,
    intro: ["Intro"],
    examples: [{ input: "in", output: "out" }],
    faq: [],
    localOnly: true,
    ...overrides,
  };
}

function existing(def: ToolDefinition, overrides: Partial<ExistingToolRow> = {}): ExistingToolRow {
  return { ...toToolRow(def), publishedAt: new Date("2026-09-01T00:00:00Z"), ...overrides };
}

const plan = (defs: ToolDefinition[], rows: ExistingToolRow[]) =>
  buildSyncPlan({ categories: [category], tools: defs, existingCategories: [], existingTools: rows });

describe("toToolRow", () => {
  it("maps a definition to a published row with the slug as component key", () => {
    const row = toToolRow(definition("word-counter", { sortOrder: 3, featured: true }));
    assert.equal(row.componentKey, "word-counter");
    assert.equal(row.status, "PUBLISHED");
    assert.equal(row.categorySlug, "text");
    assert.equal(row.sortOrder, 3);
    assert.equal(row.popularity, 997);
    assert.equal(row.featured, true);
  });

  it("ranks earlier tools as more popular and never goes negative", () => {
    assert.ok(toToolRow(definition("a", { sortOrder: 1 })).popularity > toToolRow(definition("b", { sortOrder: 2 })).popularity);
    assert.equal(toToolRow(definition("c", { sortOrder: 5000 })).popularity, 0);
  });
});

describe("toCategoryRow", () => {
  it("keeps catalog fields", () => {
    assert.deepEqual(toCategoryRow(category), {
      slug: "text",
      name: "Text",
      description: "Count, clean and transform text.",
      iconKey: "type",
      sortOrder: 0,
    });
  });
});

describe("buildSyncPlan", () => {
  it("creates tools missing from the database", () => {
    const result = plan([definition("a")], []);
    assert.deepEqual(result.tools.create.map((row) => row.slug), ["a"]);
    assert.deepEqual(result.tools.update, []);
    assert.deepEqual(result.tools.archive, []);
  });

  it("leaves identical tools alone, ignoring tag order", () => {
    const def = definition("a");
    const result = plan([def], [existing(def, { tags: ["a", "b"] })]);
    assert.deepEqual(result.tools.unchanged, ["a"]);
    assert.deepEqual(result.tools.create, []);
    assert.deepEqual(result.tools.update, []);
  });

  it("lists exactly the fields that changed", () => {
    const def = definition("a", { name: "New name", featured: true });
    const result = plan([def], [existing(definition("a"))]);
    assert.equal(result.tools.update.length, 1);
    assert.deepEqual(result.tools.update[0].changed, ["name", "featured"]);
    assert.equal(result.tools.update[0].row.name, "New name");
  });

  it("republishes archived or draft tools that are defined again", () => {
    const def = definition("a");
    const result = plan([def], [existing(def, { status: "ARCHIVED" })]);
    assert.deepEqual(result.tools.update[0].changed, ["status"]);
  });

  it("keeps an existing publishedAt and flags a missing one", () => {
    const def = definition("a");
    const result = plan([def], [existing(def, { status: "DRAFT", publishedAt: null })]);
    assert.equal(result.tools.update[0].setPublishedAt, true);
    const kept = plan([def], [existing(def, { status: "ARCHIVED" })]);
    assert.equal(kept.tools.update[0].setPublishedAt, false);
    assert.equal(plan([def], []).tools.create.length, 1);
  });

  it("archives published tools that are no longer defined, and only those", () => {
    const keep = definition("keep");
    const result = plan(
      [keep],
      [
        existing(keep),
        existing(definition("old-published")),
        existing(definition("old-draft"), { status: "DRAFT" }),
        existing(definition("old-archived"), { status: "ARCHIVED" }),
      ],
    );
    assert.deepEqual(result.tools.archive.map((row) => row.slug), ["old-published"]);
  });

  it("plans category creates, updates and unchanged rows", () => {
    const other: ToolCategoryDefinition = { ...category, slug: "developer", name: "Developer", sortOrder: 1 };
    const result = buildSyncPlan({
      categories: [category, other],
      tools: [],
      existingCategories: [{ ...toCategoryRow(category), description: "Old description" }],
      existingTools: [],
    });
    assert.deepEqual(result.categories.update.map((entry) => entry.row.slug), ["text"]);
    assert.deepEqual(result.categories.update[0].changed, ["description"]);
    assert.deepEqual(result.categories.create.map((row) => row.slug), ["developer"]);

    const same = buildSyncPlan({
      categories: [category],
      tools: [],
      existingCategories: [toCategoryRow(category)],
      existingTools: [],
    });
    assert.deepEqual(same.categories.unchanged, ["text"]);
  });
});

describe("checkArchiveGuard", () => {
  const archiveCount = (count: number) =>
    plan(
      [],
      Array.from({ length: count }, (_, index) => existing(definition(`old-${index}`))),
    );

  it("allows up to the limit without confirmation", () => {
    assert.equal(checkArchiveGuard(archiveCount(MAX_ARCHIVES_WITHOUT_CONFIRMATION), false).ok, true);
  });

  it("refuses larger archives unless confirmed", () => {
    const big = archiveCount(MAX_ARCHIVES_WITHOUT_CONFIRMATION + 1);
    const refused = checkArchiveGuard(big, false);
    assert.equal(refused.ok, false);
    assert.match(refused.ok ? "" : refused.reason, /--confirm-archive/);
    assert.equal(checkArchiveGuard(big, true).ok, true);
  });
});
