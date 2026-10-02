"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { calculateDiscount, MAX_TAX_PERCENT } from "@/lib/tools/discount";
import { formatMoney, parseMoney } from "@/lib/tools/money";
import { formatNumber, parseNumber } from "@/lib/tools/percentage";
import { ResetButton } from "../ui/reset-button";
import { ResultBanner, ResultRows, ToolNote, type ResultRow } from "../ui/result-panel";
import { ToolField, ToolInput } from "../ui/tool-field";
import { ToggleOption, ToolSegmented } from "../ui/tool-options";

type Mode = "percent" | "amount";
const PRESETS = ["10", "20", "25", "30", "50"];

const percentError = (text: string) => (text.trim() !== "" && parseNumber(text) === null ? "Enter a valid percentage." : undefined);

export function DiscountWorkspace() {
  const priceId = useId();
  const valueId = useId();
  const secondId = useId();
  const taxId = useId();
  const [price, setPrice] = useState("");
  const [mode, setMode] = useState<Mode>("percent");
  const [value, setValue] = useState("");
  const [stack, setStack] = useState(false);
  const [second, setSecond] = useState("");
  const [tax, setTax] = useState("");

  const priceParsed = price.trim() === "" ? null : parseMoney(price);
  const valueParsed = value.trim() === "" ? null : mode === "amount" ? parseMoney(value) : null;
  const priceError = priceParsed && !priceParsed.ok ? priceParsed.error : undefined;
  const valueError = mode === "percent" ? percentError(value) : valueParsed && !valueParsed.ok ? valueParsed.error : undefined;
  const secondError = stack ? percentError(second) : undefined;
  const taxError = percentError(tax);

  let outcome: ReturnType<typeof calculateDiscount> | null = null;
  const priceCents = priceParsed?.ok ? priceParsed.cents : null;
  const percent = mode === "percent" && value.trim() !== "" ? parseNumber(value) : null;
  const amountCents = valueParsed?.ok ? valueParsed.cents : null;
  const discount = mode === "percent" ? (percent === null ? null : { type: "percent" as const, percent }) : amountCents === null ? null : { type: "amount" as const, cents: amountCents };
  if (priceCents !== null && discount && !secondError && !taxError) {
    outcome = calculateDiscount({
      priceCents,
      discount,
      secondPercent: stack && second.trim() !== "" ? parseNumber(second) : null,
      taxPercent: tax.trim() !== "" ? parseNumber(tax) : null,
    });
  }

  const result = outcome?.ok ? outcome.result : null;
  const hasTax = tax.trim() !== "" && !taxError;
  const rows: ResultRow[] = result
    ? [
        { label: "Original price", value: formatMoney(result.originalCents) },
        { label: "Discount", value: `-${formatMoney(result.firstDiscountCents)}` },
        ...(result.secondDiscountCents > 0 || (stack && second.trim() !== "") ? [{ label: "Second discount", value: `-${formatMoney(result.secondDiscountCents)}` }] : []),
        { label: "Sale price", value: formatMoney(result.salePriceCents), strong: true },
        { label: "You save", value: `${formatMoney(result.savingsCents)} (${formatNumber(result.savingsPercent)}%)` },
        ...(hasTax ? [{ label: `Sales tax (${formatNumber(parseNumber(tax) ?? 0, 3)}%)`, value: formatMoney(result.taxCents) }, { label: "Total with tax", value: formatMoney(result.totalCents), strong: true }] : []),
      ]
    : [];
  const summary = rows.map((row) => `${row.label}: ${row.value}`).join("\n");

  function reset() {
    setPrice("");
    setValue("");
    setSecond("");
    setTax("");
    setStack(false);
    setMode("percent");
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolField id={priceId} label="Original price ($)" error={priceError}>
          <ToolInput id={priceId} type="text" inputMode="decimal" autoComplete="off" placeholder="80.00" value={price} invalid={Boolean(priceError)} onChange={(event) => setPrice(event.target.value)} />
        </ToolField>
        <ToolField id={valueId} label={mode === "percent" ? "Discount (%)" : "Amount off ($)"} error={valueError}>
          <ToolInput id={valueId} type="text" inputMode="decimal" autoComplete="off" placeholder={mode === "percent" ? "25" : "10.00"} value={value} invalid={Boolean(valueError)} onChange={(event) => setValue(event.target.value)} />
        </ToolField>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToolSegmented
          label="Discount type"
          value={mode}
          onChange={(next) => {
            setMode(next);
            setValue("");
          }}
          options={[
            { value: "percent", label: "Percent off" },
            { value: "amount", label: "Dollars off" },
          ]}
        />
        {mode === "percent" && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Discount presets">
            {PRESETS.map((preset) => (
              <Button key={preset} type="button" variant="outline" size="sm" onClick={() => setValue(preset)}>
                {preset}%
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <ToggleOption label="Add a second discount" checked={stack} onChange={setStack} hint="Applied to the already reduced price" />
          {stack && (
            <ToolField id={secondId} label="Second discount (%)" error={secondError}>
              <ToolInput id={secondId} type="text" inputMode="decimal" autoComplete="off" placeholder="10" value={second} invalid={Boolean(secondError)} onChange={(event) => setSecond(event.target.value)} />
            </ToolField>
          )}
        </div>
        <ToolField id={taxId} label="Sales tax (%), optional" error={taxError} hint={`Added after the discounts, up to ${MAX_TAX_PERCENT}%.`}>
          <ToolInput id={taxId} type="text" inputMode="decimal" autoComplete="off" placeholder="8.25" value={tax} invalid={Boolean(taxError)} hasMessage onChange={(event) => setTax(event.target.value)} />
        </ToolField>
      </div>

      <div className="flex items-center gap-2">
        <ResetButton onReset={reset} disabled={!price && !value && !second && !tax} />
      </div>

      {outcome && !outcome.ok && (
        <p role="alert" className="text-sm text-destructive">
          {outcome.error}
        </p>
      )}

      <ResultBanner
        value={result ? `Sale price ${formatMoney(result.salePriceCents)}` : "—"}
        caption={result ? `You save ${formatMoney(result.savingsCents)} (${formatNumber(result.savingsPercent)}%)` : "Enter a price and a discount"}
        copyValue={result ? summary : undefined}
      />
      {result && <ResultRows rows={rows} label="Price breakdown" />}
      <ToolNote>Amounts are shown in dollars; no currency conversion or exchange rates are used.</ToolNote>
    </div>
  );
}
