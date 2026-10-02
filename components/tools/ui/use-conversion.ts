"use client";

import { useEffect, useState } from "react";
import { type ConvertOptions, type ConvertResult, ImageToolError, convertImage } from "@/lib/tools/image-browser";

type Settled =
  | { file: File; key: string; result: ConvertResult & { url: string } }
  | { file: File; key: string; error: string };

/**
 * Converts a file whenever it or the options change (debounced, so a slider can be dragged).
 * Owns the preview object URL: it is revoked when replaced, when the file is cleared and on unmount.
 * `result` keeps the latest finished conversion of this file while a newer one is `pending`.
 */
export function useConversion(file: File | null, options: ConvertOptions) {
  const key = JSON.stringify(options);
  const [state, setState] = useState<Settled | null>(null);

  if (!file && state) setState(null);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const result = await convertImage(file, JSON.parse(key) as ConvertOptions);
        if (!cancelled) setState({ file, key, result: { ...result, url: URL.createObjectURL(result.blob) } });
      } catch (error) {
        if (!cancelled) {
          setState({ file, key, error: error instanceof ImageToolError ? error.message : "The image could not be processed. Try a smaller file." });
        }
      }
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [file, key]);

  useEffect(() => {
    const url = state && "result" in state ? state.result.url : null;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [state]);

  const forFile = state && state.file === file ? state : null;
  const current = forFile && forFile.key === key ? forFile : null;
  return {
    pending: Boolean(file) && !current,
    result: forFile && "result" in forFile ? forFile.result : null,
    error: current && "error" in current ? current.error : null,
  };
}
