"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  describeJsonError,
  formatJson,
  minifyJson,
  validateJson,
  type JsonIndent,
  type JsonIssue,
  type JsonValidation,
} from "@/lib/tools/json";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolTextArea } from "../ui/tool-field";
import { ToolOutput } from "../ui/tool-output";

const SAMPLE = '{"name":"Gametroz","sections":["games","tools","apps"],"free":true}';

const indents: { value: string; label: string; indent: JsonIndent }[] = [
  { value: "2", label: "2 spaces", indent: 2 },
  { value: "4", label: "4 spaces", indent: 4 },
  { value: "tab", label: "Tab", indent: "tab" },
];

type Status = { type: "valid"; summary: string } | { type: "error"; error: JsonIssue };

function summarize(result: Extract<JsonValidation, { ok: true }>) {
  if (result.kind === "object") return `Valid JSON: an object with ${result.size} ${result.size === 1 ? "key" : "keys"}.`;
  if (result.kind === "array") return `Valid JSON: an array with ${result.size} ${result.size === 1 ? "item" : "items"}.`;
  return `Valid JSON: a ${result.kind} value.`;
}

export function JsonFormatterWorkspace() {
  const inputId = useId();
  const outputId = useId();
  const indentId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentValue, setIndentValue] = useState("2");
  const [status, setStatus] = useState<Status | null>(null);

  const indent = indents.find((option) => option.value === indentValue)?.indent ?? 2;

  function run(action: "format" | "minify" | "validate") {
    if (action === "validate") {
      const result = validateJson(input);
      setOutput("");
      setStatus(result.ok ? { type: "valid", summary: summarize(result) } : { type: "error", error: result.error });
      return;
    }
    const result = action === "format" ? formatJson(input, indent) : minifyJson(input);
    if (result.ok) {
      setOutput(result.output);
      setStatus({ type: "valid", summary: "Valid JSON." });
    } else {
      setOutput("");
      setStatus({ type: "error", error: result.error });
    }
  }

  function jumpToError(error: JsonIssue) {
    const area = inputRef.current;
    if (!area) return;
    area.focus();
    area.setSelectionRange(error.offset, Math.min(error.offset + 1, input.length));
  }

  function reset() {
    setInput("");
    setOutput("");
    setStatus(null);
  }

  const error = status?.type === "error" ? status.error : null;
  const empty = input.trim() === "";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolField
          id={inputId}
          label="JSON input"
          error={error ? describeJsonError(error) : undefined}
          actions={
            <>
              <Button type="button" variant="ghost" size="sm" onClick={() => setInput(SAMPLE)}>
                Insert sample
              </Button>
              <ResetButton onReset={reset} label="Clear" disabled={!input && !output && !status} />
            </>
          }
        >
          <ToolTextArea
            id={inputId}
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            invalid={Boolean(error)}
            spellCheck={false}
            placeholder='{"paste": "your JSON here"}'
            className="h-64 font-mono text-sm lg:h-80"
          />
        </ToolField>
        <ToolOutput
          id={outputId}
          label="Result"
          value={output}
          placeholder="Formatted or minified JSON appears here"
          areaClassName="h-64 lg:h-80"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="brand" size="lg" onClick={() => run("format")} disabled={empty}>
          Format
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => run("minify")} disabled={empty}>
          Minify
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => run("validate")} disabled={empty}>
          Validate
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor={indentId} className="type-small">
            Indent
          </label>
          <select
            id={indentId}
            value={indentValue}
            onChange={(event) => setIndentValue(event.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {indents.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div role="status" aria-live="polite" className="min-h-5 text-sm">
        {status?.type === "valid" && <p className="text-emerald-600 dark:text-emerald-400">{status.summary}</p>}
        {error && (
          <p className="text-destructive">
            Invalid JSON.{" "}
            <button type="button" onClick={() => jumpToError(error)} className="font-semibold underline underline-offset-2">
              Jump to the error
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
