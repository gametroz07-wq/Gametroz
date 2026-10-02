"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { generateNumbers, type SortOrder } from "@/lib/tools/random-number";
import { CopyButton } from "../ui/copy-button";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolInput } from "../ui/tool-field";
import { ToggleOption, ToolSelect } from "../ui/tool-options";

const sorts = [
  { value: "none", label: "As drawn" },
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

const presets = [
  { label: "Die (d6)", min: "1", max: "6" },
  { label: "d20", min: "1", max: "20" },
  { label: "Coin flip (0 or 1)", min: "0", max: "1" },
  { label: "1 to 100", min: "1", max: "100" },
];

export function RandomNumberWorkspace() {
  const minId = useId();
  const maxId = useId();
  const countId = useId();
  const decimalsId = useId();
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [decimals, setDecimals] = useState("0");
  const [unique, setUnique] = useState(false);
  const [sort, setSort] = useState<SortOrder>("none");
  const [values, setValues] = useState<string[]>([]);
  const [error, setError] = useState<string>();

  function generate() {
    // An empty field is not a number: Number("") would silently be 0.
    const read = (text: string) => (text.trim() === "" ? Number.NaN : Number(text));
    const result = generateNumbers({ min: read(min), max: read(max), count: read(count), unique, decimals: read(decimals), sort });
    if (result.ok) {
      setValues(result.values);
      setError(undefined);
    } else {
      setValues([]);
      setError(result.error);
    }
  }

  function applyPreset(preset: (typeof presets)[number]) {
    setMin(preset.min);
    setMax(preset.max);
    setDecimals("0");
    setUnique(false);
  }

  function clear() {
    setValues([]);
    setError(undefined);
  }

  const list = values.join(", ");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Presets">
        {presets.map((preset) => (
          <Button key={preset.label} type="button" variant="outline" size="sm" onClick={() => applyPreset(preset)}>
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ToolField id={minId} label="Minimum">
          <ToolInput id={minId} type="number" inputMode="decimal" value={min} onChange={(event) => setMin(event.target.value)} />
        </ToolField>
        <ToolField id={maxId} label="Maximum">
          <ToolInput id={maxId} type="number" inputMode="decimal" value={max} onChange={(event) => setMax(event.target.value)} />
        </ToolField>
        <ToolField id={countId} label="How many">
          <ToolInput id={countId} type="number" inputMode="numeric" min={1} value={count} onChange={(event) => setCount(event.target.value)} />
        </ToolField>
        <ToolField id={decimalsId} label="Decimal places">
          <ToolInput
            id={decimalsId}
            type="number"
            inputMode="numeric"
            min={0}
            max={6}
            value={decimals}
            onChange={(event) => setDecimals(event.target.value)}
          />
        </ToolField>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleOption label="Unique numbers only" checked={unique} onChange={setUnique} hint="No number appears twice" />
        <ToolSelect label="Order" value={sort} onChange={(value) => setSort(value as SortOrder)} options={sorts} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="brand" size="lg" onClick={generate}>
          {values.length > 0 ? "Generate again" : "Generate"}
        </Button>
        <ResetButton onReset={clear} label="Clear" disabled={values.length === 0 && !error} />
        {values.length > 0 && <CopyButton value={list} label="Copy all" />}
      </div>

      <div aria-live="polite">
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {values.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Results">
            {values.map((value, index) => (
              <li
                key={`${index}-${value}`}
                className="min-w-12 rounded-lg border border-input bg-surface-2/40 px-3 py-1.5 text-center font-mono text-lg tabular-nums"
              >
                {value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
