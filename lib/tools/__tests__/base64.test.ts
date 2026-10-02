import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { decodeBase64, encodeBase64 } from "../base64";

describe("encodeBase64", () => {
  it("encodes ASCII", () => {
    assert.equal(encodeBase64("Hello, World!"), "SGVsbG8sIFdvcmxkIQ==");
    assert.equal(encodeBase64(""), "");
  });

  it("encodes Unicode as UTF-8 bytes", () => {
    assert.equal(encodeBase64("café"), "Y2Fmw6k=");
    assert.equal(encodeBase64("☕"), "4piV");
    assert.equal(encodeBase64("😀"), "8J+YgA==");
  });

  it("supports the URL-safe alphabet and optional padding", () => {
    assert.equal(encodeBase64("~~~"), "fn5+");
    assert.equal(encodeBase64("~~~", { urlSafe: true }), "fn5-");
    assert.equal(encodeBase64("???", { urlSafe: true }), "Pz8_");
    assert.equal(encodeBase64("a"), "YQ==");
    assert.equal(encodeBase64("a", { padding: false }), "YQ");
  });
});

describe("decodeBase64", () => {
  it("round-trips Unicode text", () => {
    for (const text of ["Hello", "café ☕ 😀", "日本語", "line1\nline2"]) {
      assert.deepEqual(decodeBase64(encodeBase64(text)), { ok: true, output: text });
      assert.deepEqual(decodeBase64(encodeBase64(text, { urlSafe: true, padding: false })), { ok: true, output: text });
    }
  });

  it("accepts missing padding, whitespace and line breaks", () => {
    assert.deepEqual(decodeBase64("YQ"), { ok: true, output: "a" });
    assert.deepEqual(decodeBase64("  SGVs\nbG8= "), { ok: true, output: "Hello" });
    assert.deepEqual(decodeBase64(""), { ok: true, output: "" });
  });

  it("reports an invalid character with its position", () => {
    const result = decodeBase64("SGVsbG8*");
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /Invalid character "\*" at position 8/);
  });

  it("rejects impossible lengths, misplaced padding and mixed alphabets", () => {
    const length = decodeBase64("SGVsb");
    assert.equal(length.ok, false);
    if (!length.ok) assert.match(length.error, /length/i);

    const padding = decodeBase64("SG=sbG8=");
    assert.equal(padding.ok, false);
    if (!padding.ok) assert.match(padding.error, /padding/i);

    const mixed = decodeBase64("a+b-");
    assert.equal(mixed.ok, false);
    if (!mixed.ok) assert.match(mixed.error, /mixes/i);
  });

  it("rejects bytes that are not valid UTF-8", () => {
    const result = decodeBase64("/w==");
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /UTF-8/);
  });
});
