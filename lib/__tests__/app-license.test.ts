import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isOpenSourceLicense } from "../app-license";

describe("isOpenSourceLicense", () => {
  it("recognizes common open-source licenses from stored license text", () => {
    for (const license of ["GPL-2.0", "GPL-3.0", "AGPL-3.0", "MPL-2.0", "LGPL-2.1 (with unRAR restriction)", "MIT", "Apache-2.0", "BSD-3-Clause"]) {
      assert.equal(isOpenSourceLicense(license), true, license);
    }
  });

  it("does not guess for proprietary, unknown or empty licenses", () => {
    for (const license of ["Proprietary", "Freeware", "Shareware", "", null, undefined]) {
      assert.equal(isOpenSourceLicense(license), false, String(license));
    }
  });
});
