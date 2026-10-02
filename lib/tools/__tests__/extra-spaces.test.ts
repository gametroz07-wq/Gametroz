import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { removeExtraSpaces } from "../extra-spaces";

const base = { removeEmptyLines: false, joinLines: false };

describe("removeExtraSpaces", () => {
  it("collapses runs of spaces and tabs and trims each line", () => {
    const result = removeExtraSpaces("  Hello    world \t from   here  ", base);
    assert.equal(result.output, "Hello world from here");
    assert.equal(result.charactersRemoved, 11);
  });

  it("collapses non-breaking and other horizontal spaces", () => {
    assert.equal(removeExtraSpaces("a  b c", base).output, "a b c");
  });

  it("keeps line breaks and empty lines by default", () => {
    const result = removeExtraSpaces("one  \n\n  two", base);
    assert.equal(result.output, "one\n\ntwo");
    assert.equal(result.emptyLinesRemoved, 0);
  });

  it("removes empty lines on request", () => {
    const result = removeExtraSpaces("one\n\n   \n two\n", { ...base, removeEmptyLines: true });
    assert.equal(result.output, "one\ntwo");
    assert.equal(result.emptyLinesRemoved, 3);
  });

  it("joins lines with single spaces", () => {
    const result = removeExtraSpaces("Line one\n\n  line   two\nline three", { ...base, joinLines: true });
    assert.equal(result.output, "Line one line two line three");
    assert.equal(result.lineBreaksRemoved, 3);
  });

  it("normalizes CRLF and handles empty input", () => {
    assert.equal(removeExtraSpaces("a \r\n b", base).output, "a\nb");
    assert.deepEqual(removeExtraSpaces("", base), { output: "", charactersRemoved: 0, emptyLinesRemoved: 0, lineBreaksRemoved: 0 });
  });
});
