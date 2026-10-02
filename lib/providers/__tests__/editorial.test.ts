import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { editorialIssues } from "../editorial";
import { normalizeGameMonetizeGame } from "../gamemonetize/mapper";
import { validGame } from "../gamemonetize/fixtures";
import { validateGameMonetizeGame } from "../gamemonetize/validator";

const game = (overrides: Parameters<typeof normalizeGameMonetizeGame>[0]) =>
  normalizeGameMonetizeGame({ ...validGame, ...overrides });
const messages = (overrides: Parameters<typeof normalizeGameMonetizeGame>[0]) =>
  editorialIssues(game(overrides)).map((issue) => issue.message).join(" | ");

describe("editorial review rules", () => {
  it("passes a clean game", () => {
    assert.deepEqual(editorialIssues(game({})), []);
  });

  it("flags known third-party brands in titles and tags (never auto-rejects)", () => {
    assert.match(messages({ title: "Resident Evil 2: Beat Em Up" }), /brand.*resident evil/i);
    assert.match(messages({ tags: "3D, Roblox, cut" }), /brand.*roblox/i);
    const result = validateGameMonetizeGame({ ...validGame, title: "Resident Evil 2: Beat Em Up" });
    assert.equal(result.status, "NEEDS_REVIEW");
    assert.ok(result.issues.some((issue) => issue.code === "EDITORIAL_REVIEW_REQUIRED" && issue.severity === "warning"));
  });

  it("does not flag look-alike words", () => {
    assert.equal(messages({ title: "Geometry Vibes 3D" }), "");
    assert.equal(messages({ title: "Halloween Fighters" }), "");
  });

  it("flags SEO-spam titles", () => {
    assert.match(messages({ title: "Mother Simulator Husband Wife Games" }), /SEO/i);
    assert.match(messages({ title: "Car Racing Games Online Free Play Now Unblocked" }), /SEO/i);
  });

  it("flags poor instructions", () => {
    assert.match(messages({ instructions: "Tap to play" }), /instructions/i);
  });

  it("flags approximate category mappings for confirmation", () => {
    assert.match(messages({ category: "Girls" }), /category/i);
  });
});

describe("unknown categories", () => {
  it("are imported for review instead of being rejected", () => {
    const result = validateGameMonetizeGame({ ...validGame, category: "Brand New Thing" });
    assert.equal(result.status, "NEEDS_REVIEW");
    assert.ok(result.issues.some((issue) => issue.code === "CATEGORY_UNMAPPED" && issue.severity === "warning"));
    assert.equal(normalizeGameMonetizeGame({ ...validGame, category: "Brand New Thing" }).category, "casual");
  });
});
