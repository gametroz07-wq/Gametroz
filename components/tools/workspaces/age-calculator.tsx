"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { calculateAge } from "@/lib/tools/age";
import { formatLongDate, formatSpan, parseIsoDate } from "@/lib/tools/calendar";
import { formatNumber } from "@/lib/tools/percentage";
import { ResetButton } from "../ui/reset-button";
import { ResultBanner, ResultRows, ToolNote, type ResultRow } from "../ui/result-panel";
import { ToolField, ToolInput } from "../ui/tool-field";
import { useTodayIso } from "../ui/use-today";

const plural = (count: number, word: string) => `${formatNumber(count)} ${word}${count === 1 ? "" : "s"}`;

export function AgeWorkspace() {
  const birthId = useId();
  const asOfId = useId();
  const today = useTodayIso();
  const [birthText, setBirthText] = useState("");
  const [asOfText, setAsOfText] = useState<string | null>(null);

  const asOfValue = asOfText ?? today;
  const birth = birthText === "" ? null : parseIsoDate(birthText);
  const asOf = parseIsoDate(asOfValue);
  const birthError = birthText !== "" && !birth ? "Enter a valid date." : undefined;
  const asOfError = asOfValue !== "" && !asOf ? "Enter a valid date." : undefined;
  const outcome = birth && asOf ? calculateAge(birth, asOf) : null;
  const age = outcome?.ok ? outcome.result : null;
  const next = age?.nextBirthday;

  const rows: ResultRow[] = age && next
    ? [
        { label: "Total months", value: formatNumber(age.totalMonths) },
        { label: "Total weeks", value: `${plural(age.totalWeeks, "week")}, ${plural(age.weekRemainderDays, "day")}` },
        { label: "Total days", value: formatNumber(age.totalDays) },
        { label: "Next birthday", value: `${next.weekday}, ${formatLongDate(next.date)}` },
        { label: next.isToday ? "Today" : "Countdown", value: next.isToday ? `Happy birthday, turning ${next.turning}` : `${plural(next.daysUntil, "day")} (turning ${next.turning})` },
      ]
    : [];
  const summary = age && asOf ? `${formatSpan(age)} as of ${formatLongDate(asOf)}` : undefined;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolField id={birthId} label="Birth date" error={birthError} actions={<ResetButton onReset={() => { setBirthText(""); setAsOfText(null); }} disabled={!birthText && asOfText === null} />}>
          <ToolInput id={birthId} type="date" max={today || undefined} value={birthText} invalid={Boolean(birthError)} onChange={(event) => setBirthText(event.target.value)} />
        </ToolField>
        <ToolField
          id={asOfId}
          label="Age as of"
          error={asOfError}
          actions={
            asOfText !== null && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setAsOfText(null)}>
                Use today
              </Button>
            )
          }
        >
          <ToolInput id={asOfId} type="date" value={asOfValue} invalid={Boolean(asOfError)} onChange={(event) => setAsOfText(event.target.value === "" ? null : event.target.value)} />
        </ToolField>
      </div>

      {outcome && !outcome.ok && (
        <p role="alert" className="text-sm text-destructive">
          {outcome.error}
        </p>
      )}

      <ResultBanner
        value={age ? formatSpan(age) : "—"}
        caption={age && asOf ? `As of ${formatLongDate(asOf)}` : "Pick a birth date"}
        copyValue={summary}
      />
      {age && <ResultRows rows={rows} label="Age details" />}
      {birth?.month === 2 && birth.day === 29 && (
        <ToolNote>Born on February 29: in years without a leap day, the birthday is counted on February 28.</ToolNote>
      )}
    </div>
  );
}
