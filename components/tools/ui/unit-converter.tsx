"use client";

import { ArrowLeftRight } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { parseNumber } from "@/lib/tools/percentage";
import { formatQuantity } from "@/lib/tools/units";
import { ResetButton } from "./reset-button";
import { ResultBanner, nativeControlClass } from "./result-panel";
import { ToolField, ToolInput } from "./tool-field";

export type ConverterUnit = { key: string; label: string; symbol: string; group?: string };

type UnitSelectProps = { id: string; label: string; value: string; units: readonly ConverterUnit[]; onChange: (key: string) => void };

function UnitSelect({ id, label, value, units, onChange }: UnitSelectProps) {
  const groups = [...new Set(units.map((unit) => unit.group ?? ""))];
  const option = (unit: ConverterUnit) => (
    <option key={unit.key} value={unit.key}>
      {unit.label} ({unit.symbol})
    </option>
  );
  return (
    <ToolField id={id} label={label}>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={nativeControlClass}>
        {groups.map((group) =>
          group ? (
            <optgroup key={group} label={group}>
              {units.filter((unit) => unit.group === group).map(option)}
            </optgroup>
          ) : (
            units.filter((unit) => !unit.group).map(option)
          ),
        )}
      </select>
    </ToolField>
  );
}

type UnitTableProps = {
  units: readonly ConverterUnit[];
  /** Value of each unit, by key. */
  values: Record<string, number>;
  highlight?: string;
  caption: string;
};

/** Every unit for one input, grouped like the menus. */
export function UnitTable({ units, values, highlight, caption }: UnitTableProps) {
  const groups = [...new Set(units.map((unit) => unit.group ?? ""))];
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-white/5">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        {groups.map((group) => (
          <tbody key={group} className="divide-y divide-white/5 bg-surface-2/40">
            {group && (
              <tr>
                <th colSpan={2} scope="colgroup" className="bg-surface-2/70 px-4 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group}
                </th>
              </tr>
            )}
            {units
              .filter((unit) => (unit.group ?? "") === group)
              .map((unit) => (
                <tr key={unit.key} className={unit.key === highlight ? "font-bold" : undefined}>
                  <th scope="row" className="px-4 py-2 text-left font-normal text-muted-foreground">
                    {unit.label}
                  </th>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {formatQuantity(values[unit.key])} {unit.symbol}
                  </td>
                </tr>
              ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

type UnitConverterProps = {
  units: readonly ConverterUnit[];
  defaultFrom: string;
  defaultTo: string;
  defaultValue: string;
  convert: (value: number, from: string, to: string) => number;
  /** Extra check on the parsed value, e.g. temperatures below absolute zero. */
  validate?: (value: number, from: string) => string | undefined;
  allowNegative?: boolean;
  /** Extra content under the result, such as a formula or a combined-unit line. */
  details?: (context: { value: number; from: string; to: string; result: number }) => React.ReactNode;
};

/** One value, two units, a headline result and a table with every unit. Shared by the converters. */
export function UnitConverter({ units, defaultFrom, defaultTo, defaultValue, convert, validate, allowNegative = false, details }: UnitConverterProps) {
  const valueId = useId();
  const fromId = useId();
  const toId = useId();
  const [text, setText] = useState(defaultValue);
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);

  const parsed = parseNumber(text);
  let error: string | undefined;
  if (text.trim() !== "") {
    if (parsed === null) error = "Enter a valid number.";
    else if (!allowNegative && parsed < 0) error = "Enter 0 or more.";
    else error = validate?.(parsed, from);
  }
  const value = parsed !== null && !error ? parsed : null;

  const symbol = (key: string) => units.find((unit) => unit.key === key)?.symbol ?? "";
  const result = value === null ? null : convert(value, from, to);
  const table = value === null ? null : Object.fromEntries(units.map((unit) => [unit.key, convert(value, from, unit.key)]));

  return (
    <div className="space-y-5">
      <div className="grid gap-4">
        <ToolField id={valueId} label="Value" error={error} actions={<ResetButton onReset={() => { setText(defaultValue); setFrom(defaultFrom); setTo(defaultTo); }} />}>
          <ToolInput
            id={valueId}
            type="text"
            inputMode={allowNegative ? "text" : "decimal"}
            autoComplete="off"
            value={text}
            invalid={Boolean(error)}
            placeholder="Enter a value"
            onChange={(event) => setText(event.target.value)}
          />
        </ToolField>
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <UnitSelect id={fromId} label="From" value={from} units={units} onChange={setFrom} />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Swap units"
            className="mb-0.5 size-11"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
          >
            <ArrowLeftRight aria-hidden="true" />
          </Button>
          <UnitSelect id={toId} label="To" value={to} units={units} onChange={setTo} />
        </div>
      </div>

      <ResultBanner
        value={result === null ? "—" : `${formatQuantity(result)} ${symbol(to)}`}
        caption={value === null ? "Enter a value to convert" : `${formatQuantity(value)} ${symbol(from)} =`}
        copyValue={result === null ? undefined : `${formatQuantity(result)} ${symbol(to)}`}
      />

      {value !== null && result !== null && details?.({ value, from, to, result })}

      {table && <UnitTable units={units} values={table} highlight={to} caption="The same value in every unit" />}
    </div>
  );
}
