import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AMBIGUOUS,
  characterSets,
  entropyBits,
  generatePasswords,
  poolSize,
  strengthLabel,
  type PasswordOptions,
} from "../password";

const base: PasswordOptions = { length: 16, upper: true, lower: true, digits: true, symbols: true, excludeAmbiguous: false };

describe("poolSize and entropyBits", () => {
  it("counts the characters of the enabled sets", () => {
    assert.equal(poolSize({ ...base, upper: false, digits: false, symbols: false }), 26);
    assert.equal(poolSize({ ...base, symbols: false }), 62);
    assert.equal(poolSize({ ...base, symbols: false, excludeAmbiguous: true }), 62 - AMBIGUOUS.length);
  });

  it("estimates entropy as length x log2(pool)", () => {
    const bits = entropyBits({ ...base, length: 10, upper: false, digits: false, symbols: false });
    assert.ok(Math.abs(bits - 10 * Math.log2(26)) < 1e-9);
    assert.equal(entropyBits({ ...base, upper: false, lower: false, digits: false, symbols: false }), 0);
  });
});

describe("strengthLabel", () => {
  it("maps entropy to a label", () => {
    assert.equal(strengthLabel(20), "Weak");
    assert.equal(strengthLabel(45), "Fair");
    assert.equal(strengthLabel(70), "Strong");
    assert.equal(strengthLabel(120), "Very strong");
  });
});

describe("generatePasswords", () => {
  it("builds passwords of the requested length from the chosen sets", () => {
    const result = generatePasswords(base, 5);
    assert.ok(result.ok);
    if (result.ok) {
      assert.equal(result.passwords.length, 5);
      for (const password of result.passwords) assert.equal([...password].length, 16);
    }
  });

  it("always includes at least one character of every selected set", () => {
    const options: PasswordOptions = { ...base, length: 8 };
    for (let i = 0; i < 300; i += 1) {
      const result = generatePasswords(options, 1);
      assert.ok(result.ok);
      if (result.ok) {
        const password = result.passwords[0];
        for (const set of [characterSets.upper, characterSets.lower, characterSets.digits, characterSets.symbols]) {
          assert.ok([...password].some((char) => set.includes(char)), password);
        }
      }
    }
  });

  it("only uses characters from the selected sets", () => {
    const result = generatePasswords({ ...base, upper: false, symbols: false, length: 64 }, 1);
    assert.ok(result.ok);
    if (result.ok) assert.match(result.passwords[0], /^[a-z0-9]+$/);
  });

  it("can exclude ambiguous characters", () => {
    for (let i = 0; i < 100; i += 1) {
      const result = generatePasswords({ ...base, length: 128, excludeAmbiguous: true }, 1);
      assert.ok(result.ok);
      if (result.ok) for (const char of AMBIGUOUS) assert.ok(!result.passwords[0].includes(char), char);
    }
  });

  it("uses the injected random source (no hidden state)", () => {
    const zeros = (array: Uint32Array) => array.fill(0);
    const a = generatePasswords({ ...base, length: 12 }, 1, zeros);
    const b = generatePasswords({ ...base, length: 12 }, 1, zeros);
    assert.deepEqual(a, b);
  });

  it("validates the options", () => {
    const cases: [Partial<PasswordOptions>, RegExp][] = [
      [{ length: 7 }, /8 and 128/],
      [{ length: 129 }, /8 and 128/],
      [{ length: 10.5 }, /8 and 128/],
      [{ upper: false, lower: false, digits: false, symbols: false }, /at least one/i],
    ];
    for (const [patch, pattern] of cases) {
      const result = generatePasswords({ ...base, ...patch }, 1);
      assert.equal(result.ok, false);
      if (!result.ok) assert.match(result.error, pattern);
    }
    const count = generatePasswords(base, 0);
    assert.equal(count.ok, false);
    assert.equal(generatePasswords(base, 21).ok, false);
  });
});
