import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { randomIntBelow, shuffleInPlace, type RandomSource } from "../random";

/** Deterministic source that hands out the given 32-bit values in order. */
function sequence(...values: number[]): RandomSource {
  let index = 0;
  return (array) => {
    for (let i = 0; i < array.length; i += 1) array[i] = values[index++ % values.length];
    return array;
  };
}

describe("randomIntBelow", () => {
  it("returns a value below the bound", () => {
    assert.equal(randomIntBelow(10, sequence(25)), 5);
    assert.equal(randomIntBelow(1, sequence(123456)), 0);
  });

  it("rejects draws from the biased tail instead of using the modulo", () => {
    // 2^32 % 3 = 1, so the only biased value is 4294967295: it must be redrawn.
    assert.equal(randomIntBelow(3, sequence(4294967295, 4)), 1);
    // 2^32 % 6 = 4: the last four values are rejected.
    assert.equal(randomIntBelow(6, sequence(4294967295, 4294967292, 7)), 1);
  });

  it("is uniform enough with the real source", () => {
    const counts = Array<number>(6).fill(0);
    for (let i = 0; i < 6000; i += 1) counts[randomIntBelow(6)] += 1;
    for (const count of counts) assert.ok(count > 800 && count < 1200, `count ${count}`);
  });

  it("rejects invalid bounds", () => {
    for (const bad of [0, -1, 1.5, 2 ** 32 + 1, Number.NaN]) assert.throws(() => randomIntBelow(bad), RangeError, String(bad));
  });
});

describe("shuffleInPlace", () => {
  it("keeps every element exactly once", () => {
    const items = Array.from({ length: 50 }, (_, index) => index);
    const shuffled = shuffleInPlace([...items]);
    assert.deepEqual([...shuffled].sort((a, b) => a - b), items);
  });

  it("is deterministic for a fixed source", () => {
    assert.deepEqual(shuffleInPlace(["a", "b", "c", "d"], sequence(0, 0, 0)), ["b", "c", "d", "a"]);
  });
});
