import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildContentSecurityPolicy, buildPermissionsPolicy, buildSecurityHeaders } from "../security/headers";

const GM = "https://html5.gamemonetize.co";
const base = { isDev: false, indexingEnabled: false, adsEnabled: false, frameOrigins: [GM] };

describe("Content-Security-Policy", () => {
  it("blocks all frames while embeds are disabled", () => {
    const csp = buildContentSecurityPolicy({ ...base, embedsEnabled: false });
    assert.match(csp, /frame-src 'none'/);
    assert.ok(!csp.includes("gamemonetize"));
  });

  it("allows only the allowlisted game origins when embeds are enabled", () => {
    const csp = buildContentSecurityPolicy({ ...base, embedsEnabled: true });
    assert.match(csp, /frame-src https:\/\/html5\.gamemonetize\.co(;|$)/);
    assert.ok(!/\*/.test(csp), "no wildcard sources");
  });

  it("keeps the page itself locked down", () => {
    const csp = buildContentSecurityPolicy({ ...base, embedsEnabled: true });
    for (const directive of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'", "form-action 'self'"]) {
      assert.ok(csp.includes(directive), directive);
    }
    assert.ok(!csp.includes("unsafe-eval"), "no eval in production");
  });

  it("allows eval and websockets only in development", () => {
    const csp = buildContentSecurityPolicy({ ...base, isDev: true, embedsEnabled: false });
    assert.ok(csp.includes("'unsafe-eval'"));
    assert.ok(csp.includes("ws:"));
  });

  it("allows no third-party origin while ads are disabled", () => {
    const csp = buildContentSecurityPolicy({ ...base, embedsEnabled: false });
    assert.ok(csp.includes("script-src 'self' 'unsafe-inline';"));
    assert.ok(csp.includes("connect-src 'self';"));
    assert.ok(!csp.includes("https:"));
  });

  it("opens the ad directives to any https origin when ads are enabled", () => {
    const csp = buildContentSecurityPolicy({ ...base, embedsEnabled: true, adsEnabled: true });
    for (const directive of [
      "script-src 'self' 'unsafe-inline' https:",
      "img-src 'self' blob: data: https:",
      "media-src 'self' https:",
      "connect-src 'self' https:",
      "frame-src https:",
    ]) {
      assert.ok(csp.includes(`${directive};`), directive);
    }
    assert.ok(!/\*/.test(csp), "no wildcard sources");
  });

  it("allows ad frames even while game embeds are disabled", () => {
    const csp = buildContentSecurityPolicy({ ...base, embedsEnabled: false, adsEnabled: true });
    assert.ok(csp.includes("frame-src https:;"));
  });

  it("keeps the non-ad directives locked down when ads are enabled", () => {
    const csp = buildContentSecurityPolicy({ ...base, embedsEnabled: true, adsEnabled: true });
    for (const directive of ["default-src 'self'", "font-src 'self'", "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'", "form-action 'self'"]) {
      assert.ok(csp.includes(`${directive};`), directive);
    }
  });
});

describe("Permissions-Policy", () => {
  it("delegates fullscreen, autoplay and gamepad only to game origins when enabled", () => {
    const policy = buildPermissionsPolicy({ ...base, embedsEnabled: true });
    assert.ok(policy.includes(`fullscreen=(self "${GM}")`));
    assert.ok(policy.includes(`autoplay=(self "${GM}")`));
    assert.ok(policy.includes(`gamepad=(self "${GM}")`));
    assert.ok(policy.includes("camera=()"));
  });

  it("keeps features to self when embeds are disabled", () => {
    const policy = buildPermissionsPolicy({ ...base, embedsEnabled: false });
    assert.ok(policy.includes("fullscreen=(self)"));
    assert.ok(!policy.includes("gamemonetize"));
  });
});

describe("security headers", () => {
  it("adds X-Robots-Tag only while indexing is disabled", () => {
    const keys = (indexingEnabled: boolean) =>
      buildSecurityHeaders({ ...base, embedsEnabled: true, indexingEnabled }).map((header) => header.key);
    assert.ok(keys(false).includes("X-Robots-Tag"));
    assert.ok(!keys(true).includes("X-Robots-Tag"));
    assert.ok(keys(true).includes("X-Content-Type-Options"));
  });
});
