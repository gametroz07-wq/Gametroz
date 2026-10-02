"use client";

import { Download } from "lucide-react";
import { useId } from "react";
import { buttonVariants } from "@/components/ui/button";
import { formatBytes, formatSize, percentSaved, type Size } from "@/lib/tools/image";
import { cn } from "@/lib/utils";

/** Labelled 1-100 quality range with its current value. */
export function QualitySlider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="type-small flex items-center justify-between gap-2 font-medium">
        Quality
        <output htmlFor={id} className="tabular-nums">
          {value}
        </output>
      </label>
      <input
        id={id}
        type="range"
        min={1}
        max={100}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-9 w-full accent-brand-strong"
      />
    </div>
  );
}

/** Color picker for the fill under transparent areas. */
export function BackgroundColorField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="type-small block font-medium">
        Background for transparent areas
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-14 cursor-pointer rounded-lg border border-input bg-background p-1"
        />
        <span className="font-mono text-sm uppercase">{value}</span>
      </div>
    </div>
  );
}

/** Link styled as a button; the blob URL is owned by useConversion. */
export function DownloadLink({ href, filename, disabled }: { href: string; filename: string; disabled?: boolean }) {
  return (
    <a
      href={disabled ? undefined : href}
      download={filename}
      aria-disabled={disabled || undefined}
      className={cn(buttonVariants({ size: "sm" }), "h-9 px-3", disabled && "pointer-events-none opacity-50")}
    >
      <Download aria-hidden="true" />
      Download
    </a>
  );
}

/** Before and after: file size and dimensions, plus the saving. */
export function BeforeAfter({
  originalBytes,
  originalSize,
  resultBytes,
  resultSize,
  dimmed,
}: {
  originalBytes: number;
  originalSize: Size;
  resultBytes: number;
  resultSize: Size;
  dimmed?: boolean;
}) {
  const saved = percentSaved(originalBytes, resultBytes);
  return (
    <dl className={cn("grid gap-3 text-sm sm:grid-cols-2", dimmed && "opacity-60")}>
      <div className="rounded-xl border border-input bg-surface-2/40 p-3">
        <dt className="type-muted text-xs">Original</dt>
        <dd className="font-medium">{formatBytes(originalBytes)}</dd>
        <dd className="type-muted">{formatSize(originalSize)}</dd>
      </div>
      <div className="rounded-xl border border-input bg-surface-2/40 p-3">
        <dt className="type-muted text-xs">Result</dt>
        <dd className="font-medium">
          {formatBytes(resultBytes)}{" "}
          <span className={saved < 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}>
            ({saved < 0 ? `${Math.abs(saved)}% larger` : `${saved}% saved`})
          </span>
        </dd>
        <dd className="type-muted">{formatSize(resultSize)}</dd>
      </div>
    </dl>
  );
}
