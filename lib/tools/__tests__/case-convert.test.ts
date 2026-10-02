import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CASE_MODES, convertCase, type CaseMode } from "../case-convert";

const run = (mode: CaseMode, text: string) => convertCase(text, mode);

describe("convertCase", () => {
  it("lists every supported mode", () => {
    assert.deepEqual(
      CASE_MODES.map((mode) => mode.id),
      ["upper", "lower", "title", "sentence", "camel", "pascal", "snake", "kebab", "constant", "alternating", "inverse"],
    );
  });

  it("upper and lower case", () => {
    assert.equal(run("upper", "Hello, World"), "HELLO, WORLD");
    assert.equal(run("lower", "Hello, World"), "hello, world");
  });

  it("title case keeps small words lowercase except first and last", () => {
    assert.equal(run("title", "the lord of the rings"), "The Lord of the Rings");
    assert.equal(run("title", "what are you waiting for"), "What Are You Waiting For");
    assert.equal(run("title", "THE END OF THE ROAD"), "The End of the Road");
    assert.equal(run("title", "well-known don't stop"), "Well-Known Don't Stop");
  });

  it("title case treats each line separately", () => {
    assert.equal(run("title", "a tale of two\nthe war of art"), "A Tale of Two\nThe War of Art");
  });

  it("sentence case capitalizes after sentence ends and line breaks", () => {
    assert.equal(run("sentence", "hELLO world. it's a new day! ok? yes\nnext line"), "Hello world. It's a new day! Ok? Yes\nNext line");
  });

  it("splits words for programming cases, including camelCase and acronyms", () => {
    assert.equal(run("camel", "hello big world"), "helloBigWorld");
    assert.equal(run("pascal", "hello_big-world"), "HelloBigWorld");
    assert.equal(run("snake", "XMLHttpRequest failed"), "xml_http_request_failed");
    assert.equal(run("kebab", "Hello, Big World!"), "hello-big-world");
    assert.equal(run("constant", "maxRetryCount2"), "MAX_RETRY_COUNT_2");
  });

  it("converts programming cases line by line", () => {
    assert.equal(run("snake", "first Name\nlast Name"), "first_name\nlast_name");
  });

  it("alternating and inverse case", () => {
    assert.equal(run("alternating", "hello world"), "hElLo WoRlD");
    assert.equal(run("inverse", "Hello World 123"), "hELLO wORLD 123");
  });

  it("handles accented and non-Latin text without crashing", () => {
    assert.equal(run("upper", "straße"), "STRASSE");
    assert.equal(run("snake", "Crème Brûlée"), "crème_brûlée");
    assert.equal(run("kebab", "日本語 text"), "日本語-text");
    assert.equal(run("title", ""), "");
  });
});
