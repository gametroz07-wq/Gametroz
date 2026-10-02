"use client";

import { useId, useState } from "react";
import { formatMoney, parseMoney } from "@/lib/tools/money";
import { formatNumber, parseNumber } from "@/lib/tools/percentage";
import { calculateTip } from "@/lib/tools/tip";
import { ResetButton } from "../ui/reset-button";
import { ResultBanner, ResultRows, type ResultRow } from "../ui/result-panel";
import { ToolField, ToolInput } from "../ui/tool-field";
import { ToggleOption, ToolSegmented } from "../ui/tool-options";

const PRESETS = ["15", "18", "20", "22", "25"];

export function TipWorkspace() {
  const billId = useId();
  const customId = useId();
  const peopleId = useId();
  const [bill, setBill] = useState("");
  const [choice, setChoice] = useState("20");
  const [custom, setCustom] = useState("");
  const [people, setPeople] = useState("1");
  const [roundUp, setRoundUp] = useState(false);

  const billParsed = bill.trim() === "" ? null : parseMoney(bill);
  const billError = billParsed && !billParsed.ok ? billParsed.error : undefined;
  const tipText = choice === "custom" ? custom : choice;
  const tipPercent = tipText.trim() === "" ? null : parseNumber(tipText);
  const customError = choice === "custom" && custom.trim() !== "" && tipPercent === null ? "Enter a valid percentage." : undefined;
  const peopleValue = people.trim() === "" ? null : parseNumber(people);
  const peopleParsedError = people.trim() !== "" && peopleValue === null ? "Enter a whole number." : undefined;

  const outcome =
    billParsed?.ok && tipPercent !== null && peopleValue !== null
      ? calculateTip({ billCents: billParsed.cents, tipPercent, people: peopleValue, roundUp })
      : null;
  const result = outcome?.ok ? outcome.result : null;
  const peopleError = peopleParsedError ?? (outcome && !outcome.ok && /people/i.test(outcome.error) ? outcome.error : undefined);
  const generalError = outcome && !outcome.ok && !peopleError ? outcome.error : undefined;

  const rows: ResultRow[] = result
    ? [
        { label: "Bill", value: formatMoney(billParsed?.ok ? billParsed.cents : 0) },
        { label: `Tip (${formatNumber(tipPercent ?? 0, 2)}%)`, value: formatMoney(result.tipCents) },
        { label: "Total", value: formatMoney(result.totalCents), strong: true },
        ...((peopleValue ?? 1) > 1 ? [{ label: `Per person (${peopleValue} people)`, value: formatMoney(result.perPersonCents), strong: true }] : []),
        ...(result.extraCents > 0 ? [{ label: "Rounding added", value: formatMoney(result.extraCents) }, { label: "Tip you effectively leave", value: `${formatMoney(result.effectiveTipCents)} (${formatNumber(result.effectiveTipPercent)}%)` }] : []),
      ]
    : [];
  const perPerson = (peopleValue ?? 1) > 1;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolField id={billId} label="Bill amount ($)" error={billError}>
          <ToolInput id={billId} type="text" inputMode="decimal" autoComplete="off" placeholder="86.40" value={bill} invalid={Boolean(billError)} onChange={(event) => setBill(event.target.value)} />
        </ToolField>
        <ToolField id={peopleId} label="Split between (people)" error={peopleError}>
          <ToolInput id={peopleId} type="text" inputMode="numeric" autoComplete="off" value={people} invalid={Boolean(peopleError)} onChange={(event) => setPeople(event.target.value)} />
        </ToolField>
      </div>

      <div className="space-y-2">
        <ToolSegmented
          label="Tip percentage"
          value={choice}
          onChange={setChoice}
          options={[...PRESETS.map((preset) => ({ value: preset, label: `${preset}%` })), { value: "custom", label: "Custom" }]}
        />
        {choice === "custom" && (
          <ToolField id={customId} label="Custom tip (%)" error={customError} className="max-w-48">
            <ToolInput id={customId} type="text" inputMode="decimal" autoComplete="off" placeholder="17.5" value={custom} invalid={Boolean(customError)} onChange={(event) => setCustom(event.target.value)} />
          </ToolField>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleOption label="Round up each share to the next dollar" checked={roundUp} onChange={setRoundUp} />
        <ResetButton
          onReset={() => {
            setBill("");
            setChoice("20");
            setCustom("");
            setPeople("1");
            setRoundUp(false);
          }}
          disabled={!bill && !custom && people === "1" && choice === "20" && !roundUp}
        />
      </div>

      {generalError && (
        <p role="alert" className="text-sm text-destructive">
          {generalError}
        </p>
      )}

      <ResultBanner
        value={result ? (perPerson ? `${formatMoney(result.perPersonCents)} per person` : formatMoney(result.totalCents)) : "—"}
        caption={result ? `Tip ${formatMoney(result.tipCents)}, total ${formatMoney(result.totalCents)}` : "Enter the bill amount"}
        copyValue={result ? rows.map((row) => `${row.label}: ${row.value}`).join("\n") : undefined}
      />
      {result && <ResultRows rows={rows} label="Tip breakdown" />}
    </div>
  );
}
