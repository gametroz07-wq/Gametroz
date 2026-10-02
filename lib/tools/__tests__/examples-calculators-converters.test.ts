import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateAge } from "../age";
import { calculateBmi } from "../bmi";
import { addDays, formatLongDate, weekdayName, type CalendarDate } from "../calendar";
import { storageUnits, downloadSeconds, formatDuration } from "../data-storage";
import { addToDate, dateDifference } from "../date-difference";
import { getToolDefinition } from "../definitions";
import { calculateDiscount } from "../discount";
import { lengthUnits, splitFeetInches } from "../length";
import { formatMoney } from "../money";
import { formatNumber } from "../percentage";
import { convertTemperature } from "../temperature";
import { calculateTip } from "../tip";
import { convertUnit, formatQuantity } from "../units";
import { splitPoundsOunces, weightUnits } from "../weight";

// The worked examples shown on the calculator and converter pages must be what the tools really produce.

function example(slug: string, index: number) {
  const item = getToolDefinition(slug)?.examples[index];
  assert.ok(item, `${slug} example ${index}`);
  return item;
}

const date = (year: number, month: number, day: number): CalendarDate => ({ year, month, day });
const TODAY = date(2026, 10, 1);

function must<T>(result: { ok: true; result: T } | { ok: false; error: string }) {
  assert.ok(result.ok, "ok" in result && !result.ok ? result.error : "");
  return (result as { ok: true; result: T }).result;
}

describe("calculator examples match the logic", () => {
  it("discount-calculator", () => {
    const percent = (value: number) => ({ type: "percent" as const, percent: value });
    const none = { secondPercent: null, taxPercent: null };

    const single = must(calculateDiscount({ priceCents: 8000, discount: percent(25), ...none }));
    assert.equal(example("discount-calculator", 0).output, `Sale price ${formatMoney(single.salePriceCents)}, you save ${formatMoney(single.savingsCents)} (${formatNumber(single.savingsPercent)}%)`);

    const stacked = must(calculateDiscount({ priceCents: 8000, discount: percent(25), secondPercent: 10, taxPercent: null }));
    assert.equal(example("discount-calculator", 1).output, `Sale price ${formatMoney(stacked.salePriceCents)}, you save ${formatMoney(stacked.savingsCents)} (${formatNumber(stacked.savingsPercent)}%)`);

    const taxed = must(calculateDiscount({ priceCents: 5999, discount: { type: "amount", cents: 1000 }, secondPercent: null, taxPercent: 8.25 }));
    assert.equal(
      example("discount-calculator", 2).output,
      `Sale price ${formatMoney(taxed.salePriceCents)}, tax ${formatMoney(taxed.taxCents)}, total ${formatMoney(taxed.totalCents)}`,
    );
  });

  it("age-calculator", () => {
    const age = must(calculateAge(date(1990, 3, 15), TODAY));
    assert.equal(example("age-calculator", 0).output, `${age.years} years, ${age.months} months, ${age.days} days (${formatNumber(age.totalDays)} days old)`);
    const next = age.nextBirthday;
    assert.equal(
      example("age-calculator", 1).output,
      `${next.weekday}, ${formatLongDate(next.date)} (in ${next.daysUntil} days, turning ${next.turning})`,
    );
    const leap = must(calculateAge(date(2000, 2, 29), date(2025, 2, 28)));
    assert.match(example("age-calculator", 2).output, new RegExp(`^${leap.years} years, ${leap.months} months, ${leap.days} days\\.`));
  });

  it("date-difference-calculator", () => {
    const diff = dateDifference(TODAY, date(2026, 12, 25), false);
    assert.equal(example("date-difference-calculator", 0).output, `${diff.months} months, ${diff.days} days (${diff.totalDays} days in total)`);
    assert.equal(diff.years, 0);

    const week = dateDifference(TODAY, date(2026, 10, 9), false);
    assert.equal(example("date-difference-calculator", 1).output, `${week.businessDays} business days (Monday to Friday, end date not counted)`);

    const added = addToDate(TODAY, 90);
    assert.ok(added.ok);
    if (added.ok) assert.equal(example("date-difference-calculator", 2).output, `${added.weekday}, ${formatLongDate(added.date)}`);
    assert.equal(weekdayName(addDays(TODAY, 90)), "Wednesday");
  });

  it("bmi-calculator", () => {
    const us = calculateBmi({ system: "us", feet: 5, inches: 9, pounds: 160 });
    const metric = calculateBmi({ system: "metric", cm: 175, kg: 70 });
    assert.ok(us.ok && metric.ok);
    if (!us.ok || !metric.ok) return;
    assert.equal(example("bmi-calculator", 0).output, `BMI ${us.result.bmi}: ${us.result.category.label}`);
    assert.equal(example("bmi-calculator", 1).output, `BMI ${metric.result.bmi}: ${metric.result.category.label}`);
    const range = us.result.healthyRange;
    assert.equal(
      example("bmi-calculator", 2).output,
      `${formatNumber(range.minLb, 1)} to ${formatNumber(range.maxLb, 1)} lb (${formatNumber(range.minKg, 1)} to ${formatNumber(range.maxKg, 1)} kg)`,
    );
  });

  it("tip-calculator", () => {
    const even = must(calculateTip({ billCents: 8640, tipPercent: 20, people: 3, roundUp: false }));
    assert.equal(
      example("tip-calculator", 0).output,
      `Tip ${formatMoney(even.tipCents)}, total ${formatMoney(even.totalCents)}, ${formatMoney(even.perPersonCents)} per person`,
    );
    const odd = must(calculateTip({ billCents: 6450, tipPercent: 18, people: 4, roundUp: false }));
    assert.equal(
      example("tip-calculator", 1).output,
      `Tip ${formatMoney(odd.tipCents)}, total ${formatMoney(odd.totalCents)}, ${formatMoney(odd.perPersonCents)} each (rounded up to the next cent)`,
    );
    const rounded = must(calculateTip({ billCents: 6450, tipPercent: 18, people: 4, roundUp: true }));
    assert.equal(
      example("tip-calculator", 2).output,
      `${formatMoney(rounded.perPersonCents)} each, ${formatMoney(rounded.paidCents)} paid, an effective tip of ${formatMoney(rounded.effectiveTipCents)} (${formatNumber(rounded.effectiveTipPercent)}%)`,
    );
  });
});

