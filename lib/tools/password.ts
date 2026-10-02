// Password generation with crypto randomness. Every character is drawn with rejection sampling
// (no modulo bias), each selected set is guaranteed at least once, and the result is shuffled.

import { cryptoSource, randomIntBelow, shuffleInPlace, type RandomSource } from "./random";

export const characterSets = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/~",
} as const;

/** Characters that are easy to confuse when read aloud or typed from print. */
export const AMBIGUOUS = "Il1O0o";

export const MIN_LENGTH = 8;
export const MAX_LENGTH = 128;
export const MAX_PASSWORDS = 20;

export type PasswordOptions = {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
};

export type PasswordResult = { ok: true; passwords: string[] } | { ok: false; error: string };
export type Strength = "Weak" | "Fair" | "Strong" | "Very strong";

function activeSets(options: PasswordOptions): string[] {
  const keys = (["upper", "lower", "digits", "symbols"] as const).filter((key) => options[key]);
  return keys.map((key) => {
    const set: string = characterSets[key];
    return options.excludeAmbiguous ? [...set].filter((char) => !AMBIGUOUS.includes(char)).join("") : set;
  });
}

export function poolSize(options: PasswordOptions): number {
  return activeSets(options).reduce((total, set) => total + set.length, 0);
}

/** Entropy of a uniformly random string over the pool. The one-of-each rule lowers it slightly. */
export function entropyBits(options: PasswordOptions): number {
  const size = poolSize(options);
  return size > 1 ? options.length * Math.log2(size) : 0;
}

export function strengthLabel(bits: number): Strength {
  if (bits < 40) return "Weak";
  if (bits < 60) return "Fair";
  if (bits < 80) return "Strong";
  return "Very strong";
}

function validate(options: PasswordOptions, count: number): string | null {
  if (!Number.isInteger(options.length) || options.length < MIN_LENGTH || options.length > MAX_LENGTH) {
    return `Length must be a whole number between ${MIN_LENGTH} and ${MAX_LENGTH}.`;
  }
  if (activeSets(options).length === 0) return "Select at least one character type.";
  if (!Number.isInteger(count) || count < 1 || count > MAX_PASSWORDS) {
    return `Choose between 1 and ${MAX_PASSWORDS} passwords.`;
  }
  return null;
}

export function generatePasswords(options: PasswordOptions, count: number, source: RandomSource = cryptoSource): PasswordResult {
  const problem = validate(options, count);
  if (problem) return { ok: false, error: problem };

  const sets = activeSets(options);
  const pool = [...sets.join("")];
  const passwords = Array.from({ length: count }, () => {
    const chars = sets.map((set) => set[randomIntBelow(set.length, source)]);
    while (chars.length < options.length) chars.push(pool[randomIntBelow(pool.length, source)]);
    return shuffleInPlace(chars, source).join("");
  });
  return { ok: true, passwords };
}
