"use client";

import { ImageUp } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type ImageDropzoneProps = {
  accept: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Short sentence under the prompt: accepted types and limits. */
  hint: string;
  onFiles: (files: File[]) => void;
};

/**
 * Drop target and file picker in one. The native file input is visually hidden but stays in the
 * tab order inside its label, so the zone works with keyboard (Enter/Space) and screen readers.
 */
export function ImageDropzone({ accept, multiple, disabled, hint, onFiles }: ImageDropzoneProps) {
  const id = useId();
  const [dragging, setDragging] = useState(false);

  return (
    <label
      htmlFor={id}
      onDragOver={(event) => {
        if (disabled) return;
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!disabled) onFiles(Array.from(event.dataTransfer.files));
      }}
      className={cn(
        "flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-input bg-surface-2/40 px-4 py-8 text-center transition-colors hover:bg-surface-2 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
        dragging && "border-brand-strong bg-surface-2",
        disabled && "cursor-not-allowed opacity-60 hover:bg-surface-2/40",
      )}
    >
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
      <ImageUp className="size-8 text-muted-foreground" aria-hidden="true" />
      <span className="text-base font-medium">
        Drop {multiple ? "images" : "an image"} here or <span className="underline underline-offset-4">choose {multiple ? "files" : "a file"}</span>
      </span>
      <span className="type-muted text-xs">{hint}</span>
    </label>
  );
}
