import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { adsEnabled } from "../ads/config";

describe("adsEnabled", () => {
  it("is off unless ADSTERRA_ENABLED is exactly true", () => {
    assert.equal(adsEnabled({}), false);
    assert.equal(adsEnabled({ ADSTERRA_ENABLED: "false" }), false);
    assert.equal(adsEnabled({ ADSTERRA_ENABLED: "TRUE " }), false);
    assert.equal(adsEnabled({ ADSTERRA_ENABLED: "1" }), false);
    assert.equal(adsEnabled({ ADSTERRA_ENABLED: "true" }), true);
  });
});
