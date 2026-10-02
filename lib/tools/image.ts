// Pure maths and validation shared by the image tools. Decoding and encoding happen in the browser
// (see image-browser.ts); nothing here touches the DOM.

export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_PIXELS = 50_000_000;
/** Longest side a canvas can reliably hold across current browsers. */
export const MAX_SIDE = 16_384;
export const MAX_BATCH = 10;

export type ImageFormat = "jpeg" | "png" | "webp";
export type Size = { width: number; height: number };

export const imageMime: Record<ImageFormat, string> = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
export const imageExtension: Record<ImageFormat, string> = { jpeg: "jpg", png: "png", webp: "webp" };
export const imageLabel: Record<ImageFormat, string> = { jpeg: "JPEG", png: "PNG", webp: "WebP" };

const extensionToFormat: Record<string, ImageFormat> = { jpg: "jpeg", jpeg: "jpeg", png: "png", webp: "webp" };

/** Format from the MIME type, or from the file extension when the browser gives no type. */
export function detectFormat(name: string, type: string): ImageFormat | null {
  for (const format of Object.keys(imageMime) as ImageFormat[]) if (imageMime[format] === type) return format;
  if (type) return null;
  const dot = name.lastIndexOf(".");
  return dot === -1 ? null : (extensionToFormat[name.slice(dot + 1).toLowerCase()] ?? null);
}

function listLabels(formats: readonly ImageFormat[]) {
  const labels = formats.map((format) => imageLabel[format]);
  return labels.length > 1 ? `${labels.slice(0, -1).join(", ")} or ${labels.at(-1)}` : (labels[0] ?? "");
}

export function validateImageFile(
  file: { name: string; type: string; size: number },
  accepted: readonly ImageFormat[],
): { ok: true; format: ImageFormat } | { ok: false; error: string } {
  const format = detectFormat(file.name, file.type);
  if (!format || !accepted.includes(format)) return { ok: false, error: `${file.name}: this tool accepts ${listLabels(accepted)} images only.` };
  if (file.size === 0) return { ok: false, error: `${file.name}: the file is empty.` };
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, error: `${file.name}: the file is ${formatBytes(file.size)}; the limit is ${MAX_FILE_BYTES / (1024 * 1024)} MB.` };
  }
  return { ok: true, format };
}

/** Error message for an image size that cannot be processed, or null when it is fine. */
export function validateDimensions(width: number, height: number): string | null {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) return "Width and height must be whole numbers of at least 1 pixel.";
  if (width > MAX_SIDE || height > MAX_SIDE) return `Images can be at most ${MAX_SIDE.toLocaleString("en-US")} pixels on a side.`;
  if (width * height > MAX_PIXELS) return `That is ${((width * height) / 1_000_000).toFixed(1)} megapixels; the limit is ${MAX_PIXELS / 1_000_000} megapixels.`;
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatSize(size: Size): string {
  return `${size.width} × ${size.height} px`;
}

/** Share of the original removed, to one decimal. Negative when the output is larger. */
export function percentSaved(original: number, output: number): number {
  if (original <= 0) return 0;
  return Math.round((1 - output / original) * 1000) / 10;
}

/** 1-100 slider value to the 0-1 quality the encoder expects. */
export function qualityToUnit(quality: number): number {
  if (Number.isNaN(quality)) return 0.8;
  return Math.min(100, Math.max(1, Math.round(quality))) / 100;
}

export function outputFileName(original: string, format: ImageFormat, suffix = ""): string {
  const dot = original.lastIndexOf(".");
  const base = (dot === -1 ? original : original.slice(0, dot)).trim();
  return `${base || "image"}${base ? suffix : ""}.${imageExtension[format]}`;
}

/** A positive whole number typed by the user, or null. */
export function parseDimension(text: string): number | null {
  const trimmed = text.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  return value >= 1 ? value : null;
}

const atLeastOne = (value: number) => Math.max(1, Math.round(value));

/** Shrinks to a maximum width, keeping the aspect ratio. Never enlarges. */
export function scaleToMaxWidth(size: Size, maxWidth: number | null): Size {
  if (maxWidth === null || maxWidth >= size.width) return size;
  return { width: maxWidth, height: atLeastOne((size.height * maxWidth) / size.width) };
}

export function resizeKeepingAspect(size: Size, edge: "width" | "height", value: number): Size {
  return edge === "width"
    ? { width: value, height: atLeastOne((size.height * value) / size.width) }
    : { width: atLeastOne((size.width * value) / size.height), height: value };
}

export function scaleByPercent(size: Size, percent: number): Size {
  return { width: atLeastOne((size.width * percent) / 100), height: atLeastOne((size.height * percent) / 100) };
}

/** The output size: an exact size when given, otherwise the original limited to a maximum width. */
export function targetSize(original: Size, options: { maxWidth: number | null; exact: Size | null }): Size {
  return options.exact ?? scaleToMaxWidth(original, options.maxWidth);
}

/**
 * Sizes to draw through, in order, to downscale well. Drawing straight from a much larger image
 * skips pixels and looks jagged, so large reductions halve repeatedly and finish on the target.
 */
export function downscaleSteps(from: Size, to: Size): Size[] {
  const steps: Size[] = [];
  let { width, height } = from;
  while (width > to.width * 2 || height > to.height * 2) {
    width = Math.max(to.width, Math.ceil(width / 2));
    height = Math.max(to.height, Math.ceil(height / 2));
    if (width === to.width && height === to.height) break;
    steps.push({ width, height });
  }
  steps.push(to);
  return steps;
}
