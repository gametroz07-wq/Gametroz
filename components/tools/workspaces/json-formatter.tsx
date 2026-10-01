"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";

const SAMPLE = '{"name":"Gametroz","sections":["games","tools","apps"],"free":true}';

const fieldClass =
  "h-64 w-full resize-y rounded-xl border border-input bg-background p-4 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 lg:h-80";

export function JsonFormatterWorkspace() {
  const inputId = useId();
  const outputId = useId();
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function run(indent: number | undefined) {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, indent));
      setError("");
    } catch (cause) {
      setOutput("");
      setError(cause instanceof Error ? cause.message : "Invalid JSON");
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor={inputId} className="type-small font-medium">
            Input
          </label>
          <textarea id={inputId} value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor={outputId} className="type-small font-medium">
            Output
          </label>
          <textarea id={outputId} value={output} readOnly placeholder="Formatted JSON appears here" spellCheck={false} className={fieldClass} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="brand" size="lg" onClick={() => run(2)}>
          Format
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => run(undefined)}>
          Minify
        </Button>
        <p role="status" className="text-sm text-destructive">
          {error && `Error: ${error}`}
        </p>
      </div>
    </div>
  );
}
