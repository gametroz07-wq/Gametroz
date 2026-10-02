import { percentOfCents, roundPercent } from "./money";

export type TipInput = {
  billCents: number;
  tipPercent: number;
  people: number;
  /** Round each person's share up to the next whole dollar. */
  roundUp: boolean;
};

export type TipResult = {
  tipCents: number;
  totalCents: number;
  perPersonCents: number;
  /** What the table actually pays: per-person share times people. */
  paidCents: number;
  /** Rounding on top of the total (a cent or two, or more when rounding up to whole dollars). */
  extraCents: number;
  /** Tip actually left after rounding, in cents and as a percent of the bill. */
  effectiveTipCents: number;
  effectiveTipPercent: number;
};

export const MAX_PEOPLE = 100;

export function calculateTip(input: TipInput): { ok: true; result: TipResult } | { ok: false; error: string } {
  const { billCents, tipPercent, people, roundUp } = input;
  if (!Number.isInteger(billCents) || billCents <= 0) return { ok: false, error: "Enter a bill amount greater than $0." };
  if (!Number.isFinite(tipPercent) || tipPercent < 0 || tipPercent > 100) {
    return { ok: false, error: "Tip must be between 0% and 100%." };
  }
  if (!Number.isInteger(people) || people < 1 || people > MAX_PEOPLE) {
    return { ok: false, error: `People must be a whole number from 1 to ${MAX_PEOPLE}.` };
  }

  const tipCents = percentOfCents(billCents, tipPercent);
  const totalCents = billCents + tipCents;
  // Shares are rounded up so the table always covers the total: to the cent, or to the dollar on request.
  const step = roundUp ? 100 : 1;
  const perPersonCents = Math.ceil(totalCents / (people * step)) * step;
  const paidCents = perPersonCents * people;
  const effectiveTipCents = paidCents - billCents;

  return {
    ok: true,
    result: {
      tipCents,
      totalCents,
      perPersonCents,
      paidCents,
      extraCents: paidCents - totalCents,
      effectiveTipCents,
      effectiveTipPercent: roundPercent((effectiveTipCents / billCents) * 100),
    },
  };
}
