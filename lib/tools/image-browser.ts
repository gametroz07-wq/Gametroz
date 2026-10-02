// Browser-only image helpers (canvas, createImageBitmap, Image). Pure maths lives in image.ts.
// Everything here runs on the user's device: no network access, nothing is stored.

import {
  type ImageFormat,
  type Size,
  downscaleSteps,
  imageLabel,
  imageMime,
  qualityToUnit,
  targetSize,
  validateDimensions,
} from "./image";

/** An error whose message is safe and useful to show to the user. */
export class ImageToolError extends Error {}

export type ConvertOptions = {
  format: ImageFormat;
  /** 1-100. Ignored for PNG. */
  quality: number;
  /** Fill color under transparent areas. Only used for JPEG, which has no transparency. */
  background: string;
  maxWidth: number | null;
  exact: Size | null;
};

export type ConvertResult = { blob: Blob; size: Size; original: Size };

type Decoded = { source: CanvasImageSource; size: Size; close: () => void };

const UNREADABLE = "This image could not be read. It may be damaged, or in a format this browser cannot open.";

export async function decodeImage(file: Blob): Promise<Decoded> {
  let decoded: Decoded | null = null;
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      decoded = { source: bitmap, size: { width: bitmap.width, height: bitmap.height }, close: () => bitmap.close() };
    } catch {
      // Fall through to the <img> decoder.
    }
  }
  if (!decoded) {
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      decoded = { source: image, size: { width: image.naturalWidth, height: image.naturalHeight }, close: () => URL.revokeObjectURL(url) };
    } catch {
      URL.revokeObjectURL(url);
      throw new ImageToolError(UNREADABLE);
    }
  }
  const problem = validateDimensions(decoded.size.width, decoded.size.height);
  if (problem) {
    decoded.close();
    throw new ImageToolError(problem);
  }
  return decoded;
}

/** Dimensions of an image file, or an ImageToolError. */
export async function readImageSize(file: Blob): Promise<Size> {
  const decoded = await decodeImage(file);
  decoded.close();
  return decoded.size;
}

function createCanvas({ width, height }: Size) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new ImageToolError("This browser could not create a drawing surface for the image.");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  return { canvas, context };
}

function encode(canvas: HTMLCanvasElement, format: ImageFormat, quality: number) {
  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, imageMime[format], format === "png" ? undefined : qualityToUnit(quality)),
  );
}

/** Decodes, resizes (in halving steps for big reductions) and re-encodes an image. */
export async function convertImage(file: Blob, options: ConvertOptions): Promise<ConvertResult> {
  const decoded = await decodeImage(file);
  const canvases: HTMLCanvasElement[] = [];
  try {
    const target = targetSize(decoded.size, options);
    const problem = validateDimensions(target.width, target.height);
    if (problem) throw new ImageToolError(problem);

    let source = decoded.source;
    let sourceSize = decoded.size;
    const steps = downscaleSteps(decoded.size, target);
    for (const [index, step] of steps.entries()) {
      const { canvas, context } = createCanvas(step);
      canvases.push(canvas);
      if (options.format === "jpeg" && index === steps.length - 1) {
        context.fillStyle = options.background;
        context.fillRect(0, 0, step.width, step.height);
      }
      context.drawImage(source, 0, 0, sourceSize.width, sourceSize.height, 0, 0, step.width, step.height);
      source = canvas;
      sourceSize = step;
    }

    const blob = await encode(canvases[canvases.length - 1], options.format, options.quality);
    if (!blob) throw new ImageToolError("The image could not be encoded. Try a smaller image.");
    if (blob.type !== imageMime[options.format]) throw new ImageToolError(`This browser cannot save ${imageLabel[options.format]} images.`);
    return { blob, size: target, original: decoded.size };
  } finally {
    decoded.close();
    // Release canvas memory right away; large canvases are slow to be garbage collected on mobile.
    for (const canvas of canvases) {
      canvas.width = 0;
      canvas.height = 0;
    }
  }
}

const TINY_WEBP = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";

/** Whether this browser can decode WebP images (a 1x1 test image; no network involved). */
export function canDecodeWebp(): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image.width > 0 && image.height > 0);
    image.onerror = () => resolve(false);
    image.src = TINY_WEBP;
  });
}

/** Saves a blob through a temporary link, then releases the object URL. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
