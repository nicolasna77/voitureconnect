"use client";

import {
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { CompareItem } from "@/hooks/use-compare";

interface Specification {
  name: string;
  value: string;
  unit: string | null;
}

interface VehicleSpec {
  vehicle: { id_car_generation: number; carModel: { name: string; carMake: { name: string } } };
  specs: Record<string, Specification[]>;
}

const RADAR_SPEC_NAMES = [
  "Puissance maximale",
  "Couple maximal",
  "Vitesse maximale",
  "0-100 km/h",
  "Consommation mixte",
  "Masse à vide",
];

const RADAR_LABELS: Record<string, string> = {
  "Puissance maximale": "Puissance",
  "Couple maximal": "Couple",
  "Vitesse maximale": "Vitesse max",
  "0-100 km/h": "0-100 km/h",
  "Consommation mixte": "Conso.",
  "Masse à vide": "Poids",
};

// Lower is better for these
const LOWER_IS_BETTER = new Set(["Consommation mixte", "0-100 km/h", "Masse à vide"]);

const COLORS = ["#6366f1", "#f59e0b", "#10b981"];
const CHART_MARGIN = { top: 10, right: 30, bottom: 10, left: 30 };

function extractNum(val: string): number | null {
  const match = val.match(/^[\d,.]+/);
  if (!match) return null;
  return parseFloat(match[0].replace(",", "."));
}

export default function CompareRadarChart({
  vehicleSpecs,
  items,
}: {
  vehicleSpecs: VehicleSpec[];
  items: CompareItem[];
}) {
  // Build radar data: for each spec, normalize values 0-100
  const radarData = RADAR_SPEC_NAMES.map((specName) => {
    const raw = vehicleSpecs.map(({ specs }) => {
      for (const specList of Object.values(specs)) {
        const found = specList.find((s) => s.name === specName);
        if (found) return extractNum(`${found.value}${found.unit && found.unit !== "NULL" ? ` ${found.unit}` : ""}`);
      }
      return null;
    });

    const validNums = raw.filter((n) => n !== null) as number[];
    if (validNums.length === 0) return null;

    const min = Math.min(...validNums);
    const max = Math.max(...validNums);
    const range = max - min || 1;
    const lowerBetter = LOWER_IS_BETTER.has(specName);

    const normalized = raw.map((n) => {
      if (n === null) return 0;
      const score = (n - min) / range; // 0 = min, 1 = max
      return Math.round((lowerBetter ? (1 - score) : score) * 100);
    });

    const entry: Record<string, string | number> = {
      spec: RADAR_LABELS[specName] || specName,
    };
    items.forEach((item, i) => {
      entry[`v${i}`] = normalized[i] ?? 0;
    });
    return entry;
  }).filter(Boolean) as Record<string, string | number>[];

  if (radarData.length < 3) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vue radar des performances</CardTitle>
        <CardDescription>
          Comparaison normalisée des specs clés — plus le score est élevé, mieux c&apos;est
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <RechartsRadarChart data={radarData} margin={CHART_MARGIN}>
            <PolarGrid />
            <PolarAngleAxis dataKey="spec" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            {items.map((item, i) => (
              <Radar
                key={item.generationId}
                name={`${item.makeName} ${item.modelName} ${item.generationName}`}
                dataKey={`v${i}`}
                stroke={COLORS[i % COLORS.length]}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={0.15}
              />
            ))}
            <Tooltip formatter={(value: number) => [`${value}/100`, ""]} />
            <Legend />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
