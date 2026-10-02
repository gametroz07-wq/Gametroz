"use client";

import { convertUnit } from "@/lib/tools/units";
import { splitPoundsOunces, weightUnits } from "@/lib/tools/weight";
import { ToolNote } from "../ui/result-panel";
import { UnitConverter } from "../ui/unit-converter";

export function WeightWorkspace() {
  return (
    <UnitConverter
      units={weightUnits}
      defaultFrom="lb"
      defaultTo="kg"
      defaultValue="150"
      convert={(value, from, to) => convertUnit(weightUnits, value, from, to)}
      details={({ value, from }) => {
        const { pounds, ounces } = splitPoundsOunces(convertUnit(weightUnits, value, from, "lb"));
        return (
          <ToolNote>
            In pounds and ounces: <strong className="text-foreground">{pounds} lb {ounces} oz</strong>
          </ToolNote>
        );
      }}
    />
  );
}
