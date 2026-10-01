import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toPlainText } from "../text";

describe("toPlainText", () => {
  it("decodes typographic and numeric entities", () => {
    assert.equal(toPlainText("Run &mdash; jump &ndash; win&hellip; it&rsquo;s &#8220;fun&#8221; &#x2014;"), "Run — jump – win… it’s “fun” —");
  });

  it("decodes double-encoded entities seen in the live feed", () => {
    assert.equal(toPlainText("three hearts per run &amp;mdash; grab shields"), "three hearts per run — grab shields");
  });

  it("repairs bare entity words left by the provider's own sanitizer", () => {
    assert.equal(toPlainText("Keyboard mdash or A D steer"), "Keyboard — or A D steer");
    assert.equal(toPlainText("tap to jump ndash touch controls"), "tap to jump – touch controls");
  });

  it("keeps normal words that merely contain those letters", () => {
    assert.equal(toPlainText("Dashboard mdashx candash"), "Dashboard mdashx candash");
  });

  it("still strips tags", () => {
    assert.equal(toPlainText("<p>Race &amp; <b>win</b></p>"), "Race & win");
  });
});
