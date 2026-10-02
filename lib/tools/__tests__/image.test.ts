import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MAX_BATCH,
  MAX_FILE_BYTES,
  MAX_PIXELS,
  detectFormat,
  downscaleSteps,
  formatBytes,
  formatSize,
  outputFileName,
  parseDimension,
  percentSaved,
  qualityToUnit,
  resizeKeepingAspect,
  scaleByPercent,
  scaleToMaxWidth,
  targetSize,
  validateDimensions,
  validateImageFile,
} from "../image";

describe("detectFormat", () => {
  it("reads the MIME type first", () => {
    assert.equal(detectFormat("a.bin", "image/png"), "png");
    assert.equal(detectFormat("a.png", "image/jpeg"), "jpeg");
    assert.equal(detectFormat("a", "image/webp"), "webp");
  });

  it("falls back to the extension when the type is empty", () => {
    assert.equal(detectFormat("Photo.JPG", ""), "jpeg");
    assert.equal(detectFormat("photo.jpeg", ""), "jpeg");
    assert.equal(detectFormat("pic.WebP", ""), "webp");
  });

  it("returns null for other types", () => {
    assert.equal(detectFormat("a.gif", "image/gif"), null);
    assert.equal(detectFormat("a.txt", "text/plain"), null);
    assert.equal(detectFormat("noext", ""), null);
  });
});

describe("validateImageFile", () => {
  const png = { name: "a.png", type: "image/png", size: 1000 };

  it("accepts an allowed type within the size limit", () => {
    assert.deepEqual(validateImageFile(png, ["png"]), { ok: true, format: "png" });
    assert.deepEqual(validateImageFile({ ...png, size: MAX_FILE_BYTES }, ["png", "jpeg"]), { ok: true, format: "png" });
  });

  it("rejects a type the tool does not accept, naming what it does", () => {
    const result = validateImageFile({ name: "a.gif", type: "image/gif", size: 10 }, ["png"]);
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /PNG/);
    const two = validateImageFile({ name: "a.gif", type: "image/gif", size: 10 }, ["jpeg", "png", "webp"]);
    if (!two.ok) assert.match(two.error, /JPEG, PNG or WebP/);
  });

  it("rejects empty and oversized files", () => {
    const empty = validateImageFile({ ...png, size: 0 }, ["png"]);
    assert.equal(empty.ok, false);
    const big = validateImageFile({ ...png, size: MAX_FILE_BYTES + 1 }, ["png"]);
    assert.equal(big.ok, false);
    if (!big.ok) assert.match(big.error, /25 MB/);
  });
});

describe("validateDimensions", () => {
  it("accepts normal sizes and the pixel limit", () => {
    assert.equal(validateDimensions(4032, 3024), null);
    assert.equal(validateDimensions(MAX_PIXELS / 5000, 5000), null);
  });

  it("rejects zero, non-integer and oversized images", () => {
    assert.ok(validateDimensions(0, 10));
    assert.ok(validateDimensions(10.5, 10));
    assert.ok(validateDimensions(20000, 10));
    assert.match(validateDimensions(10000, 10000) ?? "", /50 megapixels/);
  });
});

describe("formatBytes and formatSize", () => {
  it("formats bytes, KB and MB", () => {
    assert.equal(formatBytes(0), "0 bytes");
    assert.equal(formatBytes(512), "512 bytes");
    assert.equal(formatBytes(1536), "1.5 KB");
    assert.equal(formatBytes(1024 * 1024), "1.00 MB");
    assert.equal(formatBytes(2.5 * 1024 * 1024), "2.50 MB");
  });

  it("formats dimensions", () => {
    assert.equal(formatSize({ width: 4032, height: 3024 }), "4032 × 3024 px");
  });
});

describe("percentSaved", () => {
  it("is the share removed, to one decimal", () => {
    assert.equal(percentSaved(2_000_000, 500_000), 75);
    assert.equal(percentSaved(3, 2), 33.3);
  });

  it("is negative when the output grew and 0 for an empty original", () => {
    assert.equal(percentSaved(1000, 1500), -50);
    assert.equal(percentSaved(0, 10), 0);
  });
});

describe("qualityToUnit", () => {
  it("maps 1-100 to 0.01-1", () => {
    assert.equal(qualityToUnit(80), 0.8);
    assert.equal(qualityToUnit(100), 1);
    assert.equal(qualityToUnit(1), 0.01);
  });

  it("clamps and falls back to 0.8", () => {
    assert.equal(qualityToUnit(0), 0.01);
    assert.equal(qualityToUnit(250), 1);
    assert.equal(qualityToUnit(Number.NaN), 0.8);
  });
});

