import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildLlmsTxt } from "../llms";

describe("buildLlmsTxt", () => {
  const text = buildLlmsTxt({
    siteUrl: "https://example.com/",
    name: "Gametroz",
    description: "Free HTML5 games, online tools, useful apps and guides.",
    contactEmail: "contact@example.com",
  });

  it("starts with the llms.txt title and summary", () => {
    assert.ok(text.startsWith("# Gametroz\n\n> Free HTML5 games"));
  });

  it("links every section and trust page with absolute URLs", () => {
    for (const path of ["/games", "/tools", "/apps", "/guides", "/about", "/editorial-policy", "/contact", "/privacy", "/terms"]) {
      assert.ok(text.includes(`https://example.com${path})`), path);
    }
    assert.ok(!text.includes("example.com//"));
  });

  it("is honest about third-party games and local tools", () => {
    assert.ok(text.includes("GameMonetize"));
    assert.ok(/in your browser/i.test(text));
    assert.ok(text.includes("contact@example.com"));
  });

  it("never links the internal search", () => {
    assert.ok(!text.includes("/search"));
  });
});
