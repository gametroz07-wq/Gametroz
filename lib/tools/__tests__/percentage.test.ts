import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decreaseByPercent,
  formatNumber,
  increaseByPercent,
  parseNumber,
  percentChange,
  percentOf,
  whatPercent,
} from "../percentage";

describe("percentage maths", () => {
  it("computes X% of Y without float noise", () => {
    assert.equal(percentOf(15, 240), 36);
    assert.equal(percentOf(0.1, 3), 0.003);
    assert.equal(percentOf(7, 0.1), 0.007);
  });

  it("computes what percent X is of Y", () => {
    assert.equal(whatPercent(45, 180), 25);
    assert.equal(whatPercent(1, 3), 33.3333333333);
    assert.equal(whatPercent(5, 0), null);
  });

  it("computes the percentage change and its direction", () => {
    assert.deepEqual(percentChange(80, 100), { percent: 25, direction: "increase" });
    assert.deepEqual(percentChange(100, 75), { percent: -25, direction: "decrease" });
    assert.deepEqual(percentChange(50, 50), { percent: 0, direction: "none" });
    assert.equal(percentChange(0, 10), null);
  });

  it("uses the absolute starting value so negative bases keep a sensible sign", () => {
    assert.deepEqual(percentChange(-10, -5), { percent: 50, direction: "increase" });
  });

  it("increases and decreases a value by a percentage", () => {
    assert.equal(increaseByPercent(200, 15), 230);
    assert.equal(decreaseByPercent(200, 15), 170);
    assert.equal(decreaseByPercent(19.99, 20), 15.992);
  });
});

describe("parseNumber", () => {
  it("parses plain, signed, decimal and comma-grouped numbers", () => {
    assert.equal(parseNumber("42"), 42);
    assert.equal(parseNumber(" -3.5 "), -3.5);
    assert.equal(parseNumber("1,234.5"), 1234.5);
    assert.equal(parseNumber(".5"), 0.5);
  });

  it("rejects empty or non-numeric input", () => {
    for (const text of ["", "  ", "abc", "1e", "--1", "1.2.3", "Infinity", "12abc"]) {
      assert.equal(parseNumber(text), null, text);
    }
  });
});

describe("formatNumber", () => {
  it("groups thousands and trims trailing zeros", () => {
    assert.equal(formatNumber(1234567.891), "1,234,567.89");
    assert.equal(formatNumber(36), "36");
    assert.equal(formatNumber(0.5), "0.5");
  });

  it("supports more decimals and never prints negative zero", () => {
    assert.equal(formatNumber(1 / 3, 4), "0.3333");
    assert.equal(formatNumber(-0.0001), "0");
  });
});
