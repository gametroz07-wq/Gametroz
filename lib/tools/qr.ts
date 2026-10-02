// Pure helpers for the QR code tool. The QR image itself is rendered in the browser by the
// `qrcode` package (see components/tools/workspaces/qr-code-generator.tsx).

export type QrLevel = "L" | "M" | "Q" | "H";
export type QrCheck = { ok: true } | { ok: false; error: string };

export const MIN_QR_SIZE = 128;
export const MAX_QR_SIZE = 1024;

/** Maximum bytes of a version 40 symbol in byte mode, per error correction level. */
const CAPACITY: Record<QrLevel, number> = { L: 2953, M: 2331, Q: 1663, H: 1273 };

export const qrCapacityBytes = (level: QrLevel) => CAPACITY[level];

export function validateQrInput(text: string, level: QrLevel): QrCheck {
  if (text.trim() === "") return { ok: false, error: "Enter some text or a URL to encode." };
  const bytes = new TextEncoder().encode(text).length;
  const limit = CAPACITY[level];
  if (bytes > limit) {
    return {
      ok: false,
      error: `Too much data: ${bytes.toLocaleString("en-US")} bytes, but level ${level} holds at most ${limit.toLocaleString("en-US")}. Shorten the text or choose a lower error correction level.`,
    };
  }
  return { ok: true };
}

export function validateQrSize(size: number): QrCheck {
  if (!Number.isInteger(size) || size < MIN_QR_SIZE || size > MAX_QR_SIZE) {
    return { ok: false, error: `Size must be a whole number of pixels between ${MIN_QR_SIZE} and ${MAX_QR_SIZE}.` };
  }
  return { ok: true };
}

/** Parses #rgb or #rrggbb (the # is optional). */
export function parseHexColor(text: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text.trim());
  if (!match) return null;
  let hex = match[1];
  if (hex.length === 3) hex = [...hex].map((char) => char + char).join("");
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

function luminance([r, g, b]: [number, number, number]) {
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/** WCAG contrast ratio from 1 to 21, or null when a color is not valid hex. */
export function contrastRatio(first: string, second: string): number | null {
  const a = parseHexColor(first);
  const b = parseHexColor(second);
  if (!a || !b) return null;
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** A readable message when the colors may not scan, otherwise null. */
export function contrastWarning(foreground: string, background: string): string | null {
  const ratio = contrastRatio(foreground, background);
  if (ratio === null) return null;
  if (ratio < 3) {
    return `Low contrast (${ratio.toFixed(1)}:1). Many scanners need at least 3:1, so this code may not scan. Use a darker code on a lighter background.`;
  }
  const fg = parseHexColor(foreground);
  const bg = parseHexColor(background);
  if (fg && bg && luminance(fg) > luminance(bg)) {
    return "The code is lighter than its background (inverted). Some scanners cannot read inverted codes, so test it before printing.";
  }
  return null;
}
