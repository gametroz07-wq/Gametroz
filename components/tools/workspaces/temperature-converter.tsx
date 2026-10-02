"use client";

import { convertTemperature, temperatureFormula, temperatureUnits, validateTemperature, type TemperatureKey } from "@/lib/tools/temperature";
import { ToolNote } from "../ui/result-panel";
import { UnitConverter } from "../ui/unit-converter";

export function TemperatureWorkspace() {
  return (
    <UnitConverter
      units={temperatureUnits}
      defaultFrom="F"
      defaultTo="C"
      defaultValue="98.6"
      allowNegative
      convert={(value, from, to) => convertTemperature(value, from as TemperatureKey, to as TemperatureKey)}
      validate={(value, from) => validateTemperature(value, from as TemperatureKey)}
      details={({ from, to }) => (
        <ToolNote>
          Formula: <code className="rounded bg-surface-2 px-1.5 py-0.5 text-foreground">{temperatureFormula(from as TemperatureKey, to as TemperatureKey)}</code>
        </ToolNote>
      )}
    />
  );
}
