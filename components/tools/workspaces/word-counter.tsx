"use client";

import { useId, useState } from "react";
import { countText, formatDuration } from "@/lib/tools/text-stats";
import { CopyButton } from "../ui/copy-button";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolTextArea } from "../ui/tool-field";

const format = (value: number) => value.toLocaleString("en-US");

export function WordCounterWorkspace() {
  const inputId = useId();
  const [text, setText] = useState("");
  const stats = countText(text);

  const tiles = [
    { label: "Words", value: format(stats.words), primary: true },
    { label: "Characters", value: format(stats.characters), primary: true },
    { label: "Without spaces", value: format(stats.charactersNoSpaces) },
    { label: "Sentences", value: format(stats.sentences) },
    { label: "Paragraphs", value: format(stats.paragraphs) },
    { label: "Lines", value: format(stats.lines) },
    { label: "Reading time", value: formatDuration(stats.readingSeconds) },
    { label: "Speaking time", value: formatDuration(stats.speakingSeconds) },
  ];

  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Text statistics">
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
          rows={10}
        />
      </ToolField>
    </div>
  );
}
