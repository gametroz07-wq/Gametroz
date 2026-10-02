import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseImageSize, probeRemoteImage } from "../image-size";

function png(width: number, height: number) {
  const bytes = new Uint8Array(33);
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52]);
  new DataView(bytes.buffer).setUint32(16, width);
  new DataView(bytes.buffer).setUint32(20, height);
  return bytes;
}

function jpeg(width: number, height: number) {
  // SOI, APP0 (length 16), SOF0 with dimensions.
  const app0 = [0xff, 0xe0, 0x00, 0x10, ...new Array(14).fill(0)];
  const sof0 = [0xff, 0xc0, 0x00, 0x11, 0x08, height >> 8, height & 0xff, width >> 8, width & 0xff, 0x03];
  return new Uint8Array([0xff, 0xd8, ...app0, ...sof0, ...new Array(10).fill(0)]);
}

describe("parseImageSize", () => {
  it("reads PNG dimensions", () => {
    assert.deepEqual(parseImageSize(png(512, 384)), { format: "png", width: 512, height: 384 });
  });

  it("reads JPEG dimensions from the SOF marker", () => {
    assert.deepEqual(parseImageSize(jpeg(512, 384)), { format: "jpeg", width: 512, height: 384 });
  });

  it("returns null for anything that is not an image", () => {
    assert.equal(parseImageSize(new TextEncoder().encode("<html>not found</html>")), null);
  });
});

describe("probeRemoteImage", () => {
  const respond = (status: number, type: string, body: Uint8Array) => async () =>
    new Response(body as unknown as BodyInit, { status, headers: { "content-type": type } });

  it("accepts a reachable HTTPS image and reports its size", async () => {
    const result = await probeRemoteImage("https://img.example.com/a.jpg", { fetchImpl: respond(200, "image/jpeg", jpeg(512, 384)) });
    assert.deepEqual(result, { ok: true, status: 200, width: 512, height: 384 });
  });

  it("rejects non-200 responses, non-images and plain HTTP", async () => {
    assert.equal((await probeRemoteImage("https://img.example.com/a.jpg", { fetchImpl: respond(404, "text/html", new Uint8Array()) })).ok, false);
    assert.equal((await probeRemoteImage("https://img.example.com/a.jpg", { fetchImpl: respond(200, "text/html", new TextEncoder().encode("<html>")) })).ok, false);
    assert.equal((await probeRemoteImage("http://img.example.com/a.jpg", { fetchImpl: respond(200, "image/jpeg", jpeg(10, 10)) })).ok, false);
  });

  it("reports network failures without throwing", async () => {
    const result = await probeRemoteImage("https://img.example.com/a.jpg", {
      fetchImpl: async () => {
        throw new Error("boom");
      },
    });
    assert.equal(result.ok, false);
  });
});
