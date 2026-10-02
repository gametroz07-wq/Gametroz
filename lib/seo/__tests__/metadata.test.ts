import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultOgImage, pageMetadata } from "../metadata";

describe("pageMetadata", () => {
  it("falls back to the branded default Open Graph image", () => {
    const meta = pageMetadata({ title: "Tools", description: "d", path: "/tools" });
    assert.deepEqual(meta.openGraph?.images, [defaultOgImage]);
    assert.deepEqual(meta.twitter?.images, [defaultOgImage.url]);
    assert.equal(defaultOgImage.width, 1200);
    assert.equal(defaultOgImage.height, 630);
  });

  it("keeps the page's own image", () => {
    const image = { url: "https://img.example.com/a.jpg", alt: "A" };
    const meta = pageMetadata({ title: "Game", description: "d", path: "/game/a", image });
    assert.deepEqual(meta.openGraph?.images, [image]);
    assert.deepEqual(meta.twitter?.images, [image.url]);
  });

  it("never appends the site name twice", () => {
    const meta = pageMetadata({ title: "Gametroz Editorial Policy", description: "d", path: "/editorial-policy" });
    assert.deepEqual(meta.title, { absolute: "Gametroz Editorial Policy" });
  });

  it("still blocks indexing while indexing is off", () => {
    const meta = pageMetadata({ title: "Tools", description: "d", path: "/tools" });
    assert.deepEqual(meta.robots, { index: false, follow: false });
  });
});
