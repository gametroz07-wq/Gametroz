// Calendar-date maths on plain { year, month, day } values. No time zones and no Date parsing of
// user text, so "2026-10-01" is the same day for everyone.

export type CalendarDate = { year: number; month: number; day: number };

const MS_PER_DAY = 86_400_000;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Earliest and latest years the tools accept. */
export const MIN_YEAR = 1000;
export const MAX_YEAR = 9999;

export const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export function daysInMonth(year: number, month: number) {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

/** Parses the value of an <input type="date"> (YYYY-MM-DD). Null for anything that is not a real date. */
export function parseIsoDate(text: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim());
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (year < MIN_YEAR || month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

export function toIsoDate({ year, month, day }: CalendarDate) {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Days since 1970-01-01 (UTC), so date arithmetic is plain integer maths. */
const dayNumber = ({ year, month, day }: CalendarDate) => Date.UTC(year, month - 1, day) / MS_PER_DAY;

function fromDayNumber(value: number): CalendarDate {
  const date = new Date(value * MS_PER_DAY);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

export const compareDates = (a: CalendarDate, b: CalendarDate) => dayNumber(a) - dayNumber(b);

/** Whole days from a to b; negative when b is earlier. */
export const daysBetween = (a: CalendarDate, b: CalendarDate) => dayNumber(b) - dayNumber(a);

export const addDays = (date: CalendarDate, days: number) => fromDayNumber(dayNumber(date) + days);

/** Adds calendar months; a day that does not exist in the target month moves to that month's last day. */
export function addMonths(date: CalendarDate, months: number): CalendarDate {
  const index = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) };
}

/**
 * Whole years, months and days from `from` to `to` (from must not be after to). Months are counted
 * with addMonths, so Jan 31 plus one month is Feb 28 and the days left over are counted from there.
 */
export function diffYmd(from: CalendarDate, to: CalendarDate) {
  let totalMonths = (to.year - from.year) * 12 + (to.month - from.month);
  if (compareDates(addMonths(from, totalMonths), to) > 0) totalMonths -= 1;
  const days = daysBetween(addMonths(from, totalMonths), to);
  return { years: Math.floor(totalMonths / 12), months: totalMonths % 12, days, totalMonths };
}

export const weekdayName = (date: CalendarDate) => WEEKDAYS[new Date(dayNumber(date) * MS_PER_DAY).getUTCDay()];

/** Weekday number, 0 = Sunday ... 6 = Saturday. */
export const weekdayIndex = (date: CalendarDate) => new Date(dayNumber(date) * MS_PER_DAY).getUTCDay();

/** US style: "October 1, 2026". */
export const formatLongDate = ({ year, month, day }: CalendarDate) => `${MONTHS[month - 1]} ${day}, ${year}`;

/** "1 year, 0 months, 5 days"; with `omitZero`, empty parts are dropped ("1 year, 5 days"). */
export function formatSpan({ years, months, days }: { years: number; months: number; days: number }, omitZero = false) {
  const parts: [number, string][] = [
    [years, "year"],
    [months, "month"],
    [days, "day"],
  ];
  const shown = omitZero ? parts.filter(([count]) => count > 0) : parts;
  return (shown.length > 0 ? shown : [[0, "day"] as [number, string]])
    .map(([count, word]) => `${count} ${word}${count === 1 ? "" : "s"}`)
    .join(", ");
}

/** The device's current calendar date. Callers pass it into the pure functions so they stay testable. */
export const localToday = (now: Date = new Date()): CalendarDate => ({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  day: now.getDate(),
});
