import type { UnitDef } from "./units";

/** Factors are meters per unit. Every international unit below is defined exactly in meters. */
export const lengthUnits: UnitDef[] = [
  { key: "in", label: "Inches", symbol: "in", factor: 0.0254, group: "US customary" },
  { key: "ft", label: "Feet", symbol: "ft", factor: 0.3048, group: "US customary" },
  { key: "yd", label: "Yards", symbol: "yd", factor: 0.9144, group: "US customary" },
  { key: "mi", label: "Miles", symbol: "mi", factor: 1609.344, group: "US customary" },
  { key: "mm", label: "Millimeters", symbol: "mm", factor: 0.001, group: "Metric" },
  { key: "cm", label: "Centimeters", symbol: "cm", factor: 0.01, group: "Metric" },
  { key: "m", label: "Meters", symbol: "m", factor: 1, group: "Metric" },
  { key: "km", label: "Kilometers", symbol: "km", factor: 1000, group: "Metric" },
  { key: "nmi", label: "Nautical miles", symbol: "nmi", factor: 1852, group: "Nautical" },
];

const roundTenth = (value: number) => Math.round(value * 10) / 10;

/** Splits a length in inches into whole feet and inches (one decimal), carrying 12 inches into a foot. */
export function splitFeetInches(totalInches: number) {
  const rounded = roundTenth(Math.max(0, totalInches));
  const feet = Math.floor(rounded / 12);
  return { feet, inches: roundTenth(rounded - feet * 12) };
}
