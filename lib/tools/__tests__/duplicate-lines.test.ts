import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { removeDuplicateLines } from "../duplicate-lines";

const base = { caseSensitive: true, trim: false, ignoreEmpty: false };

describe("removeDuplicateLines", () => {
  it("keeps the first occurrence and the original order", () => {
    const result = removeDuplicateLines("b\na\nb\nc\na", base);
    assert.equal(result.output, "b\na\nc");
    assert.equal(result.removed, 2);
    assert.equal(result.total, 5);
    assert.equal(result.kept, 3);
  });

  it("is case sensitive by default and can ignore case", () => {
    assert.equal(removeDuplicateLines("apple\nApple", base).output, "apple\nApple");
    const result = removeDuplicateLines("apple\nBanana\nAPPLE\nbanana", { ...base, caseSensitive: false });
    assert.equal(result.output, "apple\nBanana");
    assert.equal(result.removed, 2);
  });

  it("can trim lines before comparing but keeps the first original line", () => {
    assert.equal(removeDuplicateLines("a\n  a  \nb", base).output, "a\n  a  \nb");
    assert.equal(removeDuplicateLines("  a\na  \nb", { ...base, trim: true }).output, "  a\nb");
  });

  it("treats empty lines as duplicates unless they are ignored", () => {
    assert.equal(removeDuplicateLines("a\n\nb\n\nc", base).output, "a\n\nb\nc");
    const result = removeDuplicateLines("a\n\nb\n\nc", { ...base, ignoreEmpty: true });
    assert.equal(result.output, "a\n\nb\n\nc");
    assert.equal(result.removed, 0);
  });

  it("treats whitespace-only lines as empty only when trimming", () => {
    const text = "a\n  \n\n  ";
    const untrimmed = removeDuplicateLines(text, { ...base, ignoreEmpty: true });
    assert.equal(untrimmed.output, "a\n  \n");
    assert.equal(untrimmed.removed, 1);
    assert.equal(removeDuplicateLines(text, { ...base, ignoreEmpty: true, trim: true }).removed, 0);
  });

  it("normalizes CRLF and handles empty input", () => {
    assert.equal(removeDuplicateLines("a\r\na\r\nb", base).output, "a\nb");
    assert.deepEqual(removeDuplicateLines("", base), { output: "", total: 0, kept: 0, removed: 0 });
  });
});
