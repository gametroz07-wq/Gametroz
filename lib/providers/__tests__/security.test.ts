import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkUrl, isAllowedEmbedUrl } from "../security";

const hosts = ["html5.gamemonetize.co"] as const;

describe("embed allowlist", () => {
  it("accepts an HTTPS URL on an allowed host", () => {
    assert.equal(isAllowedEmbedUrl("https://html5.gamemonetize.co/abc/", hosts), true);
  });

  it("rejects plain HTTP", () => {
    assert.equal(checkUrl("http://html5.gamemonetize.co/abc/", hosts), "not-https");
  });

  it("rejects look-alike hosts and userinfo tricks", () => {
    assert.equal(isAllowedEmbedUrl("https://html5.gamemonetize.co.evil.com/abc/", hosts), false);
    assert.equal(isAllowedEmbedUrl("https://evil.com/html5.gamemonetize.co/", hosts), false);
    assert.equal(isAllowedEmbedUrl("https://html5.gamemonetize.co@evil.com/", hosts), false);
  });

  it("rejects non-http schemes and garbage", () => {
    assert.equal(checkUrl("javascript:alert(1)", hosts), "not-https");
    assert.equal(checkUrl("not a url", hosts), "invalid");
    assert.equal(checkUrl("", hosts), "missing");
  });

  it("reports hosts outside the allowlist", () => {
    assert.equal(checkUrl("https://games.example.com/x/", hosts), "host-not-allowed");
  });
});
