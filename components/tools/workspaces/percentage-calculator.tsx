"use client";

import { useId, useState } from "react";
import {
  decreaseByPercent,
  formatNumber,
  increaseByPercent,
  parseNumber,
  percentChange,
  percentOf,
  whatPercent,
} from "@/lib/tools/percentage";
import { CopyButton } from "../ui/copy-button";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolInput } from "../ui/tool-field";

type Values = { a: string; b: string };
const EMPTY: Values = { a: "", b: "" };

type Answer = { text: string; detail?: string } | { error: string };

type CardProps = {
  title: string;
  labels: [string, string];
  placeholders: [string, string];
  compute: (a: number, b: number) => Answer;
};

const INVALID = "Enter a valid number.";

function CalculatorCard({ title, labels, placeholders, compute }: CardProps) {
  const idA = useId();
  const idB = useId();
  const [values, setValues] = useState<Values>(EMPTY);

  const a = parseNumber(values.a);
  const b = parseNumber(values.b);
  const errorA = values.a.trim() !== "" && a === null ? INVALID : undefined;
  const errorB = values.b.trim() !== "" && b === null ? INVALID : undefined;
  const answer = a !== null && b !== null ? compute(a, b) : null;
  const result = answer && "text" in answer ? answer : null;
  const caption = answer && "error" in answer ? answer.error : (result?.detail ?? "Enter both numbers");

  return (
    <section aria-label={title} className="space-y-3 rounded-2xl bg-surface-2/50 p-4 ring-1 ring-white/5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold">{title}</h3>
        <ResetButton onReset={() => setValues(EMPTY)} disabled={!values.a && !values.b} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ToolField id={idA} label={labels[0]} error={errorA}>
          <ToolInput
            id={idA}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={values.a}
            placeholder={placeholders[0]}
            invalid={Boolean(errorA)}
            onChange={(event) => setValues({ ...values, a: event.target.value })}
          />
        </ToolField>
        <ToolField id={idB} label={labels[1]} error={errorB}>
          <ToolInput
            id={idB}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={values.b}
            placeholder={placeholders[1]}
            invalid={Boolean(errorB)}
            onChange={(event) => setValues({ ...values, b: event.target.value })}
          />
        </ToolField>
      </div>
      <div
        aria-live="polite"
        className="flex min-h-16 items-center justify-between gap-3 rounded-xl bg-brand-strong px-4 py-3 text-white"
      >
        <div className="min-w-0">
          <p className="truncate text-2xl font-bold tabular-nums">{result ? result.text : "—"}</p>
          <p className="truncate text-xs text-white/85">{caption}</p>
        </div>
        {result && <CopyButton value={result.text} className="shrink-0 border-white/30 bg-white/10 text-white hover:bg-white/20" />}
      </div>
    </section>
  );
}

export function PercentageCalculatorWorkspace() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CalculatorCard
        title="What is X% of Y?"
        labels={["Percentage (%)", "Of the number"]}
        placeholders={["15", "240"]}
        compute={(percent, value) => ({
          text: formatNumber(percentOf(percent, value)),
          detail: `${formatNumber(percent)}% of ${formatNumber(value)}`,
        })}
      />
      <CalculatorCard
        title="X is what percent of Y?"
        labels={["Number (X)", "Out of (Y)"]}
        placeholders={["45", "180"]}
        compute={(part, whole) => {
          const percent = whatPercent(part, whole);
          return percent === null
            ? { error: "Y cannot be zero." }
            : { text: `${formatNumber(percent, 4)}%`, detail: `${formatNumber(part)} out of ${formatNumber(whole)}` };
        }}
      />
      <CalculatorCard
        title="Percentage change from X to Y"
        labels={["From (X)", "To (Y)"]}
        placeholders={["80", "100"]}
        compute={(from, to) => {
          const change = percentChange(from, to);
          if (!change) return { error: "The starting value cannot be zero." };
          const sign = change.direction === "increase" ? "+" : "";
          const word = { increase: "Increase", decrease: "Decrease", none: "No change" }[change.direction];
          return {
            text: `${sign}${formatNumber(change.percent, 4)}%`,
            detail: `${word} from ${formatNumber(from)} to ${formatNumber(to)}`,
          };
        }}
      />
      <CalculatorCard
        title="Increase a value by X%"
        labels={["Value", "Percentage (%)"]}
        placeholders={["200", "15"]}
        compute={(value, percent) => ({
          text: formatNumber(increaseByPercent(value, percent)),
          detail: `Decreased by ${formatNumber(percent)}% instead: ${formatNumber(decreaseByPercent(value, percent))}`,
        })}
      />
    </div>
  );
}
