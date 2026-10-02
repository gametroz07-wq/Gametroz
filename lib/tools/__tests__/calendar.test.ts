import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateAge } from "../age";
import {
  addDays,
  addMonths,
  compareDates,
  daysBetween,
  daysInMonth,
  diffYmd,
  formatLongDate,
  formatSpan,
  isLeapYear,
  localToday,
  parseIsoDate,
  toIsoDate,
  weekdayName,
  type CalendarDate,
} from "../calendar";
import { addToDate, businessDaysBetween, dateDifference } from "../date-difference";

const d = (year: number, month: number, day: number): CalendarDate => ({ year, month, day });

describe("calendar primitives", () => {
  it("parses real ISO dates only", () => {
    assert.deepEqual(parseIsoDate("2026-10-01"), d(2026, 10, 1));
    assert.deepEqual(parseIsoDate(" 2024-02-29 "), d(2024, 2, 29));
    for (const bad of ["", "2026-02-30", "2025-02-29", "2026-13-01", "2026-00-10", "26-1-1", "2026/10/01", "0999-01-01", "abcd-ef-gh"]) {
      assert.equal(parseIsoDate(bad), null, bad);
    }
  });

  it("knows leap years and month lengths", () => {
    assert.equal(isLeapYear(2000), true);
    assert.equal(isLeapYear(1900), false);
    assert.equal(isLeapYear(2024), true);
    assert.equal(isLeapYear(2026), false);
    assert.equal(daysInMonth(2024, 2), 29);
    assert.equal(daysInMonth(2026, 2), 28);
    assert.equal(daysInMonth(2026, 4), 30);
  });

  it("counts days between dates", () => {
    assert.equal(daysBetween(d(2026, 10, 1), d(2027, 10, 1)), 365);
    assert.equal(daysBetween(d(2024, 2, 28), d(2024, 3, 1)), 2);
    assert.equal(daysBetween(d(2026, 10, 1), d(2026, 10, 1)), 0);
    assert.equal(daysBetween(d(2026, 10, 2), d(2026, 10, 1)), -1);
  });

  it("adds and subtracts days across month and year ends", () => {
    assert.deepEqual(addDays(d(2026, 10, 1), 30), d(2026, 10, 31));
    assert.deepEqual(addDays(d(2026, 10, 1), 31), d(2026, 11, 1));
    assert.deepEqual(addDays(d(2026, 10, 1), -1), d(2026, 9, 30));
    assert.deepEqual(addDays(d(2026, 12, 31), 1), d(2027, 1, 1));
    assert.deepEqual(addDays(d(2024, 2, 28), 1), d(2024, 2, 29));
    assert.deepEqual(addDays(d(2026, 10, 1), 0), d(2026, 10, 1));
  });

  it("clamps the day when adding months", () => {
    assert.deepEqual(addMonths(d(2026, 1, 31), 1), d(2026, 2, 28));
    assert.deepEqual(addMonths(d(2024, 1, 31), 1), d(2024, 2, 29));
    assert.deepEqual(addMonths(d(2000, 2, 29), 12), d(2001, 2, 28));
    assert.deepEqual(addMonths(d(2000, 2, 29), 48), d(2004, 2, 29));
    assert.deepEqual(addMonths(d(2026, 11, 30), 3), d(2027, 2, 28));
  });

  it("breaks a span into whole years, months and days", () => {
    assert.deepEqual(diffYmd(d(1990, 3, 15), d(2026, 10, 1)), { years: 36, months: 6, days: 16, totalMonths: 438 });
    assert.deepEqual(diffYmd(d(2026, 1, 31), d(2026, 3, 1)), { years: 0, months: 1, days: 1, totalMonths: 1 });
    assert.deepEqual(diffYmd(d(2026, 10, 1), d(2026, 10, 1)), { years: 0, months: 0, days: 0, totalMonths: 0 });
    assert.deepEqual(diffYmd(d(2020, 12, 31), d(2021, 1, 1)), { years: 0, months: 0, days: 1, totalMonths: 0 });
    assert.deepEqual(diffYmd(d(2000, 2, 29), d(2025, 2, 28)), { years: 25, months: 0, days: 0, totalMonths: 300 });
    assert.deepEqual(diffYmd(d(2000, 2, 29), d(2025, 3, 1)), { years: 25, months: 0, days: 1, totalMonths: 300 });
  });

  it("names weekdays and writes US-style dates", () => {
    assert.equal(weekdayName(d(2026, 10, 1)), "Thursday");
    assert.equal(weekdayName(d(2027, 3, 15)), "Monday");
    assert.equal(formatLongDate(d(2026, 10, 1)), "October 1, 2026");
    assert.equal(formatLongDate(d(2027, 3, 15)), "March 15, 2027");
  });

  it("describes a span in words", () => {
    assert.equal(formatSpan({ years: 1, months: 0, days: 5 }), "1 year, 0 months, 5 days");
    assert.equal(formatSpan({ years: 1, months: 0, days: 5 }, true), "1 year, 5 days");
    assert.equal(formatSpan({ years: 0, months: 0, days: 0 }, true), "0 days");
  });

  it("round-trips ISO text, compares and reads today from a Date", () => {
    assert.equal(toIsoDate(d(2026, 3, 5)), "2026-03-05");
    assert.deepEqual(parseIsoDate(toIsoDate(d(2026, 3, 5))), d(2026, 3, 5));
    assert.ok(compareDates(d(2026, 1, 1), d(2026, 1, 2)) < 0);
    assert.equal(compareDates(d(2026, 1, 1), d(2026, 1, 1)), 0);
    assert.ok(compareDates(d(2027, 1, 1), d(2026, 12, 31)) > 0);
    assert.deepEqual(localToday(new Date(2026, 9, 1, 23, 59)), d(2026, 10, 1));
  });
});

