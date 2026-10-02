import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getToolDefinition, toolDefinitions } from "../definitions";
import {
  downscaleSteps,
  formatSize,
  outputFileName,
  percentSaved,
  qualityToUnit,
  scaleByPercent,
  scaleToMaxWidth,
  resizeKeepingAspect,
} from "../image";
import { guides } from "../../../prisma/seed-data/guides";

// The worked examples shown on the image tool pages must be what the maths really produces.

function example(slug: string, index: number) {
  const item = getToolDefinition(slug)?.examples[index];
  assert.ok(item, `${slug} example ${index}`);
  return item;
}

describe("image tool examples match the logic", () => {
  it("image-compressor", () => {
    assert.equal(example("image-compressor", 0).output, formatSize(scaleToMaxWidth({ width: 4032, height: 3024 }, 1600)));
    assert.equal(example("image-compressor", 1).output, `${formatSize(scaleToMaxWidth({ width: 1200, height: 800 }, 1600))}, not enlarged`);
    assert.equal(example("image-compressor", 2).output, `${percentSaved(2_000_000, 500_000)}% saved`);
  });

  it("image-resizer", () => {
    assert.equal(example("image-resizer", 0).output, formatSize(resizeKeepingAspect({ width: 4000, height: 3000 }, "width", 1000)));
    assert.equal(example("image-resizer", 1).output, formatSize(scaleByPercent({ width: 1920, height: 1080 }, 50)));
    assert.equal(
      example("image-resizer", 2).output,
      downscaleSteps({ width: 4000, height: 3000 }, { width: 400, height: 300 })
        .map((step) => `${step.width}×${step.height}`)
        .join(" → "),
    );
  });

  it("png-to-jpg", () => {
    assert.equal(example("png-to-jpg", 0).output, outputFileName("holiday-photo.png", "jpeg"));
    assert.equal(example("png-to-jpg", 2).output, `Encoder quality ${qualityToUnit(90)}`);
  });

  it("webp-to-jpg", () => {
    assert.equal(example("webp-to-jpg", 0).output, outputFileName("banner.webp", "jpeg"));
    assert.equal(example("webp-to-jpg", 2).output, `Encoder quality ${qualityToUnit(85)}`);
  });
});

describe("image tool definitions", () => {
  it("defines the four image tools", () => {
    assert.deepEqual(
      toolDefinitions.filter((tool) => tool.categorySlug === "images").map((tool) => tool.slug),
      ["image-compressor", "image-resizer", "png-to-jpg", "webp-to-jpg"],
    );
  });

  it("explains transparency and metadata where it matters", () => {
    for (const slug of ["png-to-jpg", "webp-to-jpg"]) {
      const copy = JSON.stringify(getToolDefinition(slug)).toLowerCase();
      assert.ok(copy.includes("transparen") && copy.includes("background"), slug);
    }
    assert.match(JSON.stringify(getToolDefinition("image-compressor")).toLowerCase(), /exif/);
  });

  it("resolves every tool referenced by a guide", () => {
    const defined = new Set(toolDefinitions.map((tool) => tool.slug));
    const missing = guides.flatMap((guide) => guide.tools).filter((slug) => !defined.has(slug));
    assert.deepEqual(missing, []);
  });
});
