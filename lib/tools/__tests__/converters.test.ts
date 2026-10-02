import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { downloadSeconds, formatDuration, storageUnits } from "../data-storage";
import { lengthUnits, splitFeetInches } from "../length";
import { convertTemperature, temperatureFormula, validateTemperature } from "../temperature";
import { convertAll, convertUnit, formatQuantity, type UnitDef } from "../units";
import { splitPoundsOunces, weightUnits } from "../weight";

const closeTo = (actual: number, expected: number, relative = 1e-9) =>
  assert.ok(Math.abs(actual - expected) <= Math.abs(expected) * relative, `${actual} is not close to ${expected}`);

describe("convertUnit", () => {
  it("uses exact length factors", () => {
    assert.equal(convertUnit(lengthUnits, 1, "in", "cm"), 2.54);
    assert.equal(convertUnit(lengthUnits, 1, "ft", "in"), 12);
    assert.equal(convertUnit(lengthUnits, 1, "yd", "ft"), 3);
    assert.equal(convertUnit(lengthUnits, 1, "mi", "m"), 1609.344);
    assert.equal(convertUnit(lengthUnits, 1, "nmi", "m"), 1852);
    assert.equal(convertUnit(lengthUnits, 1, "km", "m"), 1000);
    assert.equal(convertUnit(lengthUnits, 5280, "ft", "mi"), 1);
    assert.equal(convertUnit(lengthUnits, 10, "mm", "cm"), 1);
  });

  it("uses exact weight factors", () => {
    assert.equal(convertUnit(weightUnits, 1, "lb", "kg"), 0.45359237);
    assert.equal(convertUnit(weightUnits, 1, "lb", "oz"), 16);
    assert.equal(convertUnit(weightUnits, 1, "st", "lb"), 14);
    assert.equal(convertUnit(weightUnits, 1, "ton", "lb"), 2000);
    assert.equal(convertUnit(weightUnits, 1, "t", "kg"), 1000);
    assert.equal(convertUnit(weightUnits, 1, "kg", "mg"), 1_000_000);
    assert.equal(convertUnit(weightUnits, 1, "oz", "g"), 28.349523125);
  });

  it("uses decimal and binary data sizes", () => {
    assert.equal(convertUnit(storageUnits, 1, "B", "bit"), 8);
    assert.equal(convertUnit(storageUnits, 1, "KB", "B"), 1000);
    assert.equal(convertUnit(storageUnits, 1, "KiB", "B"), 1024);
    assert.equal(convertUnit(storageUnits, 1, "GiB", "B"), 1_073_741_824);
    assert.equal(convertUnit(storageUnits, 1, "PB", "TB"), 1000);
    assert.equal(convertUnit(storageUnits, 1, "TiB", "GiB"), 1024);
    closeTo(convertUnit(storageUnits, 1, "TB", "GiB"), 931.3225746154785, 1e-9);
  });

  it("round-trips every pair of units", () => {
    for (const units of [lengthUnits, weightUnits, storageUnits]) {
      for (const from of units) {
        for (const to of units) {
          const there = convertUnit(units, 123.456, from.key, to.key);
          closeTo(convertUnit(units, there, to.key, from.key), 123.456);
        }
      }
    }
  });

  it("converts zero to zero and keeps the sign out of the way", () => {
    assert.equal(convertUnit(lengthUnits, 0, "mi", "km"), 0);
  });

  it("lists every unit in the all-units table", () => {
    const all = convertAll(lengthUnits, 1, "ft");
    assert.deepEqual(
      all.map((row) => row.key),
      lengthUnits.map((unit) => unit.key),
    );
    assert.equal(all.find((row) => row.key === "in")?.value, 12);
    assert.equal(all.find((row) => row.key === "ft")?.value, 1);
  });

  it("throws on an unknown unit instead of guessing", () => {
    const units: UnitDef[] = [{ key: "a", label: "A", symbol: "a", factor: 1 }];
    assert.throws(() => convertUnit(units, 1, "a", "zzz"));
  });
});

describe("formatQuantity", () => {
  it("keeps sensible significant digits and strips float noise", () => {
    assert.equal(formatQuantity(2.54), "2.54");
    assert.equal(formatQuantity(0.1 + 0.2), "0.3");
    assert.equal(formatQuantity(1234567.891), "1,234,568");
    assert.equal(formatQuantity(931.3225746154785), "931.3226");
    assert.equal(formatQuantity(0), "0");
    assert.equal(formatQuantity(-2.5), "-2.5");
    assert.equal(formatQuantity(0.000123456789), "0.0001234568");
  });

  it("switches to exponent notation for extreme values", () => {
    assert.equal(formatQuantity(1e-9), "1e-9");
    assert.equal(formatQuantity(1.5e21), "1.5e+21");
  });

  it("shows a dash for non-finite values", () => {
    assert.equal(formatQuantity(Number.NaN), "—");
    assert.equal(formatQuantity(Number.POSITIVE_INFINITY), "—");
  });
});

