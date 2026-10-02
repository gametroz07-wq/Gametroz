import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSitemapEntries } from "../sitemap";

const input = {
  siteUrl: "https://example.com/",
  toolCategorySlugs: ["text", "developer"],
  toolSlugs: ["word-counter", "json-formatter"],
  games: [{ slug: "neon-drift", updatedAt: new Date("2026-09-30T10:00:00Z") }, { slug: "gem-match" }],
  gameCategorySlugs: ["racing", "puzzle"],
  platformSlugs: ["windows", "web"],
  appCategorySlugs: ["media", "browsers"],
  apps: [{ slug: "vlc-media-player", updatedAt: "2026-09-01T00:00:00Z" }],
  guideSectionSlugs: ["games"],
  guides: [{ slug: "how-to-play", updatedAt: new Date("2026-09-15T00:00:00Z") }],
};

const urls = (overrides: Partial<Parameters<typeof buildSitemapEntries>[0]> = {}) =>
  buildSitemapEntries({ ...input, indexingEnabled: true, ...overrides }).map((entry) => entry.url);

describe("buildSitemapEntries", () => {
  it("returns nothing while indexing is disabled", () => {
    assert.deepEqual(buildSitemapEntries({ ...input, indexingEnabled: false }), []);
  });

  it("lists every public section with absolute canonical URLs", () => {
    assert.deepEqual(urls(), [
      "https://example.com/",
      "https://example.com/games",
      "https://example.com/tools",
      "https://example.com/apps",
      "https://example.com/guides",
      "https://example.com/games/racing",
      "https://example.com/games/puzzle",
      "https://example.com/game/neon-drift",
      "https://example.com/game/gem-match",
      "https://example.com/tools/text",
      "https://example.com/tools/developer",
      "https://example.com/tool/word-counter",
      "https://example.com/tool/json-formatter",
      "https://example.com/apps/windows",
      "https://example.com/apps/web",
      "https://example.com/apps/category/media",
      "https://example.com/apps/category/browsers",
      "https://example.com/app/vlc-media-player",
      "https://example.com/guides/games",
      "https://example.com/guide/how-to-play",
      "https://example.com/about",
      "https://example.com/editorial-policy",
      "https://example.com/contact",
      "https://example.com/privacy",
      "https://example.com/terms",
    ]);
  });

  it("never lists internal search, query strings or fragments", () => {
    const all = urls();
    assert.ok(all.every((url) => !url.includes("/search") && !url.includes("?") && !url.includes("#")));
  });

  it("skips content that is not published", () => {
    const all = urls({
      games: [{ slug: "live", status: "PUBLISHED" }, { slug: "draft", status: "DRAFT" }, { slug: "old", status: "ARCHIVED" }, { slug: "wait", status: "REVIEW" }],
      apps: [{ slug: "hidden", status: "DRAFT" }],
      guides: [{ slug: "wip", status: "REVIEW" }],
    });
    assert.ok(all.includes("https://example.com/game/live"));
    for (const slug of ["game/draft", "game/old", "game/wait", "app/hidden", "guide/wip"]) {
      assert.ok(!all.includes(`https://example.com/${slug}`), slug);
    }
  });

  it("never lists the retired /apps/browser URL", () => {
    assert.ok(!urls().includes("https://example.com/apps/browser"));
  });

  it("has no duplicate URLs", () => {
    const all = urls({ games: [{ slug: "a" }, { slug: "a" }], toolSlugs: ["x", "x"] });
    assert.equal(new Set(all).size, all.length);
  });

  it("sets lastModified only when updatedAt is a valid date", () => {
    const entries = buildSitemapEntries({
      ...input,
      indexingEnabled: true,
      games: [{ slug: "neon-drift", updatedAt: new Date("2026-09-30T10:00:00Z") }, { slug: "gem-match" }, { slug: "bad", updatedAt: "nope" }],
    });
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]));
    assert.equal(byUrl.get("https://example.com/game/neon-drift")?.lastModified?.toISOString(), "2026-09-30T10:00:00.000Z");
    assert.equal(byUrl.get("https://example.com/game/gem-match")?.lastModified, undefined);
    assert.equal(byUrl.get("https://example.com/game/bad")?.lastModified, undefined);
    assert.equal(byUrl.get("https://example.com/app/vlc-media-player")?.lastModified?.toISOString(), "2026-09-01T00:00:00.000Z");
  });
});
