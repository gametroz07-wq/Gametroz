import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isFreeLicense, isOpenSourceLicense } from "../app-license";

describe("isOpenSourceLicense", () => {
  it("recognizes common open-source licenses from stored license text", () => {
    for (const license of ["GPL-2.0", "GPL-3.0", "AGPL-3.0", "MPL-2.0", "LGPL-2.1 (with unRAR restriction)", "MIT", "Apache-2.0", "BSD-3-Clause", "Free and open source (Python Software Foundation License)"]) {
      assert.equal(isOpenSourceLicense(license), true, license);
    }
  });

  it("does not guess for proprietary, unknown or empty licenses", () => {
    for (const license of ["Proprietary", "Freeware", "Shareware", "", null, undefined]) {
      assert.equal(isOpenSourceLicense(license), false, String(license));
    }
  });
});

describe("isFreeLicense", () => {
  it("is true only when the page says the app is free, without paid tiers or trial terms", () => {
    for (const license of ["Free", "Free and open source (GPL-2.0)", "Free and open source (MPL-2.0)"]) {
      assert.equal(isFreeLicense(license), true, license);
    }
  });

  it("is false for freemium, trials, unknown and empty values", () => {
    for (const license of [
      "Free with optional paid plans",
      "Free tier with paid plans",
      "Free to evaluate; license required for continued use",
      "Free for personal use and small teams; paid plans for larger companies",
      "Paid",
      "",
      null,
      undefined,
    ]) {
      assert.equal(isFreeLicense(license), false, String(license));
    }
  });
});
