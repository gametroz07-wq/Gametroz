import { cleanNumber } from "./units";

export type TemperatureKey = "F" | "C" | "K" | "R";

export const temperatureUnits: { key: TemperatureKey; label: string; symbol: string }[] = [
  { key: "F", label: "Fahrenheit", symbol: "°F" },
  { key: "C", label: "Celsius", symbol: "°C" },
  { key: "K", label: "Kelvin", symbol: "K" },
  { key: "R", label: "Rankine", symbol: "°R" },
];

// Kelvin is the pivot. Each pair of functions is exact; rounding at nine decimals removes float noise.
const toKelvinFns: Record<TemperatureKey, (value: number) => number> = {
  C: (value) => value + 273.15,
  F: (value) => ((value + 459.67) * 5) / 9,
  K: (value) => value,
  R: (value) => (value * 5) / 9,
};

const fromKelvinFns: Record<TemperatureKey, (kelvin: number) => number> = {
  C: (kelvin) => kelvin - 273.15,
  F: (kelvin) => (kelvin * 9) / 5 - 459.67,
  K: (kelvin) => kelvin,
  R: (kelvin) => (kelvin * 9) / 5,
};

const roundNano = (value: number) => Math.round(value * 1e9) / 1e9;
const toKelvin = (value: number, from: TemperatureKey) => roundNano(toKelvinFns[from](value));

export function convertTemperature(value: number, from: TemperatureKey, to: TemperatureKey) {
  if (from === to) return value;
  return cleanNumber(roundNano(fromKelvinFns[to](toKelvin(value, from))));
}

/** Returns an error message for temperatures colder than absolute zero, otherwise undefined. */
export function validateTemperature(value: number, unit: TemperatureKey) {
  return toKelvin(value, unit) < 0
    ? "Nothing can be colder than absolute zero (−273.15 °C, −459.67 °F, 0 K)."
    : undefined;
}

const formulas: Record<TemperatureKey, Partial<Record<TemperatureKey, string>>> = {
  C: { F: "°F = °C × 9/5 + 32", K: "K = °C + 273.15", R: "°R = (°C + 273.15) × 9/5" },
  F: { C: "°C = (°F − 32) × 5/9", K: "K = (°F + 459.67) × 5/9", R: "°R = °F + 459.67" },
  K: { C: "°C = K − 273.15", F: "°F = K × 9/5 − 459.67", R: "°R = K × 9/5" },
  R: { C: "°C = °R × 5/9 − 273.15", F: "°F = °R − 459.67", K: "K = °R × 5/9" },
};

export function temperatureFormula(from: TemperatureKey, to: TemperatureKey) {
  return from === to ? "Same unit, so the value is unchanged." : (formulas[from][to] ?? "");
}
