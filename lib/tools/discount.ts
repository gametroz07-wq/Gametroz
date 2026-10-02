import { percentOfCents, roundPercent } from "./money";

export type DiscountInput = {
  priceCents: number;
  discount: { type: "percent"; percent: number } | { type: "amount"; cents: number };
  /** An extra percentage taken off the already reduced price, or null for none. */
  secondPercent: number | null;
  /** Sales tax added after the discounts, or null for none. */
  taxPercent: number | null;
};

export type DiscountResult = {
  originalCents: number;
  firstDiscountCents: number;
  secondDiscountCents: number;
  salePriceCents: number;
  savingsCents: number;
  savingsPercent: number;
  taxCents: number;
  totalCents: number;
};

export const MAX_TAX_PERCENT = 30;

const validPercent = (value: number) => Number.isFinite(value) && value >= 0 && value <= 100;

export function calculateDiscount(input: DiscountInput): { ok: true; result: DiscountResult } | { ok: false; error: string } {
  const { priceCents, discount, secondPercent, taxPercent } = input;
  if (!Number.isInteger(priceCents) || priceCents <= 0) return { ok: false, error: "Enter a price greater than $0." };

  if (discount.type === "percent") {
    if (!Number.isFinite(discount.percent)) return { ok: false, error: "Enter a valid discount." };
    if (!validPercent(discount.percent)) return { ok: false, error: "The discount must be between 0% and 100%." };
  } else {
    if (!Number.isInteger(discount.cents) || discount.cents < 0) return { ok: false, error: "Enter a valid discount amount." };
    if (discount.cents > priceCents) return { ok: false, error: "The amount off cannot be more than the price." };
  }
  if (secondPercent !== null && !validPercent(secondPercent)) {
    return { ok: false, error: "The second discount must be between 0% and 100%." };
  }
  if (taxPercent !== null && !(Number.isFinite(taxPercent) && taxPercent >= 0 && taxPercent <= MAX_TAX_PERCENT)) {
    return { ok: false, error: `Sales tax must be between 0% and ${MAX_TAX_PERCENT}%.` };
  }

  const firstDiscountCents = discount.type === "percent" ? percentOfCents(priceCents, discount.percent) : discount.cents;
  const afterFirst = priceCents - firstDiscountCents;
  const secondDiscountCents = secondPercent === null ? 0 : percentOfCents(afterFirst, secondPercent);
  const salePriceCents = afterFirst - secondDiscountCents;
  const savingsCents = priceCents - salePriceCents;
  const taxCents = taxPercent === null ? 0 : percentOfCents(salePriceCents, taxPercent);

  return {
    ok: true,
    result: {
      originalCents: priceCents,
      firstDiscountCents,
      secondDiscountCents,
      salePriceCents,
      savingsCents,
      savingsPercent: roundPercent((savingsCents / priceCents) * 100),
      taxCents,
      totalCents: salePriceCents + taxCents,
    },
  };
}
