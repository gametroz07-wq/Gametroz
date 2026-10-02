import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { countText, formatDuration } from "../text-stats";

describe("countText", () => {
  it("returns zeros for empty or whitespace-only text", () => {
    for (const text of ["", "   \n\t  "]) {
      const stats = countText(text);
      assert.equal(stats.words, 0);
      assert.equal(stats.sentences, 0);
      assert.equal(stats.paragraphs, 0);
      assert.equal(stats.readingSeconds, 0);
    }
    assert.equal(countText("").characters, 0);
    assert.equal(countText("").lines, 0);
  });

  it("counts words, characters and sentences", () => {
    const stats = countText("The quick brown fox jumps over the lazy dog.");
    assert.equal(stats.words, 9);
    assert.equal(stats.characters, 44);
    assert.equal(stats.charactersNoSpaces, 36);
    assert.equal(stats.sentences, 1);
  });

  it("treats hyphenated words and contractions as one word", () => {
    assert.equal(countText("well-known don't stop").words, 3);
  });

  it("does not split sentences on decimals", () => {
    assert.equal(countText("Pi is 3.14 today. Really? Yes!").sentences, 3);
  });

  it("counts paragraphs separated by blank lines and every line", () => {
    const stats = countText("One.\n\nTwo.\n  \nThree.\nStill three.");
    assert.equal(stats.paragraphs, 3);
    assert.equal(stats.lines, 6);
  });

  it("counts characters as Unicode code points, not UTF-16 units", () => {
    assert.equal(countText("a😀b").characters, 3);
  });

  it("estimates reading and speaking time from word count", () => {
    const text = Array.from({ length: 230 }, () => "word").join(" ");
    const stats = countText(text);
    assert.equal(stats.readingSeconds, 60);
    assert.equal(stats.speakingSeconds, Math.round((230 / 130) * 60));
  });
});

describe("formatDuration", () => {
  it("formats seconds, minutes and hours", () => {
    assert.equal(formatDuration(0), "0 sec");
    assert.equal(formatDuration(42), "42 sec");
    assert.equal(formatDuration(60), "1 min");
    assert.equal(formatDuration(150), "3 min");
    assert.equal(formatDuration(3720), "1 h 2 min");
  });
});