describe("combined units", () => {
  it("splits inches into feet and inches", () => {
    assert.deepEqual(splitFeetInches(69), { feet: 5, inches: 9 });
    assert.deepEqual(splitFeetInches(0), { feet: 0, inches: 0 });
    assert.deepEqual(splitFeetInches(5.5), { feet: 0, inches: 5.5 });
    assert.deepEqual(splitFeetInches(70.25), { feet: 5, inches: 10.3 });
  });

  it("carries a rounded-up 12 inches into the next foot", () => {
    assert.deepEqual(splitFeetInches(71.96), { feet: 6, inches: 0 });
  });

  it("splits pounds into pounds and ounces", () => {
    assert.deepEqual(splitPoundsOunces(8.8125), { pounds: 8, ounces: 13 });
    assert.deepEqual(splitPoundsOunces(0.5), { pounds: 0, ounces: 8 });
    assert.deepEqual(splitPoundsOunces(1.99999), { pounds: 2, ounces: 0 });
  });
});

describe("temperature", () => {
  it("converts the well-known fixed points", () => {
    assert.equal(convertTemperature(100, "C", "F"), 212);
    assert.equal(convertTemperature(0, "C", "F"), 32);
    assert.equal(convertTemperature(32, "F", "C"), 0);
    assert.equal(convertTemperature(-40, "C", "F"), -40);
    assert.equal(convertTemperature(-40, "F", "C"), -40);
    assert.equal(convertTemperature(0, "K", "C"), -273.15);
    assert.equal(convertTemperature(0, "K", "F"), -459.67);
    assert.equal(convertTemperature(98.6, "F", "C"), 37);
    assert.equal(convertTemperature(491.67, "R", "C"), 0);
    assert.equal(convertTemperature(25, "C", "K"), 298.15);
    assert.equal(convertTemperature(77, "F", "F"), 77);
  });

  it("round-trips through every pair", () => {
    const keys = ["C", "F", "K", "R"] as const;
    for (const from of keys) {
      for (const to of keys) {
        const back = convertTemperature(convertTemperature(37.5, from, to), to, from);
        closeTo(back, 37.5);
      }
    }
  });

  it("rejects values below absolute zero", () => {
    assert.match(validateTemperature(-300, "C") ?? "", /absolute zero/i);
    assert.match(validateTemperature(-1, "K") ?? "", /absolute zero/i);
    assert.match(validateTemperature(-459.68, "F") ?? "", /absolute zero/i);
    assert.match(validateTemperature(-1, "R") ?? "", /absolute zero/i);
  });

  it("accepts absolute zero and ordinary negatives", () => {
    assert.equal(validateTemperature(-273.15, "C"), undefined);
    assert.equal(validateTemperature(-459.67, "F"), undefined);
    assert.equal(validateTemperature(0, "K"), undefined);
    assert.equal(validateTemperature(-40, "F"), undefined);
  });

  it("states the formula used", () => {
    assert.equal(temperatureFormula("C", "F"), "°F = °C × 9/5 + 32");
    assert.equal(temperatureFormula("F", "C"), "°C = (°F − 32) × 5/9");
    assert.equal(temperatureFormula("C", "K"), "K = °C + 273.15");
    assert.equal(temperatureFormula("K", "F"), "°F = K × 9/5 − 459.67");
    assert.match(temperatureFormula("F", "F"), /same unit/i);
  });
});

describe("download time", () => {
  it("divides bits by megabits per second", () => {
    assert.equal(downloadSeconds(4_700_000_000, 100), 376);
    assert.equal(downloadSeconds(1_000_000, 8), 1);
  });

  it("formats durations compactly", () => {
    assert.equal(formatDuration(376), "6 min 16 s");
    assert.equal(formatDuration(45), "45 s");
    assert.equal(formatDuration(3725), "1 h 2 min 5 s");
    assert.equal(formatDuration(3600), "1 h");
    assert.equal(formatDuration(90061), "1 d 1 h");
    assert.equal(formatDuration(0.4), "less than 1 s");
  });
});
