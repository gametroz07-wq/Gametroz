import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  gameWithDisallowedEmbed,
  gameWithHttpEmbed,
  gameWithMissingFields,
  gameWithShortDescription,
  gameWithTakenSlug,
  gameWithUnmappedCategory,
  gameWithUnreasonableSize,
  gameWithoutThumbnail,
  validGame,
} from "../gamemonetize/fixtures";
import { validateGameMonetizeGame } from "../gamemonetize/validator";
import type { ValidationCode } from "../types";

const codes = (result: { issues: { code: ValidationCode }[] }) => result.issues.map((issue) => issue.code);

describe("GameMonetize validator", () => {
  it("accepts a complete game", () => {
    const result = validateGameMonetizeGame(validGame);
    assert.equal(result.status, "VALID");
    assert.deepEqual(result.issues, []);
  });

  it("rejects a game without thumbnail", () => {
    const result = validateGameMonetizeGame(gameWithoutThumbnail);
    assert.equal(result.status, "REJECTED");
    assert.ok(codes(result).includes("THUMBNAIL_MISSING"));
  });

  it("rejects an embed outside the allowlist", () => {
    const result = validateGameMonetizeGame(gameWithDisallowedEmbed);
    assert.equal(result.status, "REJECTED");
    assert.ok(codes(result).includes("EMBED_HOST_NOT_ALLOWED"));
  });

  it("rejects a non-HTTPS embed", () => {
    const result = validateGameMonetizeGame(gameWithHttpEmbed);
    assert.equal(result.status, "REJECTED");
    assert.ok(codes(result).includes("EMBED_NOT_HTTPS"));
  });

  it("rejects missing required fields", () => {
    const result = validateGameMonetizeGame(gameWithMissingFields);
    assert.equal(result.status, "REJECTED");
    assert.ok(codes(result).includes("NAME_MISSING"));
    assert.ok(codes(result).includes("SLUG_INVALID"));
  });

  it("rejects an unmapped category", () => {
    const result = validateGameMonetizeGame(gameWithUnmappedCategory);
    assert.equal(result.status, "REJECTED");
    assert.ok(codes(result).includes("CATEGORY_UNMAPPED"));
  });

  it("flags a short description for review", () => {
    const result = validateGameMonetizeGame(gameWithShortDescription);
    assert.equal(result.status, "NEEDS_REVIEW");
    assert.deepEqual(codes(result), ["DESCRIPTION_TOO_SHORT"]);
  });

  it("flags unreasonable sizes for review", () => {
    const result = validateGameMonetizeGame(gameWithUnreasonableSize);
    assert.equal(result.status, "NEEDS_REVIEW");
    assert.ok(codes(result).includes("SIZE_UNREASONABLE"));
  });

  it("rejects a slug owned by another game", () => {
    const result = validateGameMonetizeGame(gameWithTakenSlug, {
      isSlugTaken: (slug) => slug === "neon-drift",
    });
    assert.equal(result.status, "REJECTED");
    assert.ok(codes(result).includes("DUPLICATE_SLUG"));
  });
});
