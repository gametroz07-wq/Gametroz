import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contrastRatio, contrastWarning, parseHexColor, qrCapacityBytes, validateQrInput, validateQrSize } from "../qr";

describe("parseHexColor", () => {
  it("parses 6-digit and 3-digit hex colors", () => {
    assert.deepEqual(parseHexColor("#ff8000"), [255, 128, 0]);
    assert.deepEqual(parseHexColor("#FFF"), [255, 255, 255]);
    assert.deepEqual(parseHexColor("000"), [0, 0, 0]);
  });

  it("rejects anything else", () => {
    for (const bad of ["", "#12", "#GGGGGG", "red", "#1234567"]) assert.equal(parseHexColor(bad), null, bad);
  });
});

describe("contrastRatio", () => {
  it("matches the WCAG reference values", () => {
    assert.ok(Math.abs((contrastRatio("#000000", "#ffffff") ?? 0) - 21) < 1e-9);
    assert.equal(contrastRatio("#ffffff", "#ffffff"), 1);
    const grey = contrastRatio("#777777", "#ffffff");
    assert.ok(grey !== null && Math.abs(grey - 4.48) < 0.01, String(grey));
  });

  it("is symmetric and null for invalid colors", () => {
    assert.equal(contrastRatio("#123456", "#fedcba"), contrastRatio("#fedcba", "#123456"));
    assert.equal(contrastRatio("nope", "#ffffff"), null);
  });
});

describe("contrastWarning", () => {
  it("is silent for a dark code on a light background", () => {
    assert.equal(contrastWarning("#000000", "#ffffff"), null);
    assert.equal(contrastWarning("#1f2937", "#f8fafc"), null);
  });

  it("warns about low contrast", () => {
    assert.match(contrastWarning("#999999", "#ffffff") ?? "", /contrast/i);
    assert.match(contrastWarning("#ffffff", "#ffffff") ?? "", /contrast/i);
  });

  it("warns when the code is lighter than its background", () => {
    assert.match(contrastWarning("#ffffff", "#000000") ?? "", /inverted|lighter/i);
  });
});

describe("validateQrInput", () => {
  it("rejects empty text", () => {
    assert.deepEqual(validateQrInput("", "M"), { ok: false, error: "Enter some text or a URL to encode." });
    assert.equal(validateQrInput("   \n", "M").ok, false);
  });

  it("accepts text within the capacity of the level and counts UTF-8 bytes", () => {
    assert.deepEqual(validateQrInput("https://example.com", "H"), { ok: true });
    assert.equal(validateQrInput("a".repeat(qrCapacityBytes("H")), "H").ok, true);
    assert.equal(validateQrInput("a".repeat(qrCapacityBytes("H") + 1), "H").ok, false);
    // 3 bytes each in UTF-8.
    assert.equal(validateQrInput("€".repeat(Math.floor(qrCapacityBytes("L") / 3) + 1), "L").ok, false);
  });

  it("gives higher error correction a smaller capacity", () => {
    assert.ok(qrCapacityBytes("L") > qrCapacityBytes("M"));
    assert.ok(qrCapacityBytes("M") > qrCapacityBytes("Q"));
    assert.ok(qrCapacityBytes("Q") > qrCapacityBytes("H"));
  });

  it("mentions the limit in the error", () => {
    const result = validateQrInput("a".repeat(5000), "M");
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /2,331/);
  });
});

describe("validateQrSize", () => {
  it("accepts whole pixel sizes from 128 to 1024", () => {
    for (const size of [128, 256, 1024]) assert.deepEqual(validateQrSize(size), { ok: true });
    for (const size of [127, 1025, 300.5, Number.NaN]) assert.equal(validateQrSize(size).ok, false, String(size));
  });
});
