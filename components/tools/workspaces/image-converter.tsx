"use client";

import { ImageUp } from "lucide-react";
import { useId, useState } from "react";

/** Dropzone UX mock. Files are listed locally but never processed or uploaded (Phase 7). */
export function ImageConverterWorkspace({ toolName }: { toolName: string }) {
  const inputId = useId();
  const [files, setFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  function accept(list: FileList | null) {
    if (list) setFiles(Array.from(list, (file) => file.name));
  }

  return (
    <div className="space-y-4">
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          accept(event.dataTransfer.files);
        }}
        data-dragging={dragging || undefined}
        className="flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-input bg-background px-6 py-10 text-center transition-colors hover:border-primary/60 has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50 data-dragging:border-primary data-dragging:bg-primary/5"
      >
        <span className="flex size-14 items-center justify-center rounded-2xl bg-surface-2">
          <ImageUp className="size-7 text-muted-foreground" aria-hidden="true" />
        </span>
        <span className="text-base font-semibold">Drag images here</span>
        <span className="type-muted">or</span>
        <span className="inline-flex h-10 items-center rounded-lg bg-brand-strong px-5 text-sm font-semibold text-white">
          Browse files
        </span>
        <span className="type-muted text-xs">Files stay on your device.</span>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(event) => accept(event.target.files)}
        />
      </label>
      {files.length > 0 && (
        <div className="rounded-xl bg-surface-2 p-4" role="status">
          <p className="type-small font-medium">
            {files.length} file{files.length > 1 ? "s" : ""} ready for {toolName}
          </p>
          <ul className="type-muted mt-2 list-inside list-disc">
            {files.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <p className="type-muted mt-3 text-xs">Preview mode: conversion is enabled in a later release.</p>
        </div>
      )}
    </div>
  );
}
