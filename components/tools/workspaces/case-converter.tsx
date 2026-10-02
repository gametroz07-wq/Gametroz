"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { CASE_MODES, convertCase, type CaseMode } from "@/lib/tools/case-convert";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolTextArea } from "../ui/tool-field";
import { ToolOutput } from "../ui/tool-output";

export function CaseConverterWorkspace() {
  const inputId = useId();
  const outputId = useId();
  const [text, setText] = useState("");
  const [mode, setMode] = useState<CaseMode>("title");
  const output = convertCase(text, mode);

  return (
    <div className="space-y-4">
      <ToolField
        id={inputId}
        label="Your text"
        actions={<ResetButton onReset={() => setText("")} label="Clear" disabled={!text} />}
      >
        <ToolTextArea
          id={inputId}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type or paste your text here..."
          rows={6}
        />
      </ToolField>

      <div role="group" aria-label="Choose a case" className="flex flex-wrap gap-2">
        {CASE_MODES.map((option) => (
          <Button
            key={option.id}
            type="button"
            size="sm"
            variant={option.id === mode ? "brand" : "outline"}
            aria-pressed={option.id === mode}
            onClick={() => setMode(option.id)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <ToolOutput id={outputId} label="Result" value={output} placeholder="The converted text appears here" areaClassName="min-h-32" />
    </div>
  );
}
