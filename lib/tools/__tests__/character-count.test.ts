import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHARACTER_LIMITS, countCharacters, limitStatus, splitGraphemes } from "../character-count";

describe("splitGraphemes", () => {
  it("keeps emoji, ZWJ sequences and combining marks together", () => {
    assert.equal(splitGraphemes("a👋b").length, 3);
    assert.equal(splitGraphemes("👨‍👩‍👧").length, 1);
    assert.equal(splitGraphemes("café").length, 4);
  });

  it("falls back to code points when Intl.Segmenter is unavailable", () => {
    assert.deepEqual(splitGraphemes("a👋b", null), ["a", "👋", "b"]);
  });
});

describe("countCharacters", () => {
  it("returns zeros for empty text", () => {
    assert.deepEqual(countCharacters(""), {
      characters: 0,
      charactersNoSpaces: 0,
      letters: 0,
      digits: 0,
      whitespace: 0,
      lines: 0,
      bytes: 0,
    });
  });

  it("counts letters, digits, whitespace and lines", () => {
    const stats = countCharacters("Room 42\nfloor 3 ");
    assert.equal(stats.characters, 16);
    assert.equal(stats.charactersNoSpaces, 12);
    assert.equal(stats.letters, 9);
    assert.equal(stats.digits, 3);
    assert.equal(stats.whitespace, 4);
    assert.equal(stats.lines, 2);
  });

  it("counts user-perceived characters and UTF-8 bytes", () => {
    const stats = countCharacters("Hello 👋 café");
    assert.equal(stats.characters, 12);
    assert.equal(stats.charactersNoSpaces, 10);
    assert.equal(stats.bytes, 16);
    assert.equal(countCharacters("café").characters, 4);
    assert.equal(countCharacters("café").bytes, 6);
  });

  it("treats CRLF as one whitespace character and one line break", () => {
    const stats = countCharacters("a\r\nb");
    assert.equal(stats.characters, 3);
    assert.equal(stats.whitespace, 1);
    assert.equal(stats.lines, 2);
  });
});

describe("limitStatus", () => {
  it("offers the common presets", () => {
    const ids = CHARACTER_LIMITS.map((limit) => limit.id);
    for (const id of ["sms", "x-post", "meta-description"]) assert.ok(ids.includes(id), id);
  });

  it("reports remaining characters under the limit", () => {
    assert.deepEqual(limitStatus(46, 160), { limit: 160, remaining: 114, over: 0, exceeded: false });
  });

  it("reports the excess over the limit", () => {
    assert.deepEqual(limitStatus(165, 160), { limit: 160, remaining: 0, over: 5, exceeded: true });
  });

  it("is exactly at the limit without being exceeded", () => {
    assert.equal(limitStatus(160, 160).exceeded, false);
  });
});
