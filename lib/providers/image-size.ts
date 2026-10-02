// Remote thumbnail checks without storing images: read only the first bytes and parse the header.

export type ImageSize = { format: "png" | "jpeg" | "gif" | "webp"; width: number; height: number };

export function parseImageSize(bytes: Uint8Array): ImageSize | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const ascii = (start: number, length: number) => String.fromCharCode(...bytes.subarray(start, start + length));

  // PNG: signature + IHDR width/height (big endian).
  if (bytes.length >= 24 && bytes[0] === 0x89 && ascii(1, 3) === "PNG" && ascii(12, 4) === "IHDR") {
    return { format: "png", width: view.getUint32(16), height: view.getUint32(20) };
  }
  // GIF: logical screen size (little endian).
  if (bytes.length >= 10 && ascii(0, 3) === "GIF") {
    return { format: "gif", width: view.getUint16(6, true), height: view.getUint16(8, true) };
  }
  // WebP: RIFF....WEBP + VP8 / VP8L / VP8X chunk.
  if (bytes.length >= 30 && ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") {
    const chunk = ascii(12, 4);
    if (chunk === "VP8 ") return { format: "webp", width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
    if (chunk === "VP8L") {
      const bits = view.getUint32(21, true);
      return { format: "webp", width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8X") {
      const width = 1 + (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16));
      const height = 1 + (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16));
      return { format: "webp", width, height };
    }
  }
  // JPEG: walk markers until a start-of-frame (SOF0..SOF15 except DHT/JPG/DAC).
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) return null;
      const marker = bytes[offset + 1];
      const length = view.getUint16(offset + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { format: "jpeg", height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
      }
      offset += 2 + length;
    }
  }
  return null;
}

export type ImageProbe =
  | { ok: true; status: number; width: number; height: number }
  | { ok: false; status?: number; reason: string };

type ProbeOptions = { fetchImpl?: typeof fetch; timeoutMs?: number };

const MAX_BYTES = 64 * 1024;

/** HTTPS GET of the first 64 KB; checks status, content type and decodable dimensions. */
export async function probeRemoteImage(url: string, { fetchImpl = fetch, timeoutMs = 8000 }: ProbeOptions = {}): Promise<ImageProbe> {
  if (!url.startsWith("https://")) return { ok: false, reason: "not https" };
  try {
    const response = await fetchImpl(url, {
      headers: { range: `bytes=0-${MAX_BYTES - 1}` },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (response.status !== 200 && response.status !== 206) return { ok: false, status: response.status, reason: `HTTP ${response.status}` };
    if (!(response.headers.get("content-type") ?? "").startsWith("image/")) {
      return { ok: false, status: response.status, reason: "not an image" };
    }
    const bytes = new Uint8Array(await response.arrayBuffer()).subarray(0, MAX_BYTES);
    const size = parseImageSize(bytes);
    if (!size) return { ok: false, status: response.status, reason: "unreadable image header" };
    return { ok: true, status: 200, width: size.width, height: size.height };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "network error" };
  }
}
