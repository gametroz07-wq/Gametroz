"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  dateTimeToTimestamp,
  describeTimestamp,
  parseTimestamp,
  toDateTimeInputValue,
  type UnitChoice,
} from "@/lib/tools/timestamp";
import { CopyButton } from "../ui/copy-button";
import { ResetButton } from "../ui/reset-button";
import { ToolField, ToolInput } from "../ui/tool-field";
import { ToolSelect } from "../ui/tool-options";

const units = [
  { value: "auto", label: "Auto-detect" },
  { value: "seconds", label: "Seconds" },
  { value: "milliseconds", label: "Milliseconds" },
];

const subscribeNothing = () => () => {};
const browserZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 last:border-b-0">
      <div className="min-w-0">
        <p className="type-muted text-xs">{label}</p>
        <p className="font-mono text-sm break-words">{value}</p>
      </div>
      <CopyButton value={value} />
    </div>
  );
}

export function TimestampWorkspace() {
  const tsId = useId();
  const dateId = useId();
  // Server renders UTC; the browser swaps in its own zone without a hydration mismatch.
  const timeZone = useSyncExternalStore(subscribeNothing, browserZone, () => "UTC");
  const [text, setText] = useState("");
  const [unit, setUnit] = useState<UnitChoice>("auto");
  const [now, setNow] = useState(() => Date.now());
  const [dateValue, setDateValue] = useState("");

  function change(next: string) {
    setText(next);
    setNow(Date.now());
  }

  const parsed = text.trim() === "" ? null : parseTimestamp(text, unit);
  const view = parsed?.ok ? describeTimestamp(parsed.ms, { timeZone, now }) : null;
  const reverse = dateValue === "" ? null : dateTimeToTimestamp(dateValue, timeZone);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section aria-labelledby={`${tsId}-title`} className="space-y-4">
        <h2 id={`${tsId}-title`} className="type-h4">
          Timestamp to date
        </h2>
        <ToolField
          id={tsId}
          label="Unix timestamp"
          error={parsed && !parsed.ok ? parsed.error : undefined}
          hint={parsed?.ok ? `Read as ${parsed.unit}.` : "Seconds (10 digits) or milliseconds (13 digits)."}
          actions={
            <>
              <Button type="button" variant="ghost" size="sm" onClick={() => change(String(Date.now()))}>
                Now
              </Button>
              <ResetButton onReset={() => change("")} label="Clear" disabled={!text} />
            </>
          }
        >
          <ToolInput
            id={tsId}
            value={text}
            onChange={(event) => change(event.target.value)}
            invalid={Boolean(parsed && !parsed.ok)}
            hasMessage
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            placeholder="1700000000"
          />
        </ToolField>
        <ToolSelect label="Unit" value={unit} onChange={(value) => setUnit(value as UnitChoice)} options={units} />

        <div role="status" aria-live="polite" className="rounded-xl border border-input bg-surface-2/40 px-4">
          {view ? (
            <>
              <ResultRow label="UTC (ISO 8601)" value={view.iso} />
              <ResultRow label={`Local time (${timeZone})`} value={view.local} />
              <ResultRow label="US format" value={view.us} />
              <ResultRow label="Relative" value={view.relative} />
              <ResultRow label="Unix seconds" value={String(view.seconds)} />
              <ResultRow label="Unix milliseconds" value={String(view.milliseconds)} />
            </>
          ) : (
            <p className="type-muted py-4 text-sm">Enter a timestamp or press Now to see it as a date.</p>
          )}
        </div>
      </section>

      <section aria-labelledby={`${dateId}-title`} className="space-y-4">
        <h2 id={`${dateId}-title`} className="type-h4">
          Date to timestamp
        </h2>
        <ToolField
          id={dateId}
          label={`Date and time (${timeZone})`}
          error={reverse && !reverse.ok ? reverse.error : undefined}
          actions={
            <>
              <Button type="button" variant="ghost" size="sm" onClick={() => setDateValue(toDateTimeInputValue(Date.now(), timeZone))}>
                Now
              </Button>
              <ResetButton onReset={() => setDateValue("")} label="Clear" disabled={!dateValue} />
            </>
          }
        >
          <ToolInput
            id={dateId}
            type="datetime-local"
            step={1}
            value={dateValue}
            onChange={(event) => setDateValue(event.target.value)}
            invalid={Boolean(reverse && !reverse.ok)}
          />
        </ToolField>

        <div role="status" aria-live="polite" className="rounded-xl border border-input bg-surface-2/40 px-4">
          {reverse?.ok ? (
            <>
              <ResultRow label="Unix seconds" value={String(Math.floor(reverse.ms / 1000))} />
              <ResultRow label="Unix milliseconds" value={String(reverse.ms)} />
              <ResultRow label="UTC (ISO 8601)" value={new Date(reverse.ms).toISOString()} />
            </>
          ) : (
            <p className="type-muted py-4 text-sm">Pick a date and time to get its Unix timestamp.</p>
          )}
        </div>
      </section>
    </div>
  );
}
