// Taux de dépréciation annuels cumulés (marché français de l'occasion)
// Source: L'Argus / La Centrale tendances 2024-2025
const RATES = [0.20, 0.15, 0.12, 0.10, 0.08, 0.07, 0.06];
const RATE_DEFAULT = 0.05; // au-delà de 7 ans

// Kilométrage de référence : 15 000 km/an
const KM_REF_PER_YEAR = 15_000;
// Pénalité/bonus : ±1.5% par tranche de 10 000 km d'écart
const KM_ADJ_PER_10K = 0.015;

const CONDITION_RANGE = {
  excellent: { min: 1.05, avg: 1.10, max: 1.15 },
  bon:       { min: 0.95, avg: 1.00, max: 1.06 },
  moyen:     { min: 0.80, avg: 0.87, max: 0.93 },
  mauvais:   { min: 0.62, avg: 0.72, max: 0.80 },
} as const;

export type Condition = keyof typeof CONDITION_RANGE;

export interface PriceEstimateInput {
  priceNew: number;      // Prix neuf en euros
  vehicleYear: number;   // Année du véhicule à estimer
  km: number;            // Kilométrage actuel
  condition: Condition;
}

export interface PriceEstimate {
  min: number;
  avg: number;
  max: number;
  depreciationPct: number; // % de dépréciation par rapport au prix neuf
  ageYears: number;
  priceNew: number;
}

function round100(n: number) {
  return Math.round(n / 100) * 100;
}

export function estimatePrice(input: PriceEstimateInput): PriceEstimate {
  const { priceNew, vehicleYear, km, condition } = input;
  const currentYear = new Date().getFullYear();
  const ageYears = Math.max(0, currentYear - vehicleYear);

  // 1. Dépréciation temporelle (composée)
  let base = priceNew;
  for (let i = 0; i < ageYears; i++) {
    base *= 1 - (RATES[i] ?? RATE_DEFAULT);
  }

  // 2. Ajustement kilométrage
  const expectedKm = ageYears * KM_REF_PER_YEAR;
  const kmDiffPer10k = (km - expectedKm) / 10_000;
  const kmFactor = Math.max(0.55, Math.min(1.25, 1 - kmDiffPer10k * KM_ADJ_PER_10K));
  base *= kmFactor;

  // 3. Fourchette selon l'état
  const range = CONDITION_RANGE[condition] ?? CONDITION_RANGE.bon;
  const min = Math.max(500,  round100(base * range.min));
  const avg = Math.max(700,  round100(base * range.avg));
  const max = Math.max(1000, round100(base * range.max));

  const depreciationPct = Math.round((1 - base / priceNew) * 100);

  return { min, avg, max, depreciationPct, ageYears, priceNew };
}
