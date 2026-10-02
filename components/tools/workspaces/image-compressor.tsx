"use client";

import { TriangleAlert } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MAX_FILE_BYTES, outputFileName, parseDimension, validateImageFile, type ImageFormat } from "@/lib/tools/image";
import { downloadBlob } from "@/lib/tools/image-browser";
import { BeforeAfter, DownloadLink, QualitySlider } from "../ui/image-controls";
import { ImageDropzone } from "../ui/image-dropzone";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolInput } from "../ui/tool-field";
import { ToolSegmented } from "../ui/tool-options";
import { useConversion } from "../ui/use-conversion";

const ACCEPTED: ImageFormat[] = ["jpeg", "png", "webp"];
const OUTPUTS = [
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
] as const;

export function ImageCompressorWorkspace() {
  const widthId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [format, setFormat] = useState<"jpeg" | "webp">("jpeg");
  const [quality, setQuality] = useState(80);
  const [widthText, setWidthText] = useState("");

  const maxWidth = parseDimension(widthText);
  const widthError = widthText.trim() !== "" && maxWidth === null ? "Enter a whole number of pixels, or leave it empty." : undefined;
  const options = useMemo(
    () => ({ format, quality, background: "#ffffff", maxWidth, exact: null }),
    [format, quality, maxWidth],
  );
  const { result, pending, error } = useConversion(file, options);

  function pick(files: File[]) {
    const [next] = files;
    if (!next) return;
    const check = validateImageFile(next, ACCEPTED);
    if (!check.ok) {
      setFileError(check.error);
      return;
    }
    setFileError(null);
    setFile(next);
  }

  function reset() {
    setFile(null);
    setFileError(null);
    setWidthText("");
    setQuality(80);
    setFormat("jpeg");
  }

  const larger = result && file ? result.blob.size >= file.size : false;

  return (
    <div className="space-y-4">
      <ImageDropzone accept="image/jpeg,image/png,image/webp" hint={`JPEG, PNG or WebP, up to ${MAX_FILE_BYTES / (1024 * 1024)} MB.`} onFiles={pick} />
      {fileError && (
        <p role="alert" className="text-sm text-destructive">
          {fileError}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <p className="type-small font-medium">Output format</p>
          <ToolSegmented label="Output format" value={format} onChange={setFormat} options={[...OUTPUTS]} />
        </div>
        <QualitySlider value={quality} onChange={setQuality} />
        <ToolField id={widthId} label="Maximum width (px)" hint="Optional. Only shrinks larger images." error={widthError}>
          <ToolInput
            id={widthId}
            inputMode="numeric"
            value={widthText}
            invalid={Boolean(widthError)}
            hasMessage
            onChange={(event) => setWidthText(event.target.value)}
            placeholder="e.g. 1600"
          />
        </ToolField>
      </div>

      {file && (
        <div className="space-y-3" role="status" aria-live="polite">
          <p className="min-w-0 truncate text-sm font-medium">{file.name}</p>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : result ? (
            <>
              <BeforeAfter
                originalBytes={file.size}
                originalSize={result.original}
                resultBytes={result.blob.size}
                resultSize={result.size}
                dimmed={pending}
              />
              {larger && (
                <p className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm">
                  <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
                  The result is not smaller than the original. Lower the quality or set a maximum width, or keep the original.
                  <Button type="button" variant="outline" size="sm" onClick={() => downloadBlob(file, file.name)}>
                    Download original
                  </Button>
                </p>
              )}
              {/* A blob: preview of the user's own file; next/image cannot optimize it. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="Preview of the compressed image" className="max-h-72 max-w-full rounded-xl border border-input object-contain" />
            </>
          ) : (
            <p className="type-muted text-sm">Compressing...</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {result && file && <DownloadLink href={result.url} filename={outputFileName(file.name, format, "-compressed")} disabled={pending || Boolean(error)} />}
        <ResetButton onReset={reset} disabled={!file && !fileError} />
      </div>
    </div>
  );
}
