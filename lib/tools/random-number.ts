// Random numbers from a cryptographic source, with an unbiased draw (see random.ts).
// Decimals work on a fixed grid: with 2 places, 1.25 to 1.75 holds 51 equally likely values.

import { cryptoSource, randomIntBelow, type RandomSource } from "./random";

export type SortOrder = "none" | "asc" | "desc";

export type NumberOptions = {
  min: number;
  max: number;
  count: number;
  unique: boolean;
  /** Decimal places, 0 for integers. */
  decimals: number;
  sort: SortOrder;
};

export type NumberResult = { ok: true; values: string[] } | { ok: false; error: string };

export const MAX_ABS = 1_000_000_000;
export const MAX_COUNT = 1000;
export const MAX_DECIMALS = 6;
const MAX_SPAN = 2 ** 32;

function validate(options: NumberOptions): { error: string } | { low: number; span: number; factor: number } {
  const { min, max, count, decimals } = options;
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { error: "Enter valid numbers for the minimum and maximum." };
  if (Math.abs(min) > MAX_ABS || Math.abs(max) > MAX_ABS) {
    return { error: "Minimum and maximum must be between -1,000,000,000 and 1,000,000,000." };
  }
  if (min > max) return { error: "The minimum cannot be greater than the maximum." };
  if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) {
    return { error: "Count must be a whole number between 1 and 1,000." };
  }
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > MAX_DECIMALS) {
    return { error: "Decimal places must be a whole number between 0 and 6." };
  }
  const factor = 10 ** decimals;
  const low = Math.ceil(min * factor - 1e-9);
  const high = Math.floor(max * factor + 1e-9);
  const span = high - low + 1;
  if (span < 1) return { error: "No value fits between the minimum and maximum with that many decimal places." };
  if (span > MAX_SPAN) return { error: "The range is too large for that many decimal places. Narrow it or use fewer decimals." };
  return { low, span, factor };
}

export function generateNumbers(options: NumberOptions, source: RandomSource = cryptoSource): NumberResult {
  const checked = validate(options);
  if ("error" in checked) return { ok: false, error: checked.error };
  const { low, span, factor } = checked;
  const { count, unique, decimals, sort } = options;

  if (unique && count > span) {
    return {
      ok: false,
      error: `Cannot pick ${count} unique numbers from a range that only holds ${span.toLocaleString("en-US")} values. Widen the range or lower the count.`,
    };
  }

  const drawn: number[] = [];
  const seen = new Set<number>();
  while (drawn.length < count) {
    const value = low + randomIntBelow(span, source);
    if (unique) {
      if (seen.has(value)) continue;
      seen.add(value);
    }
    drawn.push(value);
  }
  if (sort === "asc") drawn.sort((a, b) => a - b);
  if (sort === "desc") drawn.sort((a, b) => b - a);

  return { ok: true, values: drawn.map((value) => (value / factor).toFixed(decimals)) };
}
