// Money is handled as integer cents. Text is converted by reading its digits, never through floats,
// and every percentage result is rounded to a whole cent only once, at the end.

const MAX_DOLLARS = 1_000_000_000;

export type MoneyParse = { ok: true; cents: number } | { ok: false; error: string };

/** Reads "19.99", "$1,234.50" or ".5" into cents. */
export function parseMoney(text: string): MoneyParse {
  const compact = text.trim().replace(/^(-?)\$/, "$1").replace(/,/g, "");
  const match = /^(-?)(\d*)(?:\.(\d*))?$/.exec(compact);
  if (!match || (!match[2] && !match[3])) return { ok: false, error: "Enter a number such as 19.99." };
  if (match[1]) return { ok: false, error: "Enter an amount of $0 or more." };
  const fraction = match[3] ?? "";
  if (fraction.length > 2) return { ok: false, error: "Use at most 2 decimal places." };
  const dollars = Number(match[2] || "0");
  if (dollars > MAX_DOLLARS) return { ok: false, error: "That amount is too large." };
  return { ok: true, cents: dollars * 100 + Number(fraction.padEnd(2, "0")) };
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatMoney(cents: number) {
  return `${cents < 0 ? "-" : ""}${usd.format(Math.abs(cents) / 100)}`;
}

/** `percent`% of an amount in cents, rounded half up to a whole cent. */
export const percentOfCents = (cents: number, percent: number) => Math.round(Number(((cents * percent) / 100).toPrecision(12)));

/** Percent with at most two decimals, for display (24.03 rather than 24.031007...). */
export const roundPercent = (value: number) => Math.round(value * 100) / 100;
