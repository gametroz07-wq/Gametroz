"use client";

import { useId, useState } from "react";
import { lengthUnits, splitFeetInches } from "@/lib/tools/length";
import { parseNumber } from "@/lib/tools/percentage";
import { convertUnit } from "@/lib/tools/units";
import { ResetButton } from "../ui/reset-button";
import { ResultBanner, ToolNote } from "../ui/result-panel";
import { ToolField, ToolInput } from "../ui/tool-field";
import { ToolSegmented } from "../ui/tool-options";
import { UnitConverter, UnitTable } from "../ui/unit-converter";

type Mode = "single" | "ftin";

function FeetInchesConverter() {
  const feetId = useId();
  const inchesId = useId();
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");

  const feetValue = feet.trim() === "" ? 0 : parseNumber(feet);
  const inchesValue = inches.trim() === "" ? 0 : parseNumber(inches);
  const feetError = feetValue === null ? "Enter a valid number." : feetValue < 0 ? "Enter 0 or more." : undefined;
  const inchesError = inchesValue === null ? "Enter a valid number." : inchesValue < 0 ? "Enter 0 or more." : undefined;
  const empty = feet.trim() === "" && inches.trim() === "";
  const totalInches = feetValue !== null && inchesValue !== null && !feetError && !inchesError && !empty ? feetValue * 12 + inchesValue : null;
  const table = totalInches === null ? null : Object.fromEntries(lengthUnits.map((unit) => [unit.key, convertUnit(lengthUnits, totalInches, "in", unit.key)]));
  const cm = totalInches === null ? null : convertUnit(lengthUnits, totalInches, "in", "cm");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <ToolField id={feetId} label="Feet" error={feetError} actions={<ResetButton onReset={() => { setFeet("5"); setInches("9"); }} />}>
          <ToolInput id={feetId} type="text" inputMode="decimal" autoComplete="off" value={feet} invalid={Boolean(feetError)} onChange={(event) => setFeet(event.target.value)} />
        </ToolField>
        <ToolField id={inchesId} label="Inches" error={inchesError}>
          <ToolInput id={inchesId} type="text" inputMode="decimal" autoComplete="off" value={inches} invalid={Boolean(inchesError)} onChange={(event) => setInches(event.target.value)} />
        </ToolField>
      </div>
      <ResultBanner
        value={cm === null ? "—" : `${cm.toLocaleString("en-US", { maximumFractionDigits: 2 })} cm`}
        caption={totalInches === null ? "Enter feet and inches" : `${splitFeetInches(totalInches).feet} ft ${splitFeetInches(totalInches).inches} in =`}
        copyValue={cm === null ? undefined : `${cm.toLocaleString("en-US", { maximumFractionDigits: 2 })} cm`}
      />
      {table && <UnitTable units={lengthUnits} values={table} highlight="cm" caption="The same length in every unit" />}
    </div>
  );
}

export function LengthWorkspace() {
  const [mode, setMode] = useState<Mode>("single");
  return (
    <div className="space-y-5">
      <ToolSegmented
        label="Input mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: "single", label: "One unit" },
          { value: "ftin", label: "Feet + inches" },
        ]}
      />
      {mode === "single" ? (
        <UnitConverter
          units={lengthUnits}
          defaultFrom="ft"
          defaultTo="m"
          defaultValue="6"
          convert={(value, from, to) => convertUnit(lengthUnits, value, from, to)}
          details={({ value, from }) => {
            const { feet, inches } = splitFeetInches(convertUnit(lengthUnits, value, from, "in"));
            return (
              <ToolNote>
                In feet and inches: <strong className="text-foreground">{feet} ft {inches} in</strong>
              </ToolNote>
            );
          }}
        />
      ) : (
        <FeetInchesConverter />
      )}
    </div>
  );
}
