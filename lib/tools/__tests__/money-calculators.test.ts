import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateDiscount } from "../discount";
import { formatMoney, parseMoney, percentOfCents } from "../money";
import { calculateTip } from "../tip";

function ok<T extends { ok: boolean }>(result: T) {
  assert.equal(result.ok, true, JSON.stringify(result));
  return result as Extract<T, { ok: true }>;
}

function fail<T extends { ok: boolean }>(result: T) {
  assert.equal(result.ok, false);
  return result as Extract<T, { ok: false }>;
}

describe("money helpers", () => {
  it("parses dollar amounts into exact cents", () => {
    assert.deepEqual(parseMoney("19.99"), { ok: true, cents: 1999 });
    assert.deepEqual(parseMoney("$1,234.50"), { ok: true, cents: 123450 });
    assert.deepEqual(parseMoney("0.1"), { ok: true, cents: 10 });
    assert.deepEqual(parseMoney("5"), { ok: true, cents: 500 });
    assert.deepEqual(parseMoney(".5"), { ok: true, cents: 50 });
    assert.deepEqual(parseMoney("0"), { ok: true, cents: 0 });
    // 1.005 * 100 is 100.49999999999999 in binary floating point: digits must not go through floats.
    assert.deepEqual(parseMoney("1.10"), { ok: true, cents: 110 });
    assert.deepEqual(parseMoney("4.35"), { ok: true, cents: 435 });
  });

  it("rejects bad amounts with a reason", () => {
    assert.match(fail(parseMoney("abc")).error, /number/i);
    assert.match(fail(parseMoney("-5")).error, /or more|negative/i);
    assert.match(fail(parseMoney("1.999")).error, /2 decimal/i);
    assert.match(fail(parseMoney("1e5")).error, /number/i);
    assert.match(fail(parseMoney("9999999999")).error, /too large/i);
  });

  it("formats cents as US dollars", () => {
    assert.equal(formatMoney(123456), "$1,234.56");
    assert.equal(formatMoney(5), "$0.05");
    assert.equal(formatMoney(0), "$0.00");
    assert.equal(formatMoney(-250), "-$2.50");
  });

  it("takes a percentage of cents, rounding half up", () => {
    assert.equal(percentOfCents(4999, 8.25), 412);
    assert.equal(percentOfCents(5400, 8.25), 446);
    assert.equal(percentOfCents(1999, 15), 300);
    assert.equal(percentOfCents(10000, 12.5), 1250);
    assert.equal(percentOfCents(1, 50), 1);
    assert.equal(percentOfCents(0, 20), 0);
  });
});

