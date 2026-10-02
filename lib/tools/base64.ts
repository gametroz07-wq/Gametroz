// Base64 for text. btoa/atob only understand Latin-1, so text is converted to UTF-8 bytes first
// (and back with a strict decoder) to make emoji and accents round-trip correctly.

export type CodecResult = { ok: true; output: string } | { ok: false; error: string };

export type Base64Options = {
  /** Use - and _ instead of + and /. */
  urlSafe?: boolean;
  /** Keep the trailing = characters (default true). */
  padding?: boolean;
};

export function encodeBase64(text: string, { urlSafe = false, padding = true }: Base64Options = {}): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  let encoded = btoa(binary);
  if (urlSafe) encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_");
  return padding ? encoded : encoded.replace(/=+$/, "");
}

/** Decodes standard or URL-safe Base64 (padding optional, whitespace ignored) into UTF-8 text. */
export function decodeBase64(input: string): CodecResult {
  const compact = input.replace(/\s+/g, "");
  if (compact === "") return { ok: true, output: "" };

  for (let index = 0; index < compact.length; index += 1) {
    if (!/[A-Za-z0-9+/\-_=]/.test(compact[index])) {
      return {
        ok: false,
        error: `Invalid character "${compact[index]}" at position ${index + 1}. Base64 uses A-Z, a-z, 0-9, + / (or - _) and = padding.`,
      };
    }
  }

  const body = compact.replace(/=+$/, "");
  if (body.includes("=")) return { ok: false, error: "Padding (=) can only appear at the end." };
  if (compact.length - body.length > 2) return { ok: false, error: "Too much padding: Base64 ends with at most two = characters." };
  if (/[+/]/.test(body) && /[-_]/.test(body)) {
    return { ok: false, error: "The input mixes standard (+ /) and URL-safe (- _) characters. Use one alphabet." };
  }
  if (body.length % 4 === 1) {
    return { ok: false, error: "The length is not valid Base64: a leftover single character cannot be decoded." };
  }

  const standard = body.replace(/-/g, "+").replace(/_/g, "/");
  const padded = standard + "=".repeat((4 - (standard.length % 4)) % 4);
  let binary: string;
  try {
    binary = atob(padded);
  } catch {
    return { ok: false, error: "This is not valid Base64." };
  }
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  try {
    return { ok: true, output: new TextDecoder("utf-8", { fatal: true }).decode(bytes) };
  } catch {
    return { ok: false, error: "Decoded bytes are not valid UTF-8 text. The input may be binary data such as an image." };
  }
}
