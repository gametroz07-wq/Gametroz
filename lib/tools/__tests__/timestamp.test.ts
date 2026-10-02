import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dateTimeToTimestamp, describeTimestamp, formatRelative, parseTimestamp, toDateTimeInputValue } from "../timestamp";

const NOW = 1_700_000_000_000; // 2023-11-14T22:13:20Z

describe("parseTimestamp", () => {
  it("auto-detects seconds and milliseconds", () => {
    assert.deepEqual(parseTimestamp("1700000000", "auto"), { ok: true, ms: 1_700_000_000_000, unit: "seconds" });
    assert.deepEqual(parseTimestamp("1700000000000", "auto"), { ok: true, ms: 1_700_000_000_000, unit: "milliseconds" });
    assert.deepEqual(parseTimestamp(" 0 ", "auto"), { ok: true, ms: 0, unit: "seconds" });
  });

  it("honors an explicit unit", () => {
    assert.deepEqual(parseTimestamp("1700000000", "milliseconds"), { ok: true, ms: 1_700_000_000, unit: "milliseconds" });
    assert.deepEqual(parseTimestamp("99999999999999", "seconds"), { ok: false, error: "That timestamp is outside the supported date range." });
  });

  it("accepts negatives and fractional seconds", () => {
    assert.deepEqual(parseTimestamp("-86400", "auto"), { ok: true, ms: -86_400_000, unit: "seconds" });
    assert.deepEqual(parseTimestamp("1700000000.5", "auto"), { ok: true, ms: 1_700_000_000_500, unit: "seconds" });
  });

  it("rejects empty and non-numeric input", () => {
    assert.deepEqual(parseTimestamp("", "auto"), { ok: false, error: "Enter a Unix timestamp." });
    const bad = parseTimestamp("12abc", "auto");
    assert.equal(bad.ok, false);
    if (!bad.ok) assert.match(bad.error, /number/);
  });
});

describe("describeTimestamp", () => {
  it("formats UTC, local and US-friendly text for a given time zone", () => {
    const view = describeTimestamp(NOW, { timeZone: "America/New_York", now: NOW });
    assert.equal(view.iso, "2023-11-14T22:13:20.000Z");
    assert.equal(view.us, "Tuesday, November 14, 2023, 5:13:20 PM");
    assert.equal(view.local, "2023-11-14 17:13:20 EST");
    assert.equal(view.seconds, 1_700_000_000);
    assert.equal(view.milliseconds, NOW);
    assert.equal(view.relative, "just now");
  });

  it("handles other zones and the epoch", () => {
    assert.equal(describeTimestamp(NOW, { timeZone: "Asia/Kolkata", now: NOW }).us, "Wednesday, November 15, 2023, 3:43:20 AM");
    const epoch = describeTimestamp(0, { timeZone: "UTC", now: NOW });
    assert.equal(epoch.iso, "1970-01-01T00:00:00.000Z");
    assert.equal(epoch.us, "Thursday, January 1, 1970, 12:00:00 AM");
  });
});

describe("formatRelative", () => {
  const DAY = 86_400_000;
  it("describes the past and the future", () => {
    assert.equal(formatRelative(NOW - 3 * DAY, NOW), "3 days ago");
    assert.equal(formatRelative(NOW - DAY, NOW), "1 day ago");
    assert.equal(formatRelative(NOW + 2 * 3_600_000, NOW), "in 2 hours");
    assert.equal(formatRelative(NOW - 30_000, NOW), "30 seconds ago");
    assert.equal(formatRelative(NOW + 5 * 60_000, NOW), "in 5 minutes");
    assert.equal(formatRelative(NOW - 45 * DAY, NOW), "1 month ago");
    assert.equal(formatRelative(NOW - 400 * DAY, NOW), "1 year ago");
  });

  it("says just now within a few seconds", () => {
    assert.equal(formatRelative(NOW - 2_000, NOW), "just now");
    assert.equal(formatRelative(NOW + 2_000, NOW), "just now");
  });
});

describe("toDateTimeInputValue", () => {
  it("formats an instant as a datetime-local value in the zone", () => {
    assert.equal(toDateTimeInputValue(NOW, "America/New_York"), "2023-11-14T17:13:20");
    assert.equal(toDateTimeInputValue(0, "UTC"), "1970-01-01T00:00:00");
    assert.equal(toDateTimeInputValue(Date.UTC(2023, 0, 1, 0, 0, 5), "UTC"), "2023-01-01T00:00:05");
  });

  it("round-trips through dateTimeToTimestamp", () => {
    const value = toDateTimeInputValue(NOW, "Asia/Kolkata");
    assert.deepEqual(dateTimeToTimestamp(value, "Asia/Kolkata"), { ok: true, ms: NOW });
  });
});

describe("dateTimeToTimestamp", () => {
  it("converts a wall-clock time in a zone", () => {
    assert.deepEqual(dateTimeToTimestamp("2023-11-14T17:13:20", "America/New_York"), { ok: true, ms: NOW });
    assert.deepEqual(dateTimeToTimestamp("2023-11-14 17:13", "America/New_York"), { ok: true, ms: NOW - 20_000 });
    assert.deepEqual(dateTimeToTimestamp("2023-11-15T03:43:20", "Asia/Kolkata"), { ok: true, ms: NOW });
    assert.deepEqual(dateTimeToTimestamp("1970-01-01T00:00:00", "UTC"), { ok: true, ms: 0 });
  });

  it("uses the offset in effect on that date (daylight saving)", () => {
    assert.deepEqual(dateTimeToTimestamp("2023-07-01T12:00:00", "America/New_York"), { ok: true, ms: Date.UTC(2023, 6, 1, 16) });
  });

  it("rejects impossible or malformed values", () => {
    for (const bad of ["2023-02-30T10:00", "2023-13-01T10:00", "tomorrow", "", "2023-11-14T25:00"]) {
      assert.equal(dateTimeToTimestamp(bad, "UTC").ok, false, bad);
    }
  });
});
