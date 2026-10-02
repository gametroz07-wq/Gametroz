"use client";

import { useId, useState } from "react";
import { removeDuplicateLines } from "@/lib/tools/duplicate-lines";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolTextArea } from "../ui/tool-field";
import { ToolOutput } from "../ui/tool-output";
import { ToggleOption, ToolSummary } from "../ui/tool-options";

export function RemoveDuplicateLinesWorkspace() {
  const inputId = useId();
  const outputId = useId();
  const [text, setText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trim, setTrim] = useState(false);
  const [ignoreEmpty, setIgnoreEmpty] = useState(false);
  const result = removeDuplicateLines(text, { caseSensitive, trim, ignoreEmpty });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolField
          id={inputId}
          label="Your list, one item per line"
          actions={<ResetButton onReset={() => setText("")} label="Clear" disabled={!text} />}
        >
          <ToolTextArea
            id={inputId}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste your list here..."
            className="h-56 lg:h-72"
          />
        </ToolField>
        <ToolOutput id={outputId} label="Result" value={result.output} placeholder="The list without duplicates appears here" areaClassName="h-56 lg:h-72" />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Options">
        <ToggleOption label="Case sensitive" checked={caseSensitive} onChange={setCaseSensitive} hint="Treat Apple and apple as different lines" />
        <ToggleOption label="Trim before comparing" checked={trim} onChange={setTrim} hint="Ignore spaces at the start and end of each line" />
        <ToggleOption label="Ignore empty lines" checked={ignoreEmpty} onChange={setIgnoreEmpty} hint="Keep empty lines as they are" />
      </div>

      <ToolSummary>
        {text &&
          `Removed ${result.removed} duplicate ${result.removed === 1 ? "line" : "lines"}. Kept ${result.kept} of ${result.total}.`}
      </ToolSummary>
    </div>
  );
}
