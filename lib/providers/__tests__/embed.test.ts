import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { resolveEmbedUrl } from "../embed";

const allowed = { embedUrl: "https://html5.gamemonetize.co/abc/", providerSlug: "gamemonetize" };

describe("resolveEmbedUrl", () => {
  afterEach(() => {
    delete process.env.GAME_EMBEDS_ENABLED;
  });

  it("returns nothing while GAME_EMBEDS_ENABLED is not true", () => {
    assert.equal(resolveEmbedUrl(allowed), null);
    process.env.GAME_EMBEDS_ENABLED = "false";
    assert.equal(resolveEmbedUrl(allowed), null);
  });

  it("returns an allowlisted URL when embeds are enabled", () => {
    process.env.GAME_EMBEDS_ENABLED = "true";
    assert.equal(resolveEmbedUrl(allowed), allowed.embedUrl);
  });

  it("never returns a URL outside the provider allowlist, even when enabled", () => {
    process.env.GAME_EMBEDS_ENABLED = "true";
    assert.equal(resolveEmbedUrl({ ...allowed, embedUrl: "https://evil.example.com/" }), null);
    assert.equal(resolveEmbedUrl({ ...allowed, providerSlug: "unknown" }), null);
    assert.equal(resolveEmbedUrl({ embedUrl: allowed.embedUrl, providerSlug: null }), null);
  });
});
