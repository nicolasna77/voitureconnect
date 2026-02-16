import type { Specification, CarTrim, CarSerie, Generation } from "./types";

/** Merge common specs + trim-specific specs into a single categorized map */
export function getMergedSpecs(
  commonSpecs: Record<string, Specification[]>,
  trimSpecs: Record<string, Specification[]>,
): Record<string, Specification[]> {
  const merged: Record<string, Specification[]> = {};
  for (const [cat, specs] of Object.entries(commonSpecs)) {
    merged[cat] = [...specs];
  }
  for (const [cat, specs] of Object.entries(trimSpecs)) {
    merged[cat] = [...(merged[cat] || []), ...specs];
  }
  return merged;
}

/** Get all trims flattened from all series */
export function getAllTrims(
  generation: Generation,
): { trim: CarTrim; serie: CarSerie }[] {
  const result: { trim: CarTrim; serie: CarSerie }[] = [];
  for (const serie of generation.series || []) {
    for (const trim of serie.trims || []) {
      result.push({ trim, serie });
    }
  }
  return result;
}
