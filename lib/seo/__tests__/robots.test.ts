import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildRobots } from "../robots";

describe("buildRobots", () => {
  it("allows everything and advertises no sitemap while indexing is off", () => {
    assert.deepEqual(buildRobots({ siteUrl: "https://example.com", indexingEnabled: false }), {
      rules: { userAgent: "*", allow: "/" },
    });
  });

  it("blocks API and search and points to the sitemap once indexing is on", () => {
    assert.deepEqual(buildRobots({ siteUrl: "https://example.com/", indexingEnabled: true }), {
      rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/search"] },
      sitemap: "https://example.com/sitemap.xml",
    });
  });
});
