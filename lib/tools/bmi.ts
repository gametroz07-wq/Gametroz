// BMI = weight in kg / (height in m)^2. US units are converted with the exact definitions
// (1 in = 0.0254 m, 1 lb = 0.45359237 kg). Categories are the standard adult ranges.

const METERS_PER_INCH = 0.0254;
const KG_PER_POUND = 0.45359237;

export type BmiInput =
  | { system: "us"; feet: number | null; inches: number | null; pounds: number | null }
  | { system: "metric"; cm: number | null; kg: number | null };

export type BmiCategory = { key: "underweight" | "healthy" | "overweight" | "obesity"; label: string; range: string };

const categories: Record<BmiCategory["key"], BmiCategory> = {
  underweight: { key: "underweight", label: "Underweight", range: "below 18.5" },
  healthy: { key: "healthy", label: "Healthy weight", range: "18.5 to 24.9" },
  overweight: { key: "overweight", label: "Overweight", range: "25 to 29.9" },
  obesity: { key: "obesity", label: "Obesity", range: "30 or higher" },
};

/** Category for a BMI already rounded to one decimal, the value people see. */
export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return categories.underweight;
  if (bmi < 25) return categories.healthy;
  if (bmi < 30) return categories.overweight;
  return categories.obesity;
}

export type BmiResult = {
  bmi: number;
  category: BmiCategory;
  /** Weights that give a BMI from 18.5 to 24.9 at this height. */
  healthyRange: { minKg: number; maxKg: number; minLb: number; maxLb: number };
};

export type BmiErrors = { height?: string; weight?: string };

const LIMITS = {
  us: { minInches: 36, maxInches: 96, minLb: 44, maxLb: 990 },
  metric: { minCm: 90, maxCm: 250, minKg: 20, maxKg: 450 },
};

const valid = (value: number) => Number.isFinite(value) && value >= 0;

function readHeight(input: BmiInput): { meters: number } | { error: string } {
  if (input.system === "metric") {
    if (input.cm === null) return { error: "Enter your height." };
    if (!valid(input.cm)) return { error: "Enter a valid height." };
    const { minCm, maxCm } = LIMITS.metric;
    if (input.cm < minCm || input.cm > maxCm) return { error: `Height must be between ${minCm} and ${maxCm} cm.` };
    return { meters: input.cm / 100 };
  }
  if (input.feet === null && input.inches === null) return { error: "Enter your height." };
  const feet = input.feet ?? 0;
  const inches = input.inches ?? 0;
  if (!valid(feet) || !valid(inches)) return { error: "Enter a valid height." };
  if (inches >= 12) return { error: "Inches must be less than 12." };
  const total = feet * 12 + inches;
  const { minInches, maxInches } = LIMITS.us;
  if (total < minInches || total > maxInches) {
    return { error: `Height must be between ${minInches / 12} ft 0 in and ${maxInches / 12} ft 0 in.` };
  }
  return { meters: total * METERS_PER_INCH };
}

function readWeight(input: BmiInput): { kg: number } | { error: string } {
  if (input.system === "metric") {
    if (input.kg === null) return { error: "Enter your weight." };
    if (!valid(input.kg)) return { error: "Enter a valid weight." };
    const { minKg, maxKg } = LIMITS.metric;
    if (input.kg < minKg || input.kg > maxKg) return { error: `Weight must be between ${minKg} and ${maxKg} kg.` };
    return { kg: input.kg };
  }
  if (input.pounds === null) return { error: "Enter your weight." };
  if (!valid(input.pounds)) return { error: "Enter a valid weight." };
  const { minLb, maxLb } = LIMITS.us;
  if (input.pounds < minLb || input.pounds > maxLb) return { error: `Weight must be between ${minLb} and ${maxLb} lb.` };
  return { kg: input.pounds * KG_PER_POUND };
}

export function calculateBmi(input: BmiInput): { ok: true; result: BmiResult } | { ok: false; errors: BmiErrors } {
  const height = readHeight(input);
  const weight = readWeight(input);
  if ("error" in height || "error" in weight) {
    return {
      ok: false,
      errors: {
        ...("error" in height ? { height: height.error } : {}),
        ...("error" in weight ? { weight: weight.error } : {}),
      },
    };
  }

  const squared = height.meters * height.meters;
  const bmi = Math.round((weight.kg / squared) * 10) / 10;
  const minKg = 18.5 * squared;
  const maxKg = 24.9 * squared;
  return {
    ok: true,
    result: {
      bmi,
      category: bmiCategory(bmi),
      healthyRange: { minKg, maxKg, minLb: minKg / KG_PER_POUND, maxLb: maxKg / KG_PER_POUND },
    },
  };
}
