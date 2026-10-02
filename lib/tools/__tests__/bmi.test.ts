import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bmiCategory, calculateBmi } from "../bmi";

const closeTo = (actual: number, expected: number, tolerance: number) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);

describe("bmiCategory", () => {
  it("uses the standard adult ranges", () => {
    assert.equal(bmiCategory(15).key, "underweight");
    assert.equal(bmiCategory(18.4).key, "underweight");
    assert.equal(bmiCategory(18.5).key, "healthy");
    assert.equal(bmiCategory(24.9).key, "healthy");
    assert.equal(bmiCategory(25).key, "overweight");
    assert.equal(bmiCategory(29.9).key, "overweight");
    assert.equal(bmiCategory(30).key, "obesity");
    assert.equal(bmiCategory(42).key, "obesity");
  });

  it("labels the ranges", () => {
    assert.equal(bmiCategory(22).label, "Healthy weight");
    assert.equal(bmiCategory(22).range, "18.5 to 24.9");
  });
});

describe("calculateBmi", () => {
  it("calculates from metric units", () => {
    const result = calculateBmi({ system: "metric", cm: 175, kg: 70 });
    assert.ok(result.ok);
    if (!result.ok) return;
    assert.equal(result.result.bmi, 22.9);
    assert.equal(result.result.category.key, "healthy");
  });

  it("calculates from US units", () => {
    const result = calculateBmi({ system: "us", feet: 5, inches: 9, pounds: 160 });
    assert.ok(result.ok);
    if (!result.ok) return;
    assert.equal(result.result.bmi, 23.6);
    assert.equal(result.result.category.key, "healthy");
  });

  it("gives the same answer for the same person in either system", () => {
    const us = calculateBmi({ system: "us", feet: 6, inches: 0, pounds: 200 });
    const metric = calculateBmi({ system: "metric", cm: 182.88, kg: 90.718474 });
    assert.ok(us.ok && metric.ok);
    if (us.ok && metric.ok) assert.equal(us.result.bmi, metric.result.bmi);
  });

  it("categorizes the BMI as displayed, rounded to one decimal", () => {
    const result = calculateBmi({ system: "metric", cm: 170, kg: 72.13 });
    assert.ok(result.ok);
    if (!result.ok) return;
    assert.equal(result.result.bmi, 25);
    assert.equal(result.result.category.key, "overweight");
  });

  it("gives the healthy weight range for the height in both units", () => {
    const result = calculateBmi({ system: "metric", cm: 175, kg: 70 });
    assert.ok(result.ok);
    if (!result.ok) return;
    const range = result.result.healthyRange;
    closeTo(range.minKg, 56.656, 0.001);
    closeTo(range.maxKg, 76.256, 0.001);
    closeTo(range.minLb, 124.9, 0.1);
    closeTo(range.maxLb, 168.1, 0.1);
  });

  it("matches the 703 formula used by the CDC for US units", () => {
    const result = calculateBmi({ system: "us", feet: 5, inches: 9, pounds: 160 });
    assert.ok(result.ok);
    if (!result.ok) return;
    closeTo(result.result.healthyRange.minLb, (18.5 * 69 * 69) / 703, 0.1);
    closeTo(result.result.healthyRange.maxLb, (24.9 * 69 * 69) / 703, 0.1);
  });

  it("treats blank inches as zero", () => {
    const result = calculateBmi({ system: "us", feet: 6, inches: null, pounds: 180 });
    assert.ok(result.ok);
  });

  it("asks for missing values", () => {
    const empty = calculateBmi({ system: "metric", cm: null, kg: null });
    assert.equal(empty.ok, false);
    if (!empty.ok) assert.deepEqual(Object.keys(empty.errors).sort(), ["height", "weight"]);
    const usEmpty = calculateBmi({ system: "us", feet: null, inches: null, pounds: 150 });
    assert.equal(usEmpty.ok, false);
    if (!usEmpty.ok) assert.deepEqual(Object.keys(usEmpty.errors), ["height"]);
  });

  it("rejects values outside a plausible adult range, naming the unit", () => {
    const short = calculateBmi({ system: "metric", cm: 30, kg: 70 });
    assert.equal(short.ok, false);
    if (!short.ok) assert.match(short.errors.height ?? "", /cm/);
    const light = calculateBmi({ system: "metric", cm: 170, kg: 5 });
    assert.equal(light.ok, false);
    if (!light.ok) assert.match(light.errors.weight ?? "", /kg/);
    const usShort = calculateBmi({ system: "us", feet: 2, inches: 0, pounds: 150 });
    assert.equal(usShort.ok, false);
    if (!usShort.ok) assert.match(usShort.errors.height ?? "", /ft/);
    const heavy = calculateBmi({ system: "us", feet: 5, inches: 9, pounds: 5000 });
    assert.equal(heavy.ok, false);
    if (!heavy.ok) assert.match(heavy.errors.weight ?? "", /lb/);
  });

  it("rejects negative numbers and inches of 12 or more", () => {
    const negative = calculateBmi({ system: "metric", cm: -170, kg: 70 });
    assert.equal(negative.ok, false);
    const inches = calculateBmi({ system: "us", feet: 5, inches: 12, pounds: 150 });
    assert.equal(inches.ok, false);
    if (!inches.ok) assert.match(inches.errors.height ?? "", /less than 12/);
  });
});