describe("calculateDiscount", () => {
  const base = { priceCents: 8000, taxPercent: null, secondPercent: null };

  it("applies a percentage discount", () => {
    const result = ok(calculateDiscount({ ...base, discount: { type: "percent", percent: 25 } })).result;
    assert.equal(result.firstDiscountCents, 2000);
    assert.equal(result.salePriceCents, 6000);
    assert.equal(result.savingsCents, 2000);
    assert.equal(result.savingsPercent, 25);
    assert.equal(result.taxCents, 0);
    assert.equal(result.totalCents, 6000);
  });

  it("applies an amount off", () => {
    const result = ok(calculateDiscount({ ...base, priceCents: 5999, discount: { type: "amount", cents: 1000 }, taxPercent: 8.25 })).result;
    assert.equal(result.salePriceCents, 4999);
    assert.equal(result.taxCents, 412);
    assert.equal(result.totalCents, 5411);
  });

  it("stacks a second discount on the reduced price, not the original", () => {
    const stacked = ok(calculateDiscount({ ...base, discount: { type: "percent", percent: 25 }, secondPercent: 10 })).result;
    assert.equal(stacked.secondDiscountCents, 600);
    assert.equal(stacked.salePriceCents, 5400);
    assert.equal(stacked.savingsCents, 2600);
    assert.equal(stacked.savingsPercent, 32.5);

    const twice = ok(calculateDiscount({ ...base, priceCents: 10000, discount: { type: "percent", percent: 20 }, secondPercent: 20 })).result;
    assert.equal(twice.salePriceCents, 6400);
    assert.equal(twice.savingsPercent, 36);
  });

  it("charges sales tax after the discounts", () => {
    const result = ok(calculateDiscount({ ...base, discount: { type: "percent", percent: 25 }, secondPercent: 10, taxPercent: 8.25 })).result;
    assert.equal(result.taxCents, 446);
    assert.equal(result.totalCents, 5846);
  });

  it("allows a 100% discount and a zero discount", () => {
    assert.equal(ok(calculateDiscount({ ...base, discount: { type: "percent", percent: 100 } })).result.totalCents, 0);
    const none = ok(calculateDiscount({ ...base, discount: { type: "percent", percent: 0 } })).result;
    assert.equal(none.salePriceCents, 8000);
    assert.equal(none.savingsPercent, 0);
  });

  it("explains invalid input", () => {
    assert.match(fail(calculateDiscount({ ...base, priceCents: 0, discount: { type: "percent", percent: 10 } })).error, /price/i);
    assert.match(fail(calculateDiscount({ ...base, discount: { type: "percent", percent: 101 } })).error, /100%/);
    assert.match(fail(calculateDiscount({ ...base, discount: { type: "percent", percent: -5 } })).error, /0%/);
    assert.match(fail(calculateDiscount({ ...base, discount: { type: "amount", cents: 8001 } })).error, /more than the price/i);
    assert.match(fail(calculateDiscount({ ...base, discount: { type: "percent", percent: 10 }, secondPercent: 150 })).error, /second/i);
    assert.match(fail(calculateDiscount({ ...base, discount: { type: "percent", percent: 10 }, taxPercent: 45 })).error, /tax/i);
    assert.match(fail(calculateDiscount({ ...base, discount: { type: "percent", percent: Number.NaN } })).error, /discount/i);
  });
});

describe("calculateTip", () => {
  it("splits an even bill", () => {
    const result = ok(calculateTip({ billCents: 8640, tipPercent: 20, people: 3, roundUp: false })).result;
    assert.equal(result.tipCents, 1728);
    assert.equal(result.totalCents, 10368);
    assert.equal(result.perPersonCents, 3456);
    assert.equal(result.extraCents, 0);
  });

  it("rounds the share up to the next cent so the table covers the bill", () => {
    const result = ok(calculateTip({ billCents: 6450, tipPercent: 18, people: 4, roundUp: false })).result;
    assert.equal(result.tipCents, 1161);
    assert.equal(result.totalCents, 7611);
    assert.equal(result.perPersonCents, 1903);
    assert.equal(result.extraCents, 1);
  });

  it("can round each share up to a whole dollar and reports the effective tip", () => {
    const result = ok(calculateTip({ billCents: 6450, tipPercent: 18, people: 4, roundUp: true })).result;
    assert.equal(result.perPersonCents, 2000);
    assert.equal(result.paidCents, 8000);
    assert.equal(result.extraCents, 389);
    assert.equal(result.effectiveTipCents, 1550);
    assert.equal(result.effectiveTipPercent, 24.03);
  });

  it("handles a single person and a zero tip", () => {
    const result = ok(calculateTip({ billCents: 4250, tipPercent: 0, people: 1, roundUp: false })).result;
    assert.equal(result.tipCents, 0);
    assert.equal(result.perPersonCents, 4250);
  });

  it("explains invalid input", () => {
    assert.match(fail(calculateTip({ billCents: 0, tipPercent: 15, people: 2, roundUp: false })).error, /bill/i);
    assert.match(fail(calculateTip({ billCents: 1000, tipPercent: -1, people: 2, roundUp: false })).error, /tip/i);
    assert.match(fail(calculateTip({ billCents: 1000, tipPercent: 101, people: 2, roundUp: false })).error, /tip/i);
    assert.match(fail(calculateTip({ billCents: 1000, tipPercent: 15, people: 0, roundUp: false })).error, /people/i);
    assert.match(fail(calculateTip({ billCents: 1000, tipPercent: 15, people: 2.5, roundUp: false })).error, /people/i);
    assert.match(fail(calculateTip({ billCents: 1000, tipPercent: 15, people: 101, roundUp: false })).error, /people/i);
    assert.match(fail(calculateTip({ billCents: 1000, tipPercent: Number.NaN, people: 2, roundUp: false })).error, /tip/i);
  });
});
