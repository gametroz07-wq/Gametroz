import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { gamePathsToRevalidate, isAuthorizedRevalidation, parseRevalidateSlugs } from "../revalidate";

describe("isAuthorizedRevalidation", () => {
  it("accepts only the exact bearer secret", () => {
    assert.equal(isAuthorizedRevalidation("Bearer s3cret-value-123456", "s3cret-value-123456"), true);
    assert.equal(isAuthorizedRevalidation("Bearer wrong", "s3cret-value-123456"), false);
    assert.equal(isAuthorizedRevalidation(null, "s3cret-value-123456"), false);
    assert.equal(isAuthorizedRevalidation("s3cret-value-123456", "s3cret-value-123456"), false);
  });

  it("is disabled when no secret, or a weak one, is configured", () => {
    assert.equal(isAuthorizedRevalidation("Bearer ", ""), false);
    assert.equal(isAuthorizedRevalidation("Bearer x", undefined), false);
    assert.equal(isAuthorizedRevalidation("Bearer short", "short"), false);
  });
});

describe("parseRevalidateSlugs", () => {
  it("accepts a list of valid slugs", () => {
    assert.deepEqual(parseRevalidateSlugs({ slugs: ["halloween-fighters", "merge-monsters"] }), ["halloween-fighters", "merge-monsters"]);
  });

  it("rejects malformed input", () => {
    assert.equal(parseRevalidateSlugs({ slugs: ["../etc/passwd"] }), null);
    assert.equal(parseRevalidateSlugs({ slugs: "halloween-fighters" }), null);
    assert.equal(parseRevalidateSlugs(null), null);
    assert.equal(parseRevalidateSlugs({ slugs: new Array(501).fill("a-game") }), null);
  });

  it("allows an empty list (refresh listings only)", () => {
    assert.deepEqual(parseRevalidateSlugs({ slugs: [] }), []);
  });
});

describe("gamePathsToRevalidate", () => {
  it("refreshes listings and each game page", () => {
    assert.deepEqual(gamePathsToRevalidate(["halloween-fighters"]), ["/", "/games", "/game/halloween-fighters"]);
  });
});
