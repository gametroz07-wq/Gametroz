// Pure percentage maths for the Percentage Calculator.

/** Rounds away binary float noise (0.1 * 3 = 0.30000000000000004) without hiding real digits. */
const clean = (value: number) => Number(value.toPrecision(12));

export type PercentChange = { percent: number; direction: "increase" | "decrease" | "none" };

/** X% of Y. */
export const percentOf = (percent: number, value: number) => clean((percent / 100) * value);

/** X is what percent of Y. Null when Y is zero. */
export function whatPercent(part: number, whole: number) {
  return whole === 0 ? null : clean((part / whole) * 100);
}

/** Percentage change from one value to another. Null when the starting value is zero. */
export function percentChange(from: number, to: number): PercentChange | null {
  if (from === 0) return null;
  const percent = clean(((to - from) / Math.abs(from)) * 100);
  return { percent, direction: percent > 0 ? "increase" : percent < 0 ? "decrease" : "none" };
}

export const increaseByPercent = (value: number, percent: number) => clean(value * (1 + percent / 100));

export const decreaseByPercent = (value: number, percent: number) => clean(value * (1 - percent / 100));

const NUMBER_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

/** Parses user input such as "1,234.5". Returns null for anything that is not a plain finite number. */
export function parseNumber(text: string) {
  const compact = text.trim().replace(/,/g, "");
  if (!NUMBER_PATTERN.test(compact)) return null;
  const value = Number(compact);
  return Number.isFinite(value) ? value : null;
}

/** en-US grouping with up to `maxDecimals` decimals and no trailing zeros. */
export function formatNumber(value: number, maxDecimals = 2) {
  if (!Number.isFinite(value)) return "—";
  const text = value.toLocaleString("en-US", { maximumFractionDigits: maxDecimals });
  return text === "-0" ? "0" : text;
}
