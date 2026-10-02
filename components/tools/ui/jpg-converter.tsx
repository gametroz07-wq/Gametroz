"use client";

import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MAX_BATCH, MAX_FILE_BYTES, formatBytes, formatSize, outputFileName, validateImageFile, type ImageFormat } from "@/lib/tools/image";
import { canDecodeWebp } from "@/lib/tools/image-browser";
import { BackgroundColorField, DownloadLink, QualitySlider } from "./image-controls";
import { ImageDropzone } from "./image-dropzone";
import { ResetButton } from "./reset-button";
import { useConversion } from "./use-conversion";

type Source = Extract<ImageFormat, "png" | "webp">;
type Item = { id: number; file: File };

const COPY: Record<Source, { accept: string; label: string; quality: number }> = {
  png: { accept: "image/png", label: "PNG", quality: 90 },
  webp: { accept: "image/webp", label: "WebP", quality: 85 },
};

function ConvertedRow({ file, background, quality, onRemove }: { file: File; background: string; quality: number; onRemove: () => void }) {
  const options = useMemo(() => ({ format: "jpeg" as const, quality, background, maxWidth: null, exact: null }), [quality, background]);
  const { result, pending, error } = useConversion(file, options);
  const name = outputFileName(file.name, "jpeg");

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-input bg-surface-2/40 p-3">
      <div className="min-w-0 flex-1 basis-56">
        <p className="truncate text-sm font-medium">{file.name}</p>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : result ? (
          <p className={pending ? "type-muted text-xs opacity-60" : "type-muted text-xs"}>
            {formatBytes(file.size)} to {formatBytes(result.blob.size)} as {name} ({formatSize(result.size)})
          </p>
        ) : (
          <p className="type-muted text-xs">Converting...</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {result && !error && <DownloadLink href={result.url} filename={name} disabled={pending} />}
        <Button type="button" variant="ghost" size="sm" onClick={onRemove} aria-label={`Remove ${file.name}`}>
          <X aria-hidden="true" />
          Remove
        </Button>
      </div>
    </li>
  );
}

/** Shared by the PNG to JPG and WebP to JPG tools: batch of up to 10 files, each downloaded on its own. */
export function JpgConverter({ source }: { source: Source }) {
  const copy = COPY[source];
  const [items, setItems] = useState<Item[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [background, setBackground] = useState("#ffffff");
  const [quality, setQuality] = useState(copy.quality);
  const [webpSupported, setWebpSupported] = useState<boolean | null>(null);
  const nextId = useRef(0);

  useEffect(() => {
    if (source !== "webp") return;
    let cancelled = false;
    canDecodeWebp().then((supported) => {
      if (!cancelled) setWebpSupported(supported);
    });
    return () => {
      cancelled = true;
    };
  }, [source]);

  function add(files: File[]) {
    const messages: string[] = [];
    const accepted: Item[] = [];
    for (const file of files) {
      const check = validateImageFile(file, [source]);
      if (!check.ok) messages.push(check.error);
      else if (items.length + accepted.length >= MAX_BATCH) {
        messages.push(`${file.name}: skipped, a batch holds at most ${MAX_BATCH} files.`);
      } else accepted.push({ id: nextId.current++, file });
    }
    setProblems(messages);
    if (accepted.length) setItems((current) => [...current, ...accepted]);
  }

  function reset() {
    setItems([]);
    setProblems([]);
    setBackground("#ffffff");
    setQuality(copy.quality);
  }

  const unsupported = source === "webp" && webpSupported === false;

  return (
    <div className="space-y-4">
      {unsupported && (
        <p role="alert" className="rounded-xl border border-destructive/50 bg-destructive/10 p-3 text-sm">
          This browser cannot read WebP images, so it cannot convert them. Update it, or open this page in a current version of Chrome, Edge, Firefox or Safari.
        </p>
      )}
      <ImageDropzone
        accept={copy.accept}
        multiple
        disabled={unsupported}
        hint={`${copy.label} files, up to ${MAX_BATCH} at a time and ${MAX_FILE_BYTES / (1024 * 1024)} MB each.`}
        onFiles={add}
      />
      {problems.length > 0 && (
        <ul role="alert" className="space-y-1 text-sm text-destructive">
          {problems.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <BackgroundColorField value={background} onChange={setBackground} />
        <QualitySlider value={quality} onChange={setQuality} />
      </div>

      {items.length > 0 && (
        <ul className="space-y-2" aria-label="Files to convert">
          {items.map((item) => (
            <ConvertedRow
              key={item.id}
              file={item.file}
              background={background}
              quality={quality}
              onRemove={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
            />
          ))}
        </ul>
      )}

      <ResetButton onReset={reset} disabled={items.length === 0 && problems.length === 0} />
    </div>
  );
}
