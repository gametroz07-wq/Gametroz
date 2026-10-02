// Shared engine for the unit converters: every unit stores its size in a common base unit.

export type UnitDef = {
  key: string;
  label: string;
  symbol: string;
  /** Size of one unit expressed in the base unit of its table (meters, kilograms, bytes...). */
  factor: number;
  /** Heading used to group units in menus and tables. */
  group?: string;
};

/** Rounds away binary float noise (0.1 * 3 = 0.30000000000000004) without hiding real digits. */
export const cleanNumber = (value: number) => Number(value.toPrecision(12));

function findUnit(units: readonly UnitDef[], key: string) {
  const unit = units.find((candidate) => candidate.key === key);
  if (!unit) throw new Error(`Unknown unit: ${key}`);
  return unit;
}

export function convertUnit(units: readonly UnitDef[], value: number, from: string, to: string) {
  const source = findUnit(units, from);
  const target = findUnit(units, to);
  if (source === target) return value;
  return cleanNumber((value * source.factor) / target.factor);
}

export function convertAll(units: readonly UnitDef[], value: number, from: string) {
  return units.map((unit) => ({ key: unit.key, value: convertUnit(units, value, from, unit.key) }));
}

/**
 * en-US display with about 7 significant digits, no trailing zeros, grouping for large numbers and
 * exponent notation for extremely large or small values.
 */
export function formatQuantity(value: number, significant = 7) {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const rounded = Number(value.toPrecision(significant));
  const abs = Math.abs(rounded);
  if (abs >= 1e15 || abs < 1e-6) return rounded.toExponential();
  return rounded.toLocaleString("en-US", { maximumFractionDigits: 15 });
}