describe("outputFileName", () => {
  it("swaps the extension", () => {
    assert.equal(outputFileName("holiday photo.PNG", "jpeg"), "holiday photo.jpg");
    assert.equal(outputFileName("banner.webp", "jpeg"), "banner.jpg");
    assert.equal(outputFileName("a.b.c.png", "webp"), "a.b.c.webp");
  });

  it("adds a suffix and handles missing names or extensions", () => {
    assert.equal(outputFileName("scan", "png", "-resized"), "scan-resized.png");
    assert.equal(outputFileName("photo.jpg", "jpeg", "-compressed"), "photo-compressed.jpg");
    assert.equal(outputFileName(".png", "jpeg"), "image.jpg");
    assert.equal(outputFileName("", "jpeg"), "image.jpg");
  });
});

describe("parseDimension", () => {
  it("accepts positive whole numbers", () => {
    assert.equal(parseDimension("800"), 800);
    assert.equal(parseDimension(" 12 "), 12);
  });

  it("rejects everything else", () => {
    for (const bad of ["", "0", "-5", "1.5", "12px", "abc", "1e3"]) assert.equal(parseDimension(bad), null, bad);
  });
});

describe("resizing math", () => {
  const photo = { width: 4032, height: 3024 };

  it("scales to a maximum width without enlarging", () => {
    assert.deepEqual(scaleToMaxWidth(photo, 1600), { width: 1600, height: 1200 });
    assert.deepEqual(scaleToMaxWidth({ width: 1200, height: 800 }, 1600), { width: 1200, height: 800 });
    assert.deepEqual(scaleToMaxWidth(photo, null), photo);
  });

  it("never returns a zero side", () => {
    assert.deepEqual(scaleToMaxWidth({ width: 5000, height: 10 }, 100), { width: 100, height: 1 });
  });

  it("keeps the aspect ratio from width or height", () => {
    assert.deepEqual(resizeKeepingAspect({ width: 4000, height: 3000 }, "width", 1000), { width: 1000, height: 750 });
    assert.deepEqual(resizeKeepingAspect({ width: 4000, height: 3000 }, "height", 600), { width: 800, height: 600 });
  });

  it("scales by percentage", () => {
    assert.deepEqual(scaleByPercent({ width: 1920, height: 1080 }, 50), { width: 960, height: 540 });
    assert.deepEqual(scaleByPercent({ width: 101, height: 51 }, 50), { width: 51, height: 26 });
    assert.deepEqual(scaleByPercent({ width: 100, height: 100 }, 200), { width: 200, height: 200 });
  });

  it("picks an exact size over a maximum width", () => {
    assert.deepEqual(targetSize(photo, { maxWidth: 1600, exact: null }), { width: 1600, height: 1200 });
    assert.deepEqual(targetSize(photo, { maxWidth: 1600, exact: { width: 10, height: 20 } }), { width: 10, height: 20 });
    assert.deepEqual(targetSize(photo, { maxWidth: null, exact: null }), photo);
  });
});

describe("downscaleSteps", () => {
  it("halves repeatedly for large reductions and ends on the target", () => {
    assert.deepEqual(downscaleSteps({ width: 4000, height: 3000 }, { width: 400, height: 300 }), [
      { width: 2000, height: 1500 },
      { width: 1000, height: 750 },
      { width: 500, height: 375 },
      { width: 400, height: 300 },
    ]);
  });

  it("draws once for small reductions, enlargements and no change", () => {
    assert.deepEqual(downscaleSteps({ width: 1000, height: 800 }, { width: 600, height: 480 }), [{ width: 600, height: 480 }]);
    assert.deepEqual(downscaleSteps({ width: 100, height: 100 }, { width: 300, height: 300 }), [{ width: 300, height: 300 }]);
    assert.deepEqual(downscaleSteps({ width: 100, height: 100 }, { width: 100, height: 100 }), [{ width: 100, height: 100 }]);
  });

  it("never goes below the target on either axis", () => {
    const steps = downscaleSteps({ width: 8000, height: 100 }, { width: 100, height: 90 });
    for (const step of steps) assert.ok(step.width >= 100 && step.height >= 90);
    assert.deepEqual(steps.at(-1), { width: 100, height: 90 });
  });
});

describe("limits", () => {
  it("exposes the batch size", () => {
    assert.equal(MAX_BATCH, 10);
  });
});