describe("calculateAge", () => {
  it("returns exact years, months and days and the totals", () => {
    const result = calculateAge(d(1990, 3, 15), d(2026, 10, 1));
    assert.ok(result.ok);
    if (!result.ok) return;
    const age = result.result;
    assert.deepEqual([age.years, age.months, age.days], [36, 6, 16]);
    assert.equal(age.totalMonths, 438);
    assert.equal(age.totalDays, 13349);
    assert.equal(age.totalWeeks, 1907);
    assert.equal(age.weekRemainderDays, 0);
    assert.deepEqual(age.nextBirthday.date, d(2027, 3, 15));
    assert.equal(age.nextBirthday.daysUntil, 165);
    assert.equal(age.nextBirthday.weekday, "Monday");
    assert.equal(age.nextBirthday.turning, 37);
    assert.equal(age.nextBirthday.isToday, false);
  });

  it("treats the birthday itself as day zero", () => {
    const result = calculateAge(d(1990, 10, 1), d(2026, 10, 1));
    assert.ok(result.ok);
    if (!result.ok) return;
    assert.deepEqual([result.result.years, result.result.months, result.result.days], [36, 0, 0]);
    assert.equal(result.result.nextBirthday.isToday, true);
    assert.equal(result.result.nextBirthday.daysUntil, 0);
    assert.equal(result.result.nextBirthday.turning, 36);
  });

  it("moves to next year once the birthday has passed", () => {
    const result = calculateAge(d(1990, 9, 30), d(2026, 10, 1));
    assert.ok(result.ok);
    if (!result.ok) return;
    assert.deepEqual(result.result.nextBirthday.date, d(2027, 9, 30));
    assert.equal(result.result.nextBirthday.turning, 37);
  });

  it("counts a Feb 29 birthday on Feb 28 in years without a Feb 29", () => {
    const onThe28th = calculateAge(d(2000, 2, 29), d(2025, 2, 28));
    assert.ok(onThe28th.ok);
    if (onThe28th.ok) {
      assert.equal(onThe28th.result.years, 25);
      assert.equal(onThe28th.result.nextBirthday.isToday, true);
    }
    const before = calculateAge(d(2000, 2, 29), d(2025, 2, 27));
    assert.ok(before.ok);
    if (before.ok) {
      assert.equal(before.result.years, 24);
      assert.deepEqual(before.result.nextBirthday.date, d(2025, 2, 28));
    }
    const leapYear = calculateAge(d(2000, 2, 29), d(2026, 10, 1));
    assert.ok(leapYear.ok);
    if (leapYear.ok) assert.deepEqual(leapYear.result.nextBirthday.date, d(2027, 2, 28));
    const nextLeap = calculateAge(d(2000, 2, 29), d(2027, 3, 1));
    assert.ok(nextLeap.ok);
    if (nextLeap.ok) assert.deepEqual(nextLeap.result.nextBirthday.date, d(2028, 2, 29));
  });

  it("rejects a birth date after the as-of date", () => {
    const result = calculateAge(d(2026, 10, 2), d(2026, 10, 1));
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /after/i);
  });

  it("handles a baby born today", () => {
    const result = calculateAge(d(2026, 10, 1), d(2026, 10, 1));
    assert.ok(result.ok);
    if (result.ok) assert.equal(result.result.totalDays, 0);
  });
});

