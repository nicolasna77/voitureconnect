import React from "react";
import {
  Car,
  Gauge,
  Cog,
  Fuel,
  Zap,
  Settings2,
} from "lucide-react";
import type { Specification } from "./types";

interface CategoryConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  priority: number;
}

// priority: lower = shown first. Logical order:
//   1. Carrosserie (body shape rarely changes between trims)
//   2. Dimensions (shared across trims)
//   3. Poids (mostly shared)
//   4. Freins & Suspension (mostly shared)
//   5. Moteur (differs per motorization)
//   6. Transmission (differs per engine)
//   7. Carburant (differs per engine)
//   8. Performances (differs per engine)
//   9. Autres (catch-all, always last)
const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  body: {
    label: "Carrosserie",
    icon: <Car className="h-5 w-5" aria-hidden="true" />,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    priority: 1,
  },
  dimensions: {
    label: "Dimensions",
    icon: <Car className="h-5 w-5" aria-hidden="true" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    priority: 2,
  },
  weights: {
    label: "Poids & Capacités",
    icon: <Gauge className="h-5 w-5" aria-hidden="true" />,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    priority: 3,
  },
  suspension: {
    label: "Freins & Suspension",
    icon: <Gauge className="h-5 w-5" aria-hidden="true" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    priority: 4,
  },
  engine: {
    label: "Moteur",
    icon: <Cog className="h-5 w-5" aria-hidden="true" />,
    color: "text-red-600",
    bgColor: "bg-red-50",
    priority: 5,
  },
  gearbox: {
    label: "Transmission",
    icon: <Settings2 className="h-5 w-5" aria-hidden="true" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    priority: 6,
  },
  fuel: {
    label: "Carburant & Consommation",
    icon: <Fuel className="h-5 w-5" aria-hidden="true" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    priority: 7,
  },
  performance: {
    label: "Performances",
    icon: <Zap className="h-5 w-5" aria-hidden="true" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
    priority: 8,
  },
  other: {
    label: "Autres caractéristiques",
    icon: <Settings2 className="h-5 w-5" aria-hidden="true" />,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    priority: 99,
  },
};

export function getCategoryConfig(categoryId: string): CategoryConfig {
  return CATEGORY_CONFIG[categoryId] || CATEGORY_CONFIG.other;
}

/** Sort category entries by priority (stable shared->variable order) */
export function sortCategories(
  entries: [string, Specification[]][],
): [string, Specification[]][] {
  return [...entries].sort((a, b) => {
    const pa = getCategoryConfig(a[0]).priority;
    const pb = getCategoryConfig(b[0]).priority;
    return pa - pb;
  });
}
