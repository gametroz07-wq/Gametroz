"use client";

import { ArrowLeftRight } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { decodeBase64, encodeBase64, type CodecResult } from "@/lib/tools/base64";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolTextArea } from "../ui/tool-field";
import { ToggleOption, ToolSegmented } from "../ui/tool-options";
import { ToolOutput } from "../ui/tool-output";

type Mode = "encode" | "decode";

const modes: { value: Mode; label: string }[] = [
  { value: "encode", label: "Encode" },
  { value: "decode", label: "Decode" },
];

export function Base64Workspace() {
  const inputId = useId();
  const outputId = useId();
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [padding, setPadding] = useState(true);

  const result: CodecResult = mode === "encode" ? { ok: true, output: encodeBase64(input, { urlSafe, padding }) } : decodeBase64(input);
  const output = result.ok ? result.output : "";
  const error = !result.ok ? result.error : undefined;

  function swap() {
    if (!result.ok) return;
    setInput(result.output);
    setMode(mode === "encode" ? "decode" : "encode");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <ToolSegmented label="Direction" value={mode} onChange={setMode} options={modes} />
        <Button type="button" variant="outline" size="sm" onClick={swap} disabled={!result.ok || !input}>
          <ArrowLeftRight aria-hidden="true" />
          Swap
        </Button>
        {mode === "encode" && (
          <>
            <ToggleOption label="URL-safe alphabet" checked={urlSafe} onChange={setUrlSafe} hint="Use - and _ instead of + and /" />
            <ToggleOption label="Keep = padding" checked={padding} onChange={setPadding} />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ToolField
          id={inputId}
          label={mode === "encode" ? "Text to encode" : "Base64 to decode"}
          error={input ? error : undefined}
          actions={<ResetButton onReset={() => setInput("")} label="Clear" disabled={!input} />}
        >
          <ToolTextArea
            id={inputId}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            invalid={Boolean(input && error)}
            spellCheck={false}
            placeholder={mode === "encode" ? "Type or paste text, emoji included" : "Paste a Base64 string"}
            className="h-56 font-mono text-sm"
          />
        </ToolField>
        <ToolOutput
          id={outputId}
          label={mode === "encode" ? "Base64" : "Decoded text"}
          value={output}
          placeholder="The result appears here"
          areaClassName="h-56"
        />
      </div>
    </div>
  );
}
