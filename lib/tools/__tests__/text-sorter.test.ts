import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sortLines, type SortOptions } from "../text-sorter";

const base: SortOptions = { mode: "az", caseInsensitive: false, removeEmpty: false, dedupe: false };
const sort = (text: string, options: Partial<SortOptions> = {}) => sortLines(text, { ...base, ...options }).output;

describe("sortLines", () => {
  it("sorts A to Z and Z to A", () => {
    assert.equal(sort("pear\napple\nfig"), "apple\nfig\npear");
    assert.equal(sort("pear\napple\nfig", { mode: "za" }), "pear\nfig\napple");
  });

  it("A to Z compares digits as text, natural order compares them as numbers", () => {
    assert.equal(sort("item10\nitem2\nitem1"), "item1\nitem10\nitem2");
    assert.equal(sort("item10\nitem2\nitem1", { mode: "natural" }), "item1\nitem2\nitem10");
  });

  it("sorts by length and keeps the original order for equal lengths", () => {
    assert.equal(sort("pear\nfig\nbanana\nkiwi", { mode: "length" }), "fig\npear\nkiwi\nbanana");
  });

  it("reverses the order without sorting", () => {
    assert.equal(sort("c\na\nb", { mode: "reverse" }), "b\na\nc");
  });

  it("shuffles using the supplied random source and keeps every line", () => {
    const result = sortLines("a\nb\nc\nd", { ...base, mode: "shuffle" }, () => 0);
    assert.deepEqual(result.output.split("\n").sort(), ["a", "b", "c", "d"]);
    assert.notEqual(result.output, "a\nb\nc\nd");
  });

  it("shuffles with crypto by default", () => {
    const lines = Array.from({ length: 50 }, (_, index) => `line ${index}`);
    const result = sort(lines.join("\n"), { mode: "shuffle" });
    assert.deepEqual(result.split("\n").sort(), [...lines].sort());
  });

  it("is case sensitive unless told otherwise", () => {
    assert.deepEqual(sort("b\nA\na\nB").split("\n"), ["a", "A", "b", "B"]);
    assert.equal(sort("b\nA\nc", { caseInsensitive: true }), "A\nb\nc");
  });

  it("removes empty lines and duplicates on request", () => {
    const result = sortLines("b\n\na\nb\n  \na", { ...base, removeEmpty: true, dedupe: true });
    assert.equal(result.output, "a\nb");
    assert.equal(result.removed, 4);
  });

  it("dedupe respects case-insensitive comparison and keeps the first line", () => {
    assert.equal(sort("Apple\napple\nBanana", { dedupe: true, caseInsensitive: true }), "Apple\nBanana");
  });

  it("handles empty input and CRLF", () => {
    assert.deepEqual(sortLines("", base), { output: "", total: 0, removed: 0 });
    assert.equal(sort("b\r\na"), "a\nb");
  });
});
