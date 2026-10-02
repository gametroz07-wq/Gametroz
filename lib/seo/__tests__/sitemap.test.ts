import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSitemapEntries } from "../sitemap";

const input = {
  siteUrl: "https://example.com/",
  toolCategorySlugs: ["text", "developer"],
  toolSlugs: ["word-counter", "json-formatter"],
};

describe("buildSitemapEntries", () => {
  it("returns nothing while indexing is disabled", () => {
    assert.deepEqual(buildSitemapEntries({ ...input, indexingEnabled: false }), []);
  });

  it("lists static sections, tool categories and tools with absolute URLs", () => {
    const urls = buildSitemapEntries({ ...input, indexingEnabled: true }).map((entry) => entry.url);
    assert.deepEqual(urls, [
      "https://example.com/",
      "https://example.com/games",
      "https://example.com/tools",
      "https://example.com/apps",
      "https://example.com/guides",
      "https://example.com/tools/text",
      "https://example.com/tools/developer",
      "https://example.com/tool/word-counter",
      "https://example.com/tool/json-formatter",
    ]);
  });

  it("has no duplicate URLs", () => {
    const urls = buildSitemapEntries({ ...input, indexingEnabled: true }).map((entry) => entry.url);
    assert.equal(new Set(urls).size, urls.length);
  });
});
