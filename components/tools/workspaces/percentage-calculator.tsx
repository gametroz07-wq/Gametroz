"use client";

import { useId, useState } from "react";

const inputClass =
  "h-12 w-full rounded-xl border border-input bg-background px-4 text-lg tabular-nums outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function format(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(2)).toLocaleString("en-US") : "—";
}

export function PercentageCalculatorWorkspace() {
  const percentId = useId();
  const valueId = useId();
  const [percent, setPercent] = useState("20");
  const [value, setValue] = useState("150");

  const p = Number(percent);
  const v = Number(value);
  const results = [
    { label: `${format(p)}% of ${format(v)}`, value: format((p / 100) * v) },
    { label: `${format(v)} increased by ${format(p)}%`, value: format(v * (1 + p / 100)) },
    { label: `${format(v)} decreased by ${format(p)}%`, value: format(v * (1 - p / 100)) },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor={percentId} className="type-small font-medium">
            Percentage (%)
          </label>
          <input id={percentId} type="number" inputMode="decimal" value={percent} onChange={(event) => setPercent(event.target.value)} className={inputClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor={valueId} className="type-small font-medium">
            Value
          </label>
          <input id={valueId} type="number" inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} className={inputClass} />
        </div>
      </div>
      <ul className="space-y-2" aria-live="polite">
        {results.map((result, index) => (
          <li
            key={result.label}
            className={
              index === 0
                ? "rounded-2xl bg-brand-strong p-5 text-white"
                : "rounded-2xl bg-surface-2 p-4"
            }
          >
            <p className={index === 0 ? "text-sm text-white/85" : "type-muted"}>{result.label}</p>
            <p className={index === 0 ? "text-4xl font-bold tabular-nums" : "text-2xl font-semibold tabular-nums"}>
              {result.value}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
