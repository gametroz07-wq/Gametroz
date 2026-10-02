import type { UnitDef } from "./units";

/** The international avoirdupois pound is defined as exactly 0.45359237 kg. Factors are kilograms per unit. */
const POUND = 0.45359237;

export const weightUnits: UnitDef[] = [
  { key: "oz", label: "Ounces", symbol: "oz", factor: POUND / 16, group: "US customary" },
  { key: "lb", label: "Pounds", symbol: "lb", factor: POUND, group: "US customary" },
  { key: "st", label: "Stone", symbol: "st", factor: POUND * 14, group: "US customary" },
  { key: "ton", label: "US short tons", symbol: "tn", factor: POUND * 2000, group: "US customary" },
  { key: "mg", label: "Milligrams", symbol: "mg", factor: 0.000001, group: "Metric" },
  { key: "g", label: "Grams", symbol: "g", factor: 0.001, group: "Metric" },
  { key: "kg", label: "Kilograms", symbol: "kg", factor: 1, group: "Metric" },
  { key: "t", label: "Metric tons", symbol: "t", factor: 1000, group: "Metric" },
];

const roundTenth = (value: number) => Math.round(value * 10) / 10;

/** Splits pounds into whole pounds and ounces (one decimal), carrying 16 ounces into a pound. */
export function splitPoundsOunces(totalPounds: number) {
  const totalOunces = roundTenth(Math.max(0, totalPounds) * 16);
  const pounds = Math.floor(totalOunces / 16);
  return { pounds, ounces: roundTenth(totalOunces - pounds * 16) };
}
