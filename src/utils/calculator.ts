/**
 * Utility functions for the Orientierungsrechner (§ 89b HGB).
 */

/**
 * Parses user input for commission values.
 * Rule:
 * - A dot followed by exactly three digits, where the group is followed by end-of-string,
 *   a comma, or another such group, is a thousands separator.
 * - Any other dot is a decimal point.
 * - A comma is always a decimal point.
 * - Negative results become 0.
 * - Non-numeric strings become 0.
 */
export function parseNum(v: string): number {
  if (!v || typeof v !== "string") return 0;
  const s = v.trim();
  if (!s) return 0;
  if (s.startsWith("-")) return 0;

  const normalized = s
    .replace(/\.(?=\d{3}(?!\d)(?:$|,|\.))/g, "")
    .replace(",", ".");

  const n = Number(normalized);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

export interface CalculationInputs {
  years: string[];
  share: number; // percentage, e.g. 70
  factor: number; // e.g. 1.5
}

export interface CalculationOutputs {
  count: number;
  values: number[];
  avg: number;
  cap: number;
  lowerEstimate: number;
  upperEstimate: number;
  rawLower: number;
  rawUpper: number;
  capped: boolean;
}

export function computeOrientierung({ years, share, factor }: CalculationInputs): CalculationOutputs {
  // Distinguish empty from zero:
  // An empty field is excluded from the average.
  // An explicit "0" counts as a year with zero commission.
  const entered = years
    .map((v) => ({ raw: v.trim(), val: parseNum(v) }))
    .filter((item) => item.raw !== "");

  const values = entered.map((item) => item.val);
  const count = values.length;
  const avg = count > 0 ? values.reduce((a, b) => a + b, 0) / count : 0;
  const cap = avg * 3;

  const shareFraction = share / 100;
  const rawLower = avg * shareFraction * 1.0;
  const rawUpper = avg * shareFraction * factor;

  const lowerEstimate = Math.min(rawLower, cap);
  const upperEstimate = Math.min(rawUpper, cap);
  const capped = rawUpper > cap && cap > 0;

  return {
    count,
    values,
    avg,
    cap,
    lowerEstimate,
    upperEstimate,
    rawLower,
    rawUpper,
    capped,
  };
}
