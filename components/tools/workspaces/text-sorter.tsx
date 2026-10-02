"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SORT_MODES, sortLines, type SortMode } from "@/lib/tools/text-sorter";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolTextArea } from "../ui/tool-field";
import { ToolOutput } from "../ui/tool-output";
import { ToggleOption, ToolSelect, ToolSummary } from "../ui/tool-options";

const modeOptions = SORT_MODES.map((mode) => ({ value: mode.id, label: mode.label }));

export function TextSorterWorkspace() {
  const inputId = useId();
  const outputId = useId();
  const [text, setText] = useState("");
  const [mode, setMode] = useState<SortMode>("az");
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [dedupe, setDedupe] = useState(false);
  // Bumped by "Shuffle again" so a new random order is drawn only on request, not on every render.
  const [shuffleRound, setShuffleRound] = useState(0);

  const result = useMemo(
    () => {
      void shuffleRound;
      return sortLines(text, { mode, caseInsensitive, removeEmpty, dedupe });
    },
    [text, mode, caseInsensitive, removeEmpty, dedupe, shuffleRound],
  );

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
        <ToolOutput id={outputId} label="Result" value={result.output} placeholder="The sorted list appears here" areaClassName="h-56 lg:h-72" />
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Options">
        <ToolSelect label="Order" value={mode} onChange={(value) => setMode(value as SortMode)} options={modeOptions} />
        {mode === "shuffle" && (
          <Button type="button" variant="secondary" size="sm" onClick={() => setShuffleRound((round) => round + 1)} disabled={!text}>
            Shuffle again
          </Button>
        )}
        <ToggleOption label="Ignore case" checked={caseInsensitive} onChange={setCaseInsensitive} hint="Treat Apple and apple as equal" />
        <ToggleOption label="Remove empty lines" checked={removeEmpty} onChange={setRemoveEmpty} />
        <ToggleOption label="Remove duplicates" checked={dedupe} onChange={setDedupe} hint="Keep the first of each repeated line" />
      </div>

      <ToolSummary>
        {text &&
          `${result.total} ${result.total === 1 ? "line" : "lines"} in${result.removed > 0 ? `, ${result.removed} removed` : ""}.`}
      </ToolSummary>
    </div>
  );
}
