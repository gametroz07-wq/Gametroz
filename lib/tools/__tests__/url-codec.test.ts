import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { decodeUrlText, encodeUrlText, parseQueryString } from "../url-codec";

describe("encodeUrlText", () => {
  it("component mode escapes reserved characters", () => {
    assert.deepEqual(encodeUrlText("a b&c=d/é?", "component"), { ok: true, output: "a%20b%26c%3Dd%2F%C3%A9%3F" });
  });

  it("full mode keeps URL structure", () => {
    assert.deepEqual(encodeUrlText("https://example.com/a b?q=café#top", "full"), {
      ok: true,
      output: "https://example.com/a%20b?q=caf%C3%A9#top",
    });
  });

  it("reports an unpaired surrogate instead of throwing", () => {
    const result = encodeUrlText("bad \ud800 text", "component");
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /surrogate/i);
  });
});

describe("decodeUrlText", () => {
  it("decodes percent-encoded UTF-8", () => {
    assert.deepEqual(decodeUrlText("caf%C3%A9%20%E2%98%95", { mode: "component", plusAsSpace: false }), { ok: true, output: "café ☕" });
  });

  it("handles plus as space only when asked", () => {
    assert.deepEqual(decodeUrlText("a+b%2Bc", { mode: "component", plusAsSpace: true }), { ok: true, output: "a b+c" });
    assert.deepEqual(decodeUrlText("a+b", { mode: "component", plusAsSpace: false }), { ok: true, output: "a+b" });
  });

  it("full mode leaves reserved escapes alone", () => {
    assert.deepEqual(decodeUrlText("a%2Fb%20c", { mode: "full", plusAsSpace: false }), { ok: true, output: "a%2Fb c" });
  });

  it("reports malformed sequences", () => {
    for (const bad of ["100%", "%zz", "%E2%98"]) {
      const result = decodeUrlText(bad, { mode: "component", plusAsSpace: false });
      assert.equal(result.ok, false, bad);
      if (!result.ok) assert.match(result.error, /Malformed percent-encoding/);
    }
  });
});

describe("parseQueryString", () => {
  it("parses a full URL", () => {
    const result = parseQueryString("https://shop.example.com/search?q=red+shoes&size=9&sort=price%20asc#results");
    assert.deepEqual(result, {
      ok: true,
      pairs: [
        { key: "q", value: "red shoes" },
        { key: "size", value: "9" },
        { key: "sort", value: "price asc" },
      ],
    });
  });

  it("parses a bare query string, with or without the question mark", () => {
    const expected = {
      ok: true,
      pairs: [
        { key: "a", value: "1" },
        { key: "b", value: "" },
        { key: "c", value: "" },
      ],
    };
    assert.deepEqual(parseQueryString("?a=1&b=&c"), expected);
    assert.deepEqual(parseQueryString("a=1&b=&c&"), expected);
  });

  it("keeps repeated keys and splits only on the first equals sign", () => {
    assert.deepEqual(parseQueryString("tag=a&tag=b&eq=x=y"), {
      ok: true,
      pairs: [
        { key: "tag", value: "a" },
        { key: "tag", value: "b" },
        { key: "eq", value: "x=y" },
      ],
    });
  });

  it("returns no pairs for a URL without a query", () => {
    assert.deepEqual(parseQueryString("https://example.com/path"), { ok: true, pairs: [] });
  });

  it("names the pair that has a malformed escape", () => {
    const result = parseQueryString("a=1&b=%zz");
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /b=%zz/);
  });
});
