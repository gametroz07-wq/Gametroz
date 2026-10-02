"use client";

import { useId, useState } from "react";
import { formatLongDate, formatSpan, parseIsoDate } from "@/lib/tools/calendar";
import { addToDate, dateDifference } from "@/lib/tools/date-difference";
import { parseNumber, formatNumber } from "@/lib/tools/percentage";
import { ResetButton } from "../ui/reset-button";
import { ResultBanner, ResultRows, ToolNote, ToolPanel } from "../ui/result-panel";
import { ToolField, ToolInput } from "../ui/tool-field";
import { ToggleOption, ToolSegmented } from "../ui/tool-options";
import { useTodayIso } from "../ui/use-today";

const plural = (count: number, word: string) => `${formatNumber(count)} ${word}${count === 1 ? "" : "s"}`;

function BetweenDates() {
  const startId = useId();
  const endId = useId();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [includeEnd, setIncludeEnd] = useState(false);

  const a = parseIsoDate(start);
  const b = parseIsoDate(end);
  const diff = a && b ? dateDifference(a, b, includeEnd) : null;
  const summary = diff ? `${formatSpan(diff, true)} (${plural(diff.totalDays, "day")}), ${plural(diff.businessDays, "business day")}` : undefined;

  return (
    <ToolPanel
      title="Days between two dates"
      actions={<ResetButton onReset={() => { setStart(""); setEnd(""); setIncludeEnd(false); }} disabled={!start && !end && !includeEnd} />}
    >
      <div className="grid grid-cols-2 gap-3">
        <ToolField id={startId} label="Start date">
          <ToolInput id={startId} type="date" value={start} onChange={(event) => setStart(event.target.value)} />
        </ToolField>
        <ToolField id={endId} label="End date">
          <ToolInput id={endId} type="date" value={end} onChange={(event) => setEnd(event.target.value)} />
        </ToolField>
      </div>
      <ToggleOption label="Include end date" checked={includeEnd} onChange={setIncludeEnd} hint="Count the last day as a full day" />
      <ResultBanner value={diff ? formatSpan(diff, true) : "—"} caption={diff ? `${formatLongDate(diff.start)} to ${formatLongDate(diff.end)}` : "Pick two dates"} copyValue={summary} />
      {diff && (
        <ResultRows
          label="Date difference details"
          rows={[
            { label: "Total days", value: formatNumber(diff.totalDays) },
            { label: "Total weeks", value: `${plural(diff.totalWeeks, "week")}, ${plural(diff.weekRemainderDays, "day")}` },
            { label: "Business days (Mon to Fri)", value: formatNumber(diff.businessDays) },
          ]}
        />
      )}
      <ToolNote>Business days are Monday to Friday. Public holidays are not removed.</ToolNote>
    </ToolPanel>
  );
}

function AddDays() {
  const dateId = useId();
  const daysId = useId();
  const today = useTodayIso();
  const [date, setDate] = useState<string | null>(null);
  const [days, setDays] = useState("");
  const [direction, setDirection] = useState<"add" | "subtract">("add");

  const dateValue = date ?? today;
  const base = parseIsoDate(dateValue);
  const amount = days.trim() === "" ? null : parseNumber(days);
  const daysError = days.trim() !== "" && (amount === null || amount < 0) ? "Enter a whole number of days, 0 or more." : undefined;
  const outcome = base && amount !== null && !daysError ? addToDate(base, direction === "add" ? amount : -amount) : null;
  const rangeError = outcome && !outcome.ok ? outcome.error : undefined;
  const text = outcome?.ok ? `${outcome.weekday}, ${formatLongDate(outcome.date)}` : undefined;

  return (
    <ToolPanel title="Add or subtract days" actions={<ResetButton onReset={() => { setDate(null); setDays(""); setDirection("add"); }} disabled={date === null && !days && direction === "add"} />}>
      <div className="grid grid-cols-2 gap-3">
        <ToolField id={dateId} label="Date">
          <ToolInput id={dateId} type="date" value={dateValue} onChange={(event) => setDate(event.target.value === "" ? null : event.target.value)} />
        </ToolField>
        <ToolField id={daysId} label="Number of days" error={daysError ?? rangeError}>
          <ToolInput id={daysId} type="text" inputMode="numeric" autoComplete="off" placeholder="90" value={days} invalid={Boolean(daysError ?? rangeError)} onChange={(event) => setDays(event.target.value)} />
        </ToolField>
      </div>
      <ToolSegmented
        label="Direction"
        value={direction}
        onChange={setDirection}
        options={[
          { value: "add", label: "Add days" },
          { value: "subtract", label: "Subtract days" },
        ]}
      />
      <ResultBanner value={text ?? "—"} caption={text ? "Resulting date" : "Enter a number of days"} copyValue={text} />
    </ToolPanel>
  );
}

export function DateDifferenceWorkspace() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BetweenDates />
      <AddDays />
    </div>
  );
}
