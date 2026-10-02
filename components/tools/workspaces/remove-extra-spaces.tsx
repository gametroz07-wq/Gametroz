"use client";

import { useId, useState } from "react";
import { removeExtraSpaces } from "@/lib/tools/extra-spaces";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolTextArea } from "../ui/tool-field";
import { ToolOutput } from "../ui/tool-output";
import { ToggleOption, ToolSummary } from "../ui/tool-options";

const plural = (count: number, one: string, many: string) => `${count.toLocaleString("en-US")} ${count === 1 ? one : many}`;

export function RemoveExtraSpacesWorkspace() {
  const inputId = useId();
  const outputId = useId();
  const [text, setText] = useState("");
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false);
  const [joinLines, setJoinLines] = useState(false);
  const result = removeExtraSpaces(text, { removeEmptyLines, joinLines });

  const changes = [
    result.charactersRemoved > 0 && `${plural(result.charactersRemoved, "character", "characters")} removed`,
    result.emptyLinesRemoved > 0 && `${plural(result.emptyLinesRemoved, "empty line", "empty lines")} removed`,
    result.lineBreaksRemoved > 0 && `${plural(result.lineBreaksRemoved, "line break", "line breaks")} joined`,
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolField
          id={inputId}
          label="Your text"
          actions={<ResetButton onReset={() => setText("")} label="Clear" disabled={!text} />}
        >
          <ToolTextArea
            id={inputId}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste the text you want to clean..."
            className="h-56 lg:h-72"
          />
        </ToolField>
        <ToolOutput id={outputId} label="Result" value={result.output} placeholder="The cleaned text appears here" areaClassName="h-56 lg:h-72" />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Options">
        <ToggleOption label="Remove empty lines" checked={removeEmptyLines || joinLines} onChange={setRemoveEmptyLines} disabled={joinLines} hint="Delete blank lines" />
        <ToggleOption label="Join lines into one" checked={joinLines} onChange={setJoinLines} hint="Replace every line break with a single space" />
      </div>

      <ToolSummary>{text && (changes.length > 0 ? `${changes.join(", ")}.` : "Nothing to clean: the text is already tidy.")}</ToolSummary>
    </div>
  );
}
