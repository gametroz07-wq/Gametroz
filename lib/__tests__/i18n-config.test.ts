import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultLocale, enabledLocales, isEnabledLocale, isIndexableLocale, isLocale, locales, spanishEnabled } from "../i18n/config";

describe("locales", () => {
  it("defaults to English and supports Spanish", () => {
    assert.equal(defaultLocale, "en");
    assert.deepEqual([...locales], ["en", "es"]);
  });
});

describe("spanishEnabled", () => {
  it("is off when NEXT_PUBLIC_SPANISH_ENABLED is unset", () => {
    assert.equal(spanishEnabled({}), false);
  });

  it("is on only for the exact string true", () => {
    assert.equal(spanishEnabled({ NEXT_PUBLIC_SPANISH_ENABLED: "true" }), true);
    for (const value of ["", "false", "TRUE", "True", "1", "yes", " true", "true ", "on"]) {
      assert.equal(spanishEnabled({ NEXT_PUBLIC_SPANISH_ENABLED: value }), false, JSON.stringify(value));
    }
  });
});

describe("isLocale", () => {
  it("accepts supported locale codes only", () => {
    assert.equal(isLocale("en"), true);
    assert.equal(isLocale("es"), true);
    for (const value of ["fr", "EN", "en-US", "", "games", "__proto__", "toString"]) {
      assert.equal(isLocale(value), false, value);
    }
  });
});

describe("enabledLocales", () => {
  it("serves English alone while the Spanish switch is off", () => {
    assert.deepEqual(enabledLocales({}), ["en"]);
    assert.deepEqual(enabledLocales({ NEXT_PUBLIC_SPANISH_ENABLED: "false" }), ["en"]);
  });

  it("adds Spanish when the switch is on", () => {
    assert.deepEqual(enabledLocales({ NEXT_PUBLIC_SPANISH_ENABLED: "true" }), ["en", "es"]);
  });
});

describe("isEnabledLocale", () => {
  it("accepts English always and Spanish only while the switch is on", () => {
    assert.equal(isEnabledLocale("en", {}), true);
    assert.equal(isEnabledLocale("es", {}), false);
    assert.equal(isEnabledLocale("es", { NEXT_PUBLIC_SPANISH_ENABLED: "true" }), true);
  });

  it("rejects values that are not locales", () => {
    for (const value of ["fr", "api", "foo.js", "", "EN"]) {
      assert.equal(isEnabledLocale(value, { NEXT_PUBLIC_SPANISH_ENABLED: "true" }), false, value);
    }
  });
});

describe("isIndexableLocale", () => {
  it("keeps Spanish out of search results until its copy is translated", () => {
    assert.equal(isIndexableLocale("en"), true);
    assert.equal(isIndexableLocale("es"), false);
  });
});
