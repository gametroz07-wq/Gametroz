"use client";

import { useId, useState } from "react";
import { CHARACTER_LIMITS, countCharacters, limitStatus } from "@/lib/tools/character-count";
import { CopyButton } from "../ui/copy-button";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolInput, ToolTextArea } from "../ui/tool-field";
import { ToolSelect } from "../ui/tool-options";

const format = (value: number) => value.toLocaleString("en-US");

const NO_LIMIT = "none";
const CUSTOM_LIMIT = "custom";

const limitOptions = [
  { value: NO_LIMIT, label: "No limit" },
  ...CHARACTER_LIMITS.map((limit) => ({ value: limit.id, label: limit.label })),
  { value: CUSTOM_LIMIT, label: "Custom limit" },
];

export function CharacterCounterWorkspace() {
  const inputId = useId();
  const customId = useId();
  const [text, setText] = useState("");
  const [limitChoice, setLimitChoice] = useState(NO_LIMIT);
  const [customLimit, setCustomLimit] = useState("");
  const stats = countCharacters(text);

  const customValue = Number(customLimit);
  const customInvalid = limitChoice === CUSTOM_LIMIT && customLimit !== "" && !(Number.isInteger(customValue) && customValue >= 1);
  const limit =
    limitChoice === CUSTOM_LIMIT
      ? customLimit !== "" && !customInvalid
        ? customValue
        : null
      : (CHARACTER_LIMITS.find((preset) => preset.id === limitChoice)?.limit ?? null);
  const status = limit === null ? null : limitStatus(stats.characters, limit);

  const tiles = [
    { label: "Characters", value: format(stats.characters), primary: true },
    { label: "Without spaces", value: format(stats.charactersNoSpaces), primary: true },
    { label: "Letters", value: format(stats.letters) },
    { label: "Digits", value: format(stats.digits) },
    { label: "Whitespace", value: format(stats.whitespace) },
    { label: "Lines", value: format(stats.lines) },
    { label: "Bytes (UTF-8)", value: format(stats.bytes) },
  ];

  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Character statistics">
        {tiles.map((tile) => (
          <li
            key={tile.label}
            className={tile.primary ? "rounded-xl bg-brand-strong px-3 py-2.5 text-white" : "rounded-xl bg-surface-2 px-3 py-2.5"}
          >
            <p className="text-2xl font-bold tabular-nums">{tile.value}</p>
            <p className={tile.primary ? "text-xs text-white/85" : "type-muted text-xs"}>{tile.label}</p>
          </li>
        ))}
      </ul>

      <ToolField
        id={inputId}
        label="Your text"
        actions={
          <>
            <CopyButton value={text} />
            <ResetButton onReset={() => setText("")} label="Clear" disabled={!text} />
          </>
        }
      >
        <ToolTextArea
          id={inputId}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Start typing or paste your text here..."
          rows={8}
        />
      </ToolField>

      <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
        <ToolSelect label="Limit" value={limitChoice} onChange={setLimitChoice} options={limitOptions} />
        {limitChoice === CUSTOM_LIMIT && (
          <ToolField id={customId} label="Characters allowed" error={customInvalid ? "Enter a whole number of 1 or more." : undefined} className="w-44">
            <ToolInput
              id={customId}
              type="number"
              inputMode="numeric"
              min={1}
              value={customLimit}
              onChange={(event) => setCustomLimit(event.target.value)}
              invalid={customInvalid}
              placeholder="e.g. 500"
            />
          </ToolField>
        )}
      </div>

      <div role="status" aria-live="polite" className="min-h-5 text-sm font-medium">
        {status &&
          (status.exceeded ? (
            <p className="text-destructive">
              {format(status.over)} {status.over === 1 ? "character" : "characters"} over the limit of {format(status.limit)}.
            </p>
          ) : (
            <p className="text-emerald-600 dark:text-emerald-400">
              {format(status.remaining)} of {format(status.limit)} characters left.
            </p>
          ))}
      </div>
    </div>
  );
}
