import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { platformDefinitions } from "../definitions";
import { appRedirects } from "../redirects";

describe("appRedirects", () => {
  it("permanently sends /apps/browser to /apps/web", () => {
    assert.deepEqual(appRedirects, [{ source: "/apps/browser", destination: "/apps/web", permanent: true }]);
  });

  it("never points at a platform that is not defined", () => {
    const slugs = new Set(platformDefinitions.map((platform) => `/apps/${platform.slug}`));
    for (const redirect of appRedirects) {
      assert.ok(slugs.has(redirect.destination), redirect.destination);
      assert.ok(!slugs.has(redirect.source), `${redirect.source} is still a live platform`);
    }
  });
});
