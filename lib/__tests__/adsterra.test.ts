import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ADSTERRA_FRAME_SANDBOX, buildAdsterraSrcDoc, placementUnits } from "../ads/adsterra";

describe("placementUnits", () => {
  it("gives every placement at least one unit with a valid key and size", () => {
    for (const [placement, candidates] of Object.entries(placementUnits)) {
      assert.ok(candidates.length > 0, placement);
      for (const { media, unit } of candidates) {
        assert.ok(media.length > 0, placement);
        assert.match(unit.key, /^[a-f0-9]{32}$/, placement);
        assert.ok(unit.width > 0 && unit.height > 0, placement);
      }
    }
  });

  it("serves the leaderboard on desktop and the mobile banner below it", () => {
    for (const placement of ["home-feed", "game-below-player"] as const) {
      const sizes = placementUnits[placement].map(({ unit }) => `${unit.width}x${unit.height}`);
      assert.deepEqual(sizes, ["728x90", "320x50"]);
    }
  });

  it("loads the sidebar unit on desktop only", () => {
    const [candidate, ...rest] = placementUnits.sidebar;
    assert.equal(rest.length, 0);
    assert.match(candidate.media, /min-width: 1024px/);
    assert.equal(`${candidate.unit.width}x${candidate.unit.height}`, "160x300");
  });
});

describe("buildAdsterraSrcDoc", () => {
  const unit = { key: "a9cc540db376b3232253d7a71aa9a717", width: 300, height: 250 };
  const doc = buildAdsterraSrcDoc(unit);

  it("declares the unit options before loading its invoke script", () => {
    const options = doc.indexOf(`atOptions = {"key":"${unit.key}","format":"iframe","height":250,"width":300,"params":{}}`);
    const invoke = doc.indexOf(`<script src="https://www.highrevenueformat.com/${unit.key}/invoke.js"></script>`);
    assert.ok(options > -1, "options");
    assert.ok(invoke > options, "invoke after options");
  });

  it("is a complete document without page margins", () => {
    assert.ok(doc.startsWith("<!doctype html>"));
    assert.ok(doc.includes("margin:0"));
  });
});

describe("ADSTERRA_FRAME_SANDBOX", () => {
  it("lets ads run and open new tabs but never navigate the page away", () => {
    const tokens = ADSTERRA_FRAME_SANDBOX.split(" ");
    for (const token of ["allow-scripts", "allow-popups", "allow-popups-to-escape-sandbox"]) {
      assert.ok(tokens.includes(token), token);
    }
    assert.ok(!tokens.some((token) => token.startsWith("allow-top-navigation")));
  });
});
