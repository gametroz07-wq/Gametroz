// Unix timestamp conversion. Everything that depends on the clock or the time zone takes it as a
// parameter, so results are reproducible in tests and the UI decides what "now" and "local" mean.

export type TimestampUnit = "seconds" | "milliseconds";
export type UnitChoice = "auto" | TimestampUnit;

export type ParsedTimestamp = { ok: true; ms: number; unit: TimestampUnit } | { ok: false; error: string };
export type DateTimeResult = { ok: true; ms: number } | { ok: false; error: string };

export type TimestampView = {
  /** UTC, ISO 8601. */
  iso: string;
  /** Wall-clock time in the zone, yyyy-mm-dd hh:mm:ss plus the zone abbreviation. */
  local: string;
  /** US style, e.g. "Tuesday, November 14, 2023, 5:13:20 PM". */
  us: string;
  relative: string;
  seconds: number;
  milliseconds: number;
};

/** Largest magnitude a JavaScript Date can represent. */
const MAX_MS = 8.64e15;
/** Values at or above this magnitude are read as milliseconds (1e11 s is year 5138; 1e11 ms is 1973). */
const SECONDS_LIMIT = 1e11;
const OUT_OF_RANGE = "That timestamp is outside the supported date range.";

export function parseTimestamp(text: string, unit: UnitChoice): ParsedTimestamp {
  const trimmed = text.trim();
  if (trimmed === "") return { ok: false, error: "Enter a Unix timestamp." };
  if (!/^[+-]?\d+(\.\d+)?$/.test(trimmed)) {
    return { ok: false, error: "That is not a valid number. Use digits only, for example 1700000000." };
  }
  const value = Number(trimmed);
  const resolved: TimestampUnit = unit === "auto" ? (Math.abs(value) >= SECONDS_LIMIT ? "milliseconds" : "seconds") : unit;
  const ms = Math.round(resolved === "seconds" ? value * 1000 : value);
  if (!Number.isFinite(ms) || Math.abs(ms) > MAX_MS) return { ok: false, error: OUT_OF_RANGE };
  return { ok: true, ms, unit: resolved };
}

function partsOf(ms: number, timeZone: string, options: Intl.DateTimeFormatOptions) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, ...options }).formatToParts(new Date(ms));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return get;
}

const pad = (value: string) => value.padStart(2, "0");

export function formatRelative(ms: number, now: number): string {
  const diff = ms - now;
  const seconds = Math.floor(Math.abs(diff) / 1000);
  if (seconds < 5) return "just now";
  const units: [string, number][] = [
    ["year", 365 * 86_400],
    ["month", 30 * 86_400],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
    ["second", 1],
  ];
  const [name, size] = units.find(([, size]) => seconds >= size) ?? units[units.length - 1];
  const amount = Math.floor(seconds / size);
  const label = `${amount} ${name}${amount === 1 ? "" : "s"}`;
  return diff < 0 ? `${label} ago` : `in ${label}`;
}

export function describeTimestamp(ms: number, { timeZone, now }: { timeZone: string; now: number }): TimestampView {
  const date = partsOf(ms, timeZone, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const us = `${date("weekday")}, ${date("month")} ${date("day")}, ${date("year")}, ${date("hour")}:${date("minute")}:${date("second")} ${date("dayPeriod")}`;

  const numeric = partsOf(ms, timeZone, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  });
  const local = `${numeric("year")}-${numeric("month")}-${numeric("day")} ${pad(numeric("hour"))}:${numeric("minute")}:${numeric("second")} ${numeric("timeZoneName")}`;

  return {
    iso: new Date(ms).toISOString(),
    local,
    us,
    relative: formatRelative(ms, now),
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
  };
}

/** Offset (ms) of `timeZone` from UTC at the instant `ms`. */
function zoneOffset(ms: number, timeZone: string): number {
  const get = partsOf(ms, timeZone, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  });
  const asUtc = Date.UTC(Number(get("year")), Number(get("month")) - 1, Number(get("day")), Number(get("hour")), Number(get("minute")), Number(get("second")));
  return asUtc - Math.floor(ms / 1000) * 1000;
}

/** Formats an instant as the value of a datetime-local input ("YYYY-MM-DDTHH:mm:ss") in `timeZone`. */
export function toDateTimeInputValue(ms: number, timeZone: string): string {
  const get = partsOf(ms, timeZone, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  return `${get("year")}-${get("month")}-${get("day")}T${pad(get("hour"))}:${get("minute")}:${get("second")}`;
}

/** Converts "YYYY-MM-DDTHH:mm[:ss]" (a "T" or a space both work), read as wall-clock time in `timeZone`. */
export function dateTimeToTimestamp(value: string, timeZone: string): DateTimeResult {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!match) return { ok: false, error: "Enter a date and time like 2023-11-14 17:13:20." };
  const [year, month, day, hour, minute, second] = match.slice(1).map((part) => Number(part ?? 0));
  const wall = Date.UTC(year, month - 1, day, hour, minute, second);
  const check = new Date(wall);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return { ok: false, error: "That date or time does not exist." };
  }
  // The offset depends on the instant, so refine the guess once; this settles on the right
  // value except inside a daylight saving gap, where it picks the later reading.
  let ms = wall - zoneOffset(wall, timeZone);
  ms = wall - zoneOffset(ms, timeZone);
  return { ok: true, ms };
}
