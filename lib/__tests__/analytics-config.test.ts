import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { gaMeasurementId, gtagBootstrapScript, gtagSrc } from "../analytics/config";

describe("gaMeasurementId", () => {
  it("is off when NEXT_PUBLIC_GA_ID is unset or blank", () => {
    assert.equal(gaMeasurementId({}), null);
    assert.equal(gaMeasurementId({ NEXT_PUBLIC_GA_ID: "" }), null);
    assert.equal(gaMeasurementId({ NEXT_PUBLIC_GA_ID: "   " }), null);
  });

  it("is off for anything that is not a GA4 measurement ID", () => {
    for (const value of ["UA-12345-1", "G-", "g-abc123", "G-abc123", "G-ABC 123", "G-ABC123;alert(1)", "GTM-ABC123", "ABC123", "true"]) {
      assert.equal(gaMeasurementId({ NEXT_PUBLIC_GA_ID: value }), null, value);
    }
  });

  it("returns a well-formed ID, trimmed", () => {
    assert.equal(gaMeasurementId({ NEXT_PUBLIC_GA_ID: "G-ABC123XYZ9" }), "G-ABC123XYZ9");
    assert.equal(gaMeasurementId({ NEXT_PUBLIC_GA_ID: "  G-ABC123XYZ9\n" }), "G-ABC123XYZ9");
  });
});

describe("gtag snippets", () => {
  it("loads gtag.js from googletagmanager.com for the given ID", () => {
    assert.equal(gtagSrc("G-ABC123"), "https://www.googletagmanager.com/gtag/js?id=G-ABC123");
  });

  it("bootstraps the dataLayer and configures the ID with default page-view reporting", () => {
    const script = gtagBootstrapScript("G-ABC123");
    assert.ok(script.includes("window.dataLayer = window.dataLayer || []"));
    assert.ok(script.includes('gtag("config", "G-ABC123")'));
    assert.ok(!script.includes("send_page_view"), "history-change page views come from enhanced measurement");
  });
});
