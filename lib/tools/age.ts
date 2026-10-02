import {
  compareDates,
  daysBetween,
  diffYmd,
  isLeapYear,
  weekdayName,
  type CalendarDate,
} from "./calendar";

export type NextBirthday = {
  date: CalendarDate;
  daysUntil: number;
  weekday: string;
  /** Age on that birthday. */
  turning: number;
  isToday: boolean;
};

export type Age = {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  weekRemainderDays: number;
  totalDays: number;
  nextBirthday: NextBirthday;
};

/** Where a birthday falls in a given year. A Feb 29 birthday is observed on Feb 28 in years without a Feb 29. */
export function birthdayInYear(birth: CalendarDate, year: number): CalendarDate {
  const skipsLeapDay = birth.month === 2 && birth.day === 29 && !isLeapYear(year);
  return { year, month: birth.month, day: skipsLeapDay ? 28 : birth.day };
}

export function calculateAge(birth: CalendarDate, asOf: CalendarDate): { ok: true; result: Age } | { ok: false; error: string } {
  if (compareDates(birth, asOf) > 0) {
    return { ok: false, error: "The birth date is after the as-of date, so there is no age to show yet." };
  }
  const span = diffYmd(birth, asOf);
  const totalDays = daysBetween(birth, asOf);

  let next = birthdayInYear(birth, asOf.year);
  if (compareDates(next, asOf) < 0) next = birthdayInYear(birth, asOf.year + 1);

  return {
    ok: true,
    result: {
      years: span.years,
      months: span.months,
      days: span.days,
      totalMonths: span.totalMonths,
      totalWeeks: Math.floor(totalDays / 7),
      weekRemainderDays: totalDays % 7,
      totalDays,
      nextBirthday: {
        date: next,
        daysUntil: daysBetween(asOf, next),
        weekday: weekdayName(next),
        turning: next.year - birth.year,
        isToday: compareDates(next, asOf) === 0,
      },
    },
  };
}