describe("dateDifference", () => {
  it("returns years, months, days and totals", () => {
    const diff = dateDifference(d(2026, 10, 1), d(2026, 12, 25), false);
    assert.deepEqual([diff.years, diff.months, diff.days], [0, 2, 24]);
    assert.equal(diff.totalDays, 85);
    assert.equal(diff.totalWeeks, 12);
    assert.equal(diff.weekRemainderDays, 1);
    assert.equal(diff.reversed, false);
  });

  it("works in either order and says so", () => {
    const diff = dateDifference(d(2026, 12, 25), d(2026, 10, 1), false);
    assert.equal(diff.reversed, true);
    assert.equal(diff.totalDays, 85);
    assert.deepEqual(diff.start, d(2026, 10, 1));
    assert.deepEqual(diff.end, d(2026, 12, 25));
  });

  it("can include the end date", () => {
    const same = dateDifference(d(2026, 10, 1), d(2026, 10, 1), true);
    assert.equal(same.totalDays, 1);
    assert.equal(dateDifference(d(2026, 10, 1), d(2026, 10, 1), false).totalDays, 0);
    const span = dateDifference(d(2026, 10, 1), d(2026, 10, 31), true);
    assert.equal(span.totalDays, 31);
    assert.deepEqual([span.years, span.months, span.days], [0, 1, 0]);
  });

  it("counts business days Monday to Friday", () => {
    // Thursday Oct 1 to Friday Oct 9, 2026, end date not counted: Thu, Fri, Mon, Tue, Wed, Thu = 6.
    assert.equal(businessDaysBetween(d(2026, 10, 1), d(2026, 10, 9)), 6);
    assert.equal(businessDaysBetween(d(2026, 10, 3), d(2026, 10, 5)), 0);
    assert.equal(dateDifference(d(2026, 10, 1), d(2026, 10, 9), true).businessDays, 7);
  });

  it("matches a day-by-day count for many ranges", () => {
    const start = d(2026, 1, 1);
    for (let from = 0; from < 20; from += 3) {
      for (let length = 0; length < 400; length += 13) {
        const a = addDays(start, from);
        const b = addDays(a, length);
        let expected = 0;
        for (let step = 0; step < length; step += 1) {
          const day = new Date(Date.UTC(addDays(a, step).year, addDays(a, step).month - 1, addDays(a, step).day)).getUTCDay();
          if (day !== 0 && day !== 6) expected += 1;
        }
        assert.equal(businessDaysBetween(a, b), expected, `${toIsoDate(a)} + ${length}`);
      }
    }
  });
});

describe("addToDate", () => {
  it("adds and subtracts days and names the weekday", () => {
    const later = addToDate(d(2026, 10, 1), 90);
    assert.ok(later.ok);
    if (later.ok) {
      assert.deepEqual(later.date, d(2026, 12, 30));
      assert.equal(later.weekday, "Wednesday");
    }
    const earlier = addToDate(d(2026, 10, 1), -1);
    assert.ok(earlier.ok);
    if (earlier.ok) assert.deepEqual(earlier.date, d(2026, 9, 30));
  });

  it("rejects fractions and results outside the supported years", () => {
    assert.equal(addToDate(d(2026, 10, 1), 1.5).ok, false);
    assert.equal(addToDate(d(2026, 10, 1), Number.NaN).ok, false);
    assert.equal(addToDate(d(2026, 10, 1), 10_000_000).ok, false);
    assert.equal(addToDate(d(1000, 1, 1), -1).ok, false);
  });
});
