"use client";

import { useId, useState } from "react";

function countStats(text: string) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  return [
    { label: "Words", value: words },
    { label: "Characters", value: text.length },
    { label: "Without spaces", value: text.replace(/\s/g, "").length },
    { label: "Sentences", value: trimmed ? trimmed.split(/[.!?]+(?:\s|$)/).filter(Boolean).length : 0 },
    { label: "Paragraphs", value: trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0 },
    { label: "Reading time", value: `${Math.max(words ? 1 : 0, Math.ceil(words / 230))} min` },
  ];
}

export function WordCounterWorkspace() {
  const inputId = useId();
  const [text, setText] = useState("");
  const stats = countStats(text);

  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" aria-live="polite">
        {stats.map((stat) => (
          <li key={stat.label} className="rounded-xl bg-surface-2 px-3 py-3">
            <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
            <p className="type-muted text-xs">{stat.label}</p>
          </li>
        ))}
      </ul>
      <label htmlFor={inputId} className="sr-only">
        Text to count
      </label>
      <textarea
        id={inputId}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Start typing or paste your text here..."
        rows={10}
        className="w-full resize-y rounded-xl border border-input bg-background p-4 text-base leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </div>
  );
}
