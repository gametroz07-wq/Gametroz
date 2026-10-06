import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { adsEnabled, monetagEnabled, thirdPartyAdsEnabled } from "../ads/config";

describe("adsEnabled", () => {
  it("is off unless ADSTERRA_ENABLED is exactly true", () => {
    assert.equal(adsEnabled({}), false);
    assert.equal(adsEnabled({ ADSTERRA_ENABLED: "false" }), false);
    assert.equal(adsEnabled({ ADSTERRA_ENABLED: "TRUE " }), false);
    assert.equal(adsEnabled({ ADSTERRA_ENABLED: "1" }), false);
    assert.equal(adsEnabled({ ADSTERRA_ENABLED: "true" }), true);
  });
});

describe("monetagEnabled", () => {
  it("is off unless MONETAG_ENABLED is exactly true", () => {
    assert.equal(monetagEnabled({}), false);
    assert.equal(monetagEnabled({ MONETAG_ENABLED: "1" }), false);
    assert.equal(monetagEnabled({ ADSTERRA_ENABLED: "true" }), false);
    assert.equal(monetagEnabled({ MONETAG_ENABLED: "true" }), true);
  });
});

describe("thirdPartyAdsEnabled", () => {
  it("is on when any ad network is enabled", () => {
    assert.equal(thirdPartyAdsEnabled({}), false);
    assert.equal(thirdPartyAdsEnabled({ ADSTERRA_ENABLED: "true" }), true);
    assert.equal(thirdPartyAdsEnabled({ MONETAG_ENABLED: "true" }), true);
  });
});
