import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateNumbers, type NumberOptions } from "../random-number";

const base: NumberOptions = { min: 1, max: 6, count: 1, unique: false, decimals: 0, sort: "none" };

function numbers(options: Partial<NumberOptions>) {
  const result = generateNumbers({ ...base, ...options });
  assert.ok(result.ok, result.ok ? "" : result.error);
  return result.ok ? result.values : [];
}

describe("generateNumbers", () => {
  it("draws inclusive integers in range and hits both ends", () => {
    const values = numbers({ count: 1000 });
    assert.equal(values.length, 1000);
    for (const value of values) assert.match(value, /^[1-6]$/);
    assert.ok(values.includes("1") && values.includes("6"));
  });

  it("supports a single-value range and negative ranges", () => {
    assert.deepEqual(numbers({ min: 7, max: 7, count: 3 }), ["7", "7", "7"]);
    for (const value of numbers({ min: -5, max: -1, count: 200 })) assert.ok(Number(value) >= -5 && Number(value) <= -1);
  });

  it("returns every value once for a full unique range", () => {
    const values = numbers({ min: 1, max: 10, count: 10, unique: true, sort: "asc" });
    assert.deepEqual(values, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
  });

  it("keeps unique values distinct", () => {
    const values = numbers({ min: 1, max: 50, count: 40, unique: true });
    assert.equal(new Set(values).size, 40);
  });

  it("explains when unique values are impossible", () => {
    const result = generateNumbers({ ...base, count: 7, unique: true });
    assert.deepEqual(result, { ok: false, error: "Cannot pick 7 unique numbers from a range that only holds 6 values. Widen the range or lower the count." });
  });

  it("sorts ascending or descending", () => {
    const asc = numbers({ min: 1, max: 1000, count: 50, sort: "asc" }).map(Number);
    assert.deepEqual(asc, [...asc].sort((a, b) => a - b));
    const desc = numbers({ min: 1, max: 1000, count: 50, sort: "desc" }).map(Number);
    assert.deepEqual(desc, [...desc].sort((a, b) => b - a));
  });

  it("generates decimals with a fixed number of places, inclusive of both ends", () => {
    const values = numbers({ min: 0, max: 1, decimals: 1, count: 500 });
    for (const value of values) assert.match(value, /^(0\.\d|1\.0)$/);
    assert.ok(values.includes("0.0") && values.includes("1.0"));
    for (const value of numbers({ min: 1.25, max: 1.75, decimals: 2, count: 100 })) assert.ok(Number(value) >= 1.25 && Number(value) <= 1.75, value);
  });

  it("uses the injected source with rejection sampling", () => {
    // range of 3 values: 4294967295 is rejected, then 4 % 3 = 1 -> min + 1.
    let calls = 0;
    const source = (array: Uint32Array) => {
      array[0] = calls++ === 0 ? 4294967295 : 4;
      return array;
    };
    assert.deepEqual(generateNumbers({ ...base, min: 10, max: 12 }, source), { ok: true, values: ["11"] });
    assert.equal(calls, 2);
  });

  it("validates the inputs", () => {
    const cases: [Partial<NumberOptions>, RegExp][] = [
      [{ min: 5, max: 4 }, /minimum.*maximum/i],
      [{ min: Number.NaN }, /valid numbers/i],
      [{ min: -2_000_000_000 }, /1,000,000,000/],
      [{ count: 0 }, /1 and 1,000/],
      [{ count: 1001 }, /1 and 1,000/],
      [{ count: 2.5 }, /1 and 1,000/],
      [{ decimals: 7 }, /0 and 6/],
      [{ decimals: 1.5 }, /0 and 6/],
      [{ min: 0, max: 1_000_000_000, decimals: 6 }, /too large/i],
      [{ min: 0.5, max: 0.6 }, /no value/i],
    ];
    for (const [patch, pattern] of cases) {
      const result = generateNumbers({ ...base, ...patch });
      assert.equal(result.ok, false, JSON.stringify(patch));
      if (!result.ok) assert.match(result.error, pattern, JSON.stringify(patch));
    }
  });
});
