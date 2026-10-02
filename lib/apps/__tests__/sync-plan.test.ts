import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AppCategoryDefinition, AppDefinition, PlatformDefinition } from "../definitions";
import {
  MAX_ARCHIVES_WITHOUT_CONFIRMATION,
  buildSyncPlan,
  checkArchiveGuard,
  toAppRow,
  toCategoryRow,
  toPlatformRow,
  type ExistingAppRow,
  type ExistingPlatformRow,
} from "../sync-plan";

const platform = (slug: string, sortOrder: number): PlatformDefinition => ({
  slug: slug as PlatformDefinition["slug"],
  name: slug.toUpperCase(),
  description: `Apps for ${slug}`,
  iconKey: "globe",
  sortOrder,
});

const category: AppCategoryDefinition = {
  slug: "media",
  name: "Media",
  description: "Players and editors.",
  iconKey: "play",
  sortOrder: 0,
};

function definition(slug: string, overrides: Partial<AppDefinition> = {}): AppDefinition {
  return {
    slug,
    name: slug.toUpperCase(),
    categorySlug: "media",
    platforms: ["windows", "mac"],
    developer: "Dev Team",
    shortDescription: `Short ${slug}`,
    description: `Long ${slug}\n\nMore ${slug}`,
    features: ["One", "Two", "Three"],
    license: "Free",
    officialWebsite: `https://${slug}.example.com/`,
    officialDownloadUrl: `https://${slug}.example.com/download`,
    requirements: [],
    alternatives: [],
    tags: ["b", "a"],
    metaDescription: `${slug} meta`,
    featured: false,
    sortOrder: 0,
    ...overrides,
  };
}

function existing(def: AppDefinition, overrides: Partial<ExistingAppRow> = {}): ExistingAppRow {
  return { ...toAppRow(def), publishedAt: new Date("2026-09-01T00:00:00Z"), ...overrides };
}

const platforms = [platform("windows", 0), platform("mac", 1)];

const plan = (defs: AppDefinition[], rows: ExistingAppRow[], existingPlatforms: ExistingPlatformRow[] = []) =>
  buildSyncPlan({
    platforms,
    categories: [category],
    apps: defs,
    existingPlatforms,
    existingCategories: [],
    existingApps: rows,
  });

describe("toAppRow", () => {
  it("maps a definition to a published row without invented facts", () => {
    const row = toAppRow(definition("vlc", { sortOrder: 3, featured: true, alternatives: ["x", "y"] }));
    assert.equal(row.status, "PUBLISHED");
    assert.equal(row.version, null);
    assert.equal(row.iconUrl, null);
    assert.equal(row.lastVerifiedAt, "2026-10-02T00:00:00.000Z");
    assert.equal(row.officialDownloadUrl, "https://vlc.example.com/download");
    assert.equal(row.categorySlug, "media");
    assert.equal(row.sortOrder, 3);
    assert.equal(row.featured, true);
    assert.deepEqual(row.alternatives, ["x", "y"]);
    assert.deepEqual(row.platforms, ["windows", "mac"]);
  });

  it("stores the developer as publisher and keeps both paragraphs in the description", () => {
    const row = toAppRow(definition("vlc"));
    assert.equal(row.publisher, "Dev Team");
    assert.equal(row.description, "Long vlc\n\nMore vlc");
  });
});

describe("toCategoryRow / toPlatformRow", () => {
  it("keep catalog fields", () => {
    assert.deepEqual(toCategoryRow(category), { slug: "media", name: "Media", description: "Players and editors.", iconKey: "play", sortOrder: 0 });
    assert.deepEqual(toPlatformRow(platform("web", 4)), {
      slug: "web",
      name: "WEB",
      description: "Apps for web",
      iconKey: "globe",
      sortOrder: 4,
    });
  });
});