describe("converter examples match the logic", () => {
  it("length-converter", () => {
    assert.equal(example("length-converter", 0).output, `${formatQuantity(convertUnit(lengthUnits, 1, "in", "cm"))} cm`);
    assert.equal(example("length-converter", 1).output, `${formatQuantity(convertUnit(lengthUnits, 26.2, "mi", "km"))} km`);
    const inches = convertUnit(lengthUnits, 5, "ft", "in") + 9;
    assert.deepEqual(splitFeetInches(inches), { feet: 5, inches: 9 });
    assert.equal(example("length-converter", 2).output, `${formatQuantity(convertUnit(lengthUnits, inches, "in", "cm"))} cm`);
  });

  it("weight-converter", () => {
    assert.equal(example("weight-converter", 0).output, `${formatQuantity(convertUnit(weightUnits, 150, "lb", "kg"))} kg`);
    assert.equal(example("weight-converter", 1).output, `${formatQuantity(convertUnit(weightUnits, 70, "kg", "lb"))} lb`);
    const pounds = convertUnit(weightUnits, 3.5, "kg", "lb");
    const split = splitPoundsOunces(pounds);
    assert.equal(example("weight-converter", 2).output, `${formatQuantity(pounds)} lb, or ${split.pounds} lb ${split.ounces} oz`);
  });

  it("temperature-converter", () => {
    assert.equal(example("temperature-converter", 0).output, `${formatQuantity(convertTemperature(98.6, "F", "C"))} °C`);
    assert.equal(example("temperature-converter", 1).output, `${formatQuantity(convertTemperature(350, "F", "C"))} °C`);
    assert.equal(example("temperature-converter", 2).output, `${formatQuantity(convertTemperature(0, "K", "F"))} °F`);
  });

  it("data-storage-converter", () => {
    assert.equal(example("data-storage-converter", 0).output, `${formatQuantity(convertUnit(storageUnits, 1, "TB", "GiB"))} GiB`);
    assert.equal(example("data-storage-converter", 1).output, `${formatNumber(convertUnit(storageUnits, 1, "GiB", "B"), 0)} bytes`);
    const bytes = convertUnit(storageUnits, 4.7, "GB", "B");
    assert.equal(example("data-storage-converter", 2).output, formatDuration(downloadSeconds(bytes, 100)));
  });
});
