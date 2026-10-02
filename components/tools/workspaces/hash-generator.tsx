"use client";

import { X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { hashAlgorithms, hashBytes, type HashAlgorithm } from "@/lib/tools/hash";
import { CopyButton } from "../ui/copy-button";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolInput, ToolTextArea } from "../ui/tool-field";
import { ToggleOption } from "../ui/tool-options";

type Hashes = Record<HashAlgorithm, string>;
type Source = string | File;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function HashWorkspace() {
  const textId = useId();
  const fileId = useId();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uppercase, setUppercase] = useState(false);
  // Hashes are stored with the source they were computed for, so a stale result is never shown.
  const [result, setResult] = useState<{ source: Source; hashes: Hashes } | { source: Source; error: string } | null>(null);

  const source: Source = file ?? text;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = file ? new Uint8Array(await file.arrayBuffer()) : new TextEncoder().encode(text);
        const entries = await Promise.all(hashAlgorithms.map(async (algorithm) => [algorithm, await hashBytes(data, algorithm)] as const));
        if (!cancelled) setResult({ source: file ?? text, hashes: Object.fromEntries(entries) as Hashes });
      } catch {
        if (!cancelled) setResult({ source: file ?? text, error: "Could not read or hash that input. Try a smaller file." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [text, file]);

  const current = result && result.source === source ? result : null;
  const hashes = current && "hashes" in current ? current.hashes : null;
  const error = current && "error" in current ? current.error : undefined;
  const hasInput = Boolean(file) || text !== "";
  const show = (hash: string) => (uppercase ? hash.toUpperCase() : hash);

  function reset() {
    setText("");
    setFile(null);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolField
          id={textId}
          label="Text to hash"
          hint={file ? "A file is selected. Remove it to hash text instead." : "Hashed as UTF-8. Updates as you type."}
          actions={<ResetButton onReset={reset} label="Clear" disabled={!hasInput} />}
        >
          <ToolTextArea
            id={textId}
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={Boolean(file)}
            hasMessage
            spellCheck={false}
            placeholder="Type or paste text"
            className="h-40 font-mono text-sm"
          />
        </ToolField>

        <ToolField id={fileId} label="Or hash a file" hint="The file is read in your browser and never uploaded.">
          <ToolInput
            id={fileId}
            type="file"
            hasMessage
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="h-auto cursor-pointer py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm"
          />
          {file && (
            <p className="mt-2 flex items-center gap-2 text-sm">
              <span className="min-w-0 truncate">
                {file.name} ({formatSize(file.size)})
              </span>
              <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)}>
                <X aria-hidden="true" />
                Remove file
              </Button>
            </p>
          )}
        </ToolField>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleOption label="Uppercase hex" checked={uppercase} onChange={setUppercase} />
      </div>

      <div role="status" aria-live="polite" className="rounded-xl border border-input bg-surface-2/40 px-4">
        {error ? (
          <p role="alert" className="py-3 text-sm text-destructive">
            {error}
          </p>
        ) : hashes && hasInput ? (
          hashAlgorithms.map((algorithm) => (
            <div key={algorithm} className="flex items-start justify-between gap-3 border-b border-border/60 py-3 last:border-b-0">
              <div className="min-w-0">
                <p className="type-small font-medium">{algorithm}</p>
                <p className="font-mono text-xs break-all sm:text-sm">{show(hashes[algorithm])}</p>
              </div>
              <CopyButton value={show(hashes[algorithm])} />
            </div>
          ))
        ) : (
          <p className="type-muted py-4 text-sm">{!hasInput ? "Type some text or choose a file to see its hashes." : file ? "Hashing the file..." : "Calculating..."}</p>
        )}
      </div>

      <p className="type-muted text-xs">
        MD5 is not offered: it is weak and not part of the browser&apos;s Web Crypto API. SHA-1 is included only for compatibility and
        should not be used for security.
      </p>
    </div>
  );
}