describe("buildSyncPlan: apps", () => {
  it("creates apps missing from the database", () => {
    const result = plan([definition("a")], []);
    assert.deepEqual(result.apps.create.map((row) => row.slug), ["a"]);
    assert.deepEqual(result.apps.update, []);
    assert.deepEqual(result.apps.archive, []);
  });

  it("leaves identical apps alone, ignoring tag and platform order", () => {
    const def = definition("a");
    const result = plan([def], [existing(def, { tags: ["a", "b"], platforms: ["mac", "windows"] })]);
    assert.deepEqual(result.apps.unchanged, ["a"]);
    assert.deepEqual(result.apps.update, []);
  });

  it("lists exactly the fields that changed", () => {
    const def = definition("a", { developer: "New Dev", featured: true });
    const result = plan([def], [existing(definition("a"))]);
    assert.deepEqual(result.apps.update[0].changed, ["publisher", "featured"]);
  });

  it("detects join changes: platforms and the order of alternatives", () => {
    const def = definition("a", { platforms: ["windows"], alternatives: ["x", "y"] });
    const result = plan([def], [existing(definition("a", { alternatives: ["y", "x"] }))]);
    assert.deepEqual(result.apps.update[0].changed, ["platforms", "alternatives"]);
  });

  it("clears sample facts left by the old seed: version, icon and unverified date", () => {
    const def = definition("a");
    const old = existing(def, { version: "3.0.21", iconUrl: "/mock/apps/a.svg", lastVerifiedAt: null, officialDownloadUrl: null });
    const result = plan([def], [old]);
    assert.deepEqual(result.apps.update[0].changed, ["version", "officialDownloadUrl", "iconUrl", "lastVerifiedAt"]);
  });

  it("republishes archived apps that are defined again and flags a missing publishedAt", () => {
    const def = definition("a");
    assert.deepEqual(plan([def], [existing(def, { status: "ARCHIVED" })]).apps.update[0].changed, ["status"]);
    const draft = plan([def], [existing(def, { status: "DRAFT", publishedAt: null })]);
    assert.equal(draft.apps.update[0].setPublishedAt, true);
    assert.equal(plan([def], [existing(def, { status: "ARCHIVED" })]).apps.update[0].setPublishedAt, false);
  });

  it("archives published apps that are no longer defined, and only those", () => {
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
    assert.deepEqual(result.apps.archive.map((row) => row.slug), ["old-published"]);
  });
});

describe("buildSyncPlan: platforms", () => {
  const web = platform("web", 4);
  const legacy: ExistingPlatformRow = { slug: "browser", name: "Browser", description: "Old", iconKey: "globe", sortOrder: 4 };

  it("renames the legacy browser row to web in place instead of creating a second row", () => {
    const result = buildSyncPlan({
      platforms: [web],
      categories: [],
      apps: [],
      existingPlatforms: [legacy],
      existingCategories: [],
      existingApps: [],
    });
    assert.deepEqual(result.platforms.rename.map((entry) => [entry.from, entry.row.slug]), [["browser", "web"]]);
    assert.deepEqual(result.platforms.create, []);
    assert.equal(result.platforms.update.length, 0);
  });

  it("creates web normally when browser does not exist, and ios as a new row", () => {
    const result = buildSyncPlan({
      platforms: [web, platform("ios", 3)],
      categories: [],
      apps: [],
      existingPlatforms: [],
      existingCategories: [],
      existingApps: [],
    });
    assert.deepEqual(result.platforms.create.map((row) => row.slug), ["web", "ios"]);
    assert.deepEqual(result.platforms.rename, []);
  });

  it("does not rename when web already exists", () => {
    const result = buildSyncPlan({
      platforms: [web],
      categories: [],
      apps: [],
      existingPlatforms: [legacy, { ...toPlatformRow(web) }],
      existingCategories: [],
      existingApps: [],
    });
    assert.deepEqual(result.platforms.rename, []);
    assert.deepEqual(result.platforms.unchanged, ["web"]);
  });

  it("plans platform updates with the changed fields", () => {
    const result = buildSyncPlan({
      platforms: [platform("windows", 0)],
      categories: [],
      apps: [],
      existingPlatforms: [{ ...toPlatformRow(platform("windows", 0)), description: "Old" }],
      existingCategories: [],
      existingApps: [],
    });
    assert.deepEqual(result.platforms.update[0].changed, ["description"]);
  });
});

describe("buildSyncPlan: categories", () => {
  it("plans category creates, updates and unchanged rows, and never archives old categories", () => {
    const other: AppCategoryDefinition = { ...category, slug: "cloud", name: "Cloud", sortOrder: 1 };
    const result = buildSyncPlan({
      platforms: [],
      categories: [category, other],
      apps: [],
      existingPlatforms: [],
      existingCategories: [
        { ...toCategoryRow(category), description: "Old description" },
        { slug: "compression", name: "Compression", description: "Old", iconKey: "archive", sortOrder: 1 },
      ],
      existingApps: [],
    });
    assert.deepEqual(result.categories.update[0].changed, ["description"]);
    assert.deepEqual(result.categories.create.map((row) => row.slug), ["cloud"]);
    assert.ok(!("archive" in result.categories));
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
