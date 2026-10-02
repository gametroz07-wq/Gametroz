import {
  MAX_YEAR,
  MIN_YEAR,
  addDays,
  compareDates,
  daysBetween,
  diffYmd,
  weekdayIndex,
  weekdayName,
  type CalendarDate,
} from "./calendar";

export type DateDifference = {
  start: CalendarDate;
  end: CalendarDate;
  /** True when the dates were given latest first. */
  reversed: boolean;
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  weekRemainderDays: number;
  businessDays: number;
};

/** Monday to Friday days in [start, end): the end date itself is not counted. No holidays are removed. */
export function businessDaysBetween(start: CalendarDate, end: CalendarDate) {
  const length = daysBetween(start, end);
  const first = weekdayIndex(start);
  let count = Math.floor(length / 7) * 5;
  for (let offset = 0; offset < length % 7; offset += 1) {
    const weekday = (first + offset) % 7;
    if (weekday !== 0 && weekday !== 6) count += 1;
  }
  return count;
}

/** Difference between two dates in either order. `includeEnd` counts the end date as a full day. */
export function dateDifference(a: CalendarDate, b: CalendarDate, includeEnd: boolean): DateDifference {
  const reversed = compareDates(a, b) > 0;
  const [start, end] = reversed ? [b, a] : [a, b];
  const limit = includeEnd ? addDays(end, 1) : end;
  const span = diffYmd(start, limit);
  const totalDays = daysBetween(start, limit);
  return {
    start,
    end,
    reversed,
    years: span.years,
    months: span.months,
    days: span.days,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    weekRemainderDays: totalDays % 7,
    businessDays: businessDaysBetween(start, limit),
  };
}

const MAX_DAYS = 3_652_425;

export function addToDate(
  date: CalendarDate,
  amount: number,
): { ok: true; date: CalendarDate; weekday: string } | { ok: false; error: string } {
  if (!Number.isInteger(amount)) return { ok: false, error: "Enter a whole number of days." };
  if (Math.abs(amount) > MAX_DAYS) return { ok: false, error: "That is too many days. Use 3,652,425 or fewer." };
  const result = addDays(date, amount);
  if (result.year < MIN_YEAR || result.year > MAX_YEAR) {
    return { ok: false, error: `That lands outside the supported years (${MIN_YEAR} to ${MAX_YEAR}).` };
  }
  return { ok: true, date: result, weekday: weekdayName(result) };
}
