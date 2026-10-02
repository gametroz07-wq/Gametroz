"use client";

import { Link2, Link2Off } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import {
  MAX_FILE_BYTES,
  formatSize,
  outputFileName,
  parseDimension,
  resizeKeepingAspect,
  scaleByPercent,
  validateDimensions,
  validateImageFile,
  type ImageFormat,
  type Size,
} from "@/lib/tools/image";
import { ImageToolError, readImageSize } from "@/lib/tools/image-browser";
import { BeforeAfter, DownloadLink } from "../ui/image-controls";
import { ImageDropzone } from "../ui/image-dropzone";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolInput } from "../ui/tool-field";
import { ToggleOption, ToolSegmented } from "../ui/tool-options";
import { useConversion } from "../ui/use-conversion";

const ACCEPTED: ImageFormat[] = ["jpeg", "png", "webp"];
/** Fixed encoder quality for JPEG and WebP output; the resizer keeps the file as close as it can. */
const OUTPUT_QUALITY = 92;
type Mode = "pixels" | "percent";

export function ImageResizerWorkspace() {
  const widthId = useId();
  const heightId = useId();
  const percentId = useId();
  const [loaded, setLoaded] = useState<{ file: File; format: ImageFormat; size: Size } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("pixels");
  const [lock, setLock] = useState(true);
  const [widthText, setWidthText] = useState("");
  const [heightText, setHeightText] = useState("");
  const [percentText, setPercentText] = useState("50");
  const request = useRef(0);

  const original = loaded?.size ?? null;
  let exact: Size | null = null;
  let inputError: string | undefined;
  if (original) {
    if (mode === "percent") {
      const percent = parseDimension(percentText);
      if (percent === null) inputError = "Enter a whole percentage of 1 or more.";
      else exact = scaleByPercent(original, percent);
    } else {
      const width = parseDimension(widthText);
      const height = parseDimension(heightText);
      if (width === null || height === null) inputError = "Enter a width and a height in whole pixels.";
      else exact = { width, height };
    }
    if (exact) {
      inputError = validateDimensions(exact.width, exact.height) ?? undefined;
      if (inputError) exact = null;
    }
  }

  const options = useMemo(
    () => ({ format: loaded?.format ?? "png", quality: OUTPUT_QUALITY, background: "#ffffff", maxWidth: null, exact }),
    [loaded?.format, exact],
  );
  const { result, pending, error } = useConversion(exact ? (loaded?.file ?? null) : null, options);

  async function pick(files: File[]) {
    const [file] = files;
    if (!file) return;
    const check = validateImageFile(file, ACCEPTED);
    if (!check.ok) {
      setFileError(check.error);
      return;
    }
    const id = ++request.current;
    try {
      const size = await readImageSize(file);
      if (id !== request.current) return;
      setFileError(null);
      setLoaded({ file, format: check.format, size });
      setWidthText(String(size.width));
      setHeightText(String(size.height));
    } catch (problem) {
      if (id === request.current) setFileError(problem instanceof ImageToolError ? `${file.name}: ${problem.message}` : `${file.name}: could not be read.`);
    }
  }

  function changeWidth(text: string) {
    setWidthText(text);
    const value = parseDimension(text);
    if (lock && original && value !== null) setHeightText(String(resizeKeepingAspect(original, "width", value).height));
  }

  function changeHeight(text: string) {
    setHeightText(text);
    const value = parseDimension(text);
    if (lock && original && value !== null) setWidthText(String(resizeKeepingAspect(original, "height", value).width));
  }

  function reset() {
    request.current++;
    setLoaded(null);
    setFileError(null);
    setMode("pixels");
    setLock(true);
    setWidthText("");
    setHeightText("");
    setPercentText("50");
  }

  const dimensionInput = (id: string, label: string, value: string, onChange: (text: string) => void) => (
    <ToolField id={id} label={label}>
      <ToolInput id={id} inputMode="numeric" value={value} onChange={(event) => onChange(event.target.value)} disabled={!original} />
    </ToolField>
  );

  return (
    <div className="space-y-4">
      <ImageDropzone accept="image/jpeg,image/png,image/webp" hint={`JPEG, PNG or WebP, up to ${MAX_FILE_BYTES / (1024 * 1024)} MB.`} onFiles={pick} />
      {fileError && (
        <p role="alert" className="text-sm text-destructive">
          {fileError}
        </p>
      )}

      {loaded && original && (
        <>
          <p className="text-sm">
            <span className="font-medium">{loaded.file.name}</span> <span className="type-muted">({formatSize(original)})</span>
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <ToolSegmented
              label="Resize by"
              value={mode}
              onChange={setMode}
              options={[
                { value: "pixels", label: "Pixels" },
                { value: "percent", label: "Percent" },
              ]}
            />
            {mode === "pixels" && (
              <ToggleOption
                label={lock ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                checked={lock}
                onChange={setLock}
                hint="Keep the proportions when you change the width or height"
              />
            )}
          </div>

          {mode === "pixels" ? (
            <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              {dimensionInput(widthId, "Width (px)", widthText, changeWidth)}
              <span className="hidden pb-3 sm:block" aria-hidden="true">
                {lock ? <Link2 className="size-4" /> : <Link2Off className="size-4" />}
              </span>
              {dimensionInput(heightId, "Height (px)", heightText, changeHeight)}
            </div>
          ) : (
            <ToolField id={percentId} label="Percent of the original size" hint="100 keeps the size; 50 halves each side." className="max-w-xs">
              <ToolInput id={percentId} inputMode="numeric" value={percentText} onChange={(event) => setPercentText(event.target.value)} hasMessage />
            </ToolField>
          )}

          <div role="status" aria-live="polite" className="space-y-3">
            {inputError || error ? (
              <p role="alert" className="text-sm text-destructive">
                {inputError ?? error}
              </p>
            ) : result ? (
              <BeforeAfter
                originalBytes={loaded.file.size}
                originalSize={original}
                resultBytes={result.blob.size}
                resultSize={result.size}
                dimmed={pending}
              />
            ) : (
              <p className="type-muted text-sm">Resizing...</p>
            )}
          </div>

          <p className="type-muted text-xs">
            The output keeps the original format. JPEG and WebP are saved at quality {OUTPUT_QUALITY}. Metadata such as EXIF is not kept.
          </p>
        </>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {result && loaded && exact && (
          <DownloadLink
            href={result.url}
            filename={outputFileName(loaded.file.name, loaded.format, `-${result.size.width}x${result.size.height}`)}
            disabled={pending || Boolean(error)}
          />
        )}
        <ResetButton onReset={reset} disabled={!loaded && !fileError} />
      </div>
    </div>
  );
}
