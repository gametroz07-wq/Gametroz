"use client";

import { useId, useState } from "react";
import { bmiCategory, calculateBmi, type BmiInput } from "@/lib/tools/bmi";
import { formatNumber, parseNumber } from "@/lib/tools/percentage";
import { cn } from "@/lib/utils";
import { ResetButton } from "../ui/reset-button";
import { ResultBanner, ResultRows, ToolNote } from "../ui/result-panel";
import { ToolField, ToolInput } from "../ui/tool-field";
import { ToolSegmented } from "../ui/tool-options";

type System = "us" | "metric";
type Values = { feet: string; inches: string; pounds: string; cm: string; kg: string };
const EMPTY: Values = { feet: "", inches: "", pounds: "", cm: "", kg: "" };

/** Empty text is "not entered" (null); text that is not a number is NaN, which the logic reports. */
const read = (text: string) => (text.trim() === "" ? null : (parseNumber(text) ?? Number.NaN));

const SCALE = [18.4, 18.5, 25, 30].map((sample) => bmiCategory(sample));

export function BmiWorkspace() {
  const ids = [useId(), useId(), useId(), useId(), useId()];
  const [system, setSystem] = useState<System>("us");
  const [values, setValues] = useState<Values>(EMPTY);
  const set = (key: keyof Values) => (event: React.ChangeEvent<HTMLInputElement>) => setValues({ ...values, [key]: event.target.value });

  const input: BmiInput =
    system === "us"
      ? { system, feet: read(values.feet), inches: read(values.inches), pounds: read(values.pounds) }
      : { system, cm: read(values.cm), kg: read(values.kg) };
  const calc = calculateBmi(input);
  const heightTouched = system === "us" ? Boolean(values.feet.trim() || values.inches.trim()) : Boolean(values.cm.trim());
  const weightTouched = system === "us" ? Boolean(values.pounds.trim()) : Boolean(values.kg.trim());
  const errors = calc.ok ? {} : calc.errors;
  const heightError = heightTouched ? errors.height : undefined;
  const weightError = weightTouched ? errors.weight : undefined;
  const result = calc.ok ? calc.result : null;
  const range = result?.healthyRange;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ToolSegmented
          label="Units"
          value={system}
          onChange={setSystem}
          options={[
            { value: "us", label: "US (ft, in, lb)" },
            { value: "metric", label: "Metric (cm, kg)" },
          ]}
        />
        <ResetButton onReset={() => setValues(EMPTY)} disabled={Object.values(values).every((text) => !text)} />
      </div>

      {system === "us" ? (
        <div className="grid grid-cols-3 gap-4">
          <ToolField id={ids[0]} label="Height (ft)" error={heightError}>
            <ToolInput id={ids[0]} type="text" inputMode="decimal" autoComplete="off" placeholder="5" value={values.feet} invalid={Boolean(heightError)} onChange={set("feet")} />
          </ToolField>
          <ToolField id={ids[1]} label="Height (in)">
            <ToolInput id={ids[1]} type="text" inputMode="decimal" autoComplete="off" placeholder="9" value={values.inches} invalid={Boolean(heightError)} onChange={set("inches")} />
          </ToolField>
          <ToolField id={ids[2]} label="Weight (lb)" error={weightError}>
            <ToolInput id={ids[2]} type="text" inputMode="decimal" autoComplete="off" placeholder="160" value={values.pounds} invalid={Boolean(weightError)} onChange={set("pounds")} />
          </ToolField>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <ToolField id={ids[3]} label="Height (cm)" error={heightError}>
            <ToolInput id={ids[3]} type="text" inputMode="decimal" autoComplete="off" placeholder="175" value={values.cm} invalid={Boolean(heightError)} onChange={set("cm")} />
          </ToolField>
          <ToolField id={ids[4]} label="Weight (kg)" error={weightError}>
            <ToolInput id={ids[4]} type="text" inputMode="decimal" autoComplete="off" placeholder="70" value={values.kg} invalid={Boolean(weightError)} onChange={set("kg")} />
          </ToolField>
        </div>
      )}

      <ResultBanner
        value={result ? `BMI ${result.bmi}` : "—"}
        caption={result ? `${result.category.label} (${result.category.range})` : "Enter your height and weight"}
        copyValue={result ? `BMI ${result.bmi}: ${result.category.label}` : undefined}
      />

      {result && range && (
        <ResultRows
          label="Healthy weight range"
          rows={[
            { label: "Healthy weight for your height", value: `${formatNumber(range.minLb, 1)} to ${formatNumber(range.maxLb, 1)} lb` },
            { label: "In kilograms", value: `${formatNumber(range.minKg, 1)} to ${formatNumber(range.maxKg, 1)} kg` },
          ]}
        />
      )}

      <ul aria-label="Adult BMI categories" className="grid gap-2 sm:grid-cols-4">
        {SCALE.map((category) => (
          <li
            key={category.key}
            aria-current={result?.category.key === category.key ? "true" : undefined}
            className={cn("rounded-xl px-3 py-2 text-sm ring-1 ring-white/5", result?.category.key === category.key ? "bg-surface-2 font-bold ring-brand-strong/60" : "bg-surface-2/40 text-muted-foreground")}
          >
            <span className="block">{category.label}</span>
            <span className="tabular-nums">{category.range}</span>
          </li>
        ))}
      </ul>

      <ToolNote>
        For adults age 20 and older. These are the standard adult ranges used by the WHO and CDC. BMI is a screening measure, not a diagnosis; it cannot tell muscle from fat, so talk to a
        health professional about your own health.
      </ToolNote>
    </div>
  );
}
