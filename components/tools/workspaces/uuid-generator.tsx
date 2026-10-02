"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { describeUuid, formatUuid, generateUuidList, MAX_UUID_COUNT, validateUuid } from "@/lib/tools/uuid";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolInput, ToolTextArea } from "../ui/tool-field";
import { ToggleOption } from "../ui/tool-options";
import { ToolOutput } from "../ui/tool-output";

export function UuidWorkspace() {
  const countId = useId();
  const outputId = useId();
  const checkId = useId();
  const [countText, setCountText] = useState("1");
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  // Kept in canonical form so the options can restyle the list without generating again.
  const [raw, setRaw] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [pasted, setPasted] = useState("");

  function generate() {
    const result = generateUuidList({ count: Number(countText), uppercase: false, hyphens: true });
    if (result.ok) {
      setRaw(result.uuids);
      setError(undefined);
    } else {
      setError(result.error);
    }
  }

  const output = raw.map((uuid) => formatUuid(uuid, { uppercase, hyphens })).join("\n");
  const lines = pasted
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <section aria-label="Generate UUIDs" className="space-y-4">
        <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
          <ToolField
            id={countId}
            label="How many (1 to 100)"
            error={error}
            className="w-44"
          >
            <ToolInput
              id={countId}
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_UUID_COUNT}
              value={countText}
              onChange={(event) => setCountText(event.target.value)}
              invalid={Boolean(error)}
            />
          </ToolField>
          <div className="flex h-11 items-center gap-2 self-end">
            <ToggleOption label="Uppercase" checked={uppercase} onChange={setUppercase} />
            <ToggleOption label="Hyphens" checked={hyphens} onChange={setHyphens} />
          </div>
          <div className="flex items-center gap-2 self-end">
            <Button type="button" variant="brand" size="lg" onClick={generate}>
              {raw.length > 0 ? "Generate again" : "Generate"}
            </Button>
            <ResetButton onReset={() => setRaw([])} label="Clear" disabled={raw.length === 0} />
          </div>
        </div>
        <ToolOutput
          id={outputId}
          label={raw.length > 1 ? `${raw.length} UUIDs (version 4)` : "UUID (version 4)"}
          value={output}
          placeholder="Press Generate to create a UUID"
          areaClassName={raw.length > 1 ? "h-56" : "h-20"}
        />
      </section>

      <section aria-label="Validate UUIDs" className="space-y-4">
        <ToolField
          id={checkId}
          label="Validate UUIDs (one per line)"
          hint="Accepts braces, a urn:uuid: prefix, uppercase and missing hyphens."
          actions={<ResetButton onReset={() => setPasted("")} label="Clear" disabled={!pasted} />}
        >
          <ToolTextArea
            id={checkId}
            value={pasted}
            onChange={(event) => setPasted(event.target.value)}
            hasMessage
            spellCheck={false}
            placeholder="123e4567-e89b-12d3-a456-426614174000"
            className="h-28 font-mono text-sm"
          />
        </ToolField>
        {lines.length > 0 && (
          <ul aria-live="polite" className="divide-y divide-border/60 rounded-xl border border-input bg-surface-2/40">
            {lines.slice(0, 200).map((line, index) => {
              const result = validateUuid(line);
              return (
                <li key={`${index}-${line}`} className="space-y-0.5 px-4 py-2.5">
                  <p className="font-mono text-sm break-all">{line}</p>
                  <p className={result.valid ? "text-sm text-emerald-600 dark:text-emerald-400" : "text-sm text-destructive"}>
                    {describeUuid(result)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
        {lines.length > 200 && <p className="type-muted text-xs">Showing the first 200 lines.</p>}
      </section>
    </div>
  );
}
