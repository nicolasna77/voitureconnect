import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Zap,
  Cog,
  Droplets,
  Wind,
  Activity,
} from "lucide-react";
import type { Specification } from "./types";
import { AnimatedSection } from "./animated-section";

function extractQuickStats(specsByCategory: Record<string, Specification[]>): {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}[] {
  const allSpecs: Specification[] = [];
  for (const specs of Object.values(specsByCategory)) {
    allSpecs.push(...specs);
  }

  const find = (keywords: string[]) =>
    allSpecs.find((s) =>
      keywords.some((k) => s.name.toLowerCase().includes(k)),
    );

  const stats: {
    label: string;
    value: string;
    unit: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }[] = [];

  const power = find(["puissance max", "power output", "puissance"]);
  if (power) {
    stats.push({
      label: "Puissance",
      value: power.value?.replace(/NULL$/i, "") || "\u2013",
      unit: power.unit && power.unit !== "NULL" ? power.unit : "ch",
      icon: <Zap className="h-5 w-5" aria-hidden="true" />,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    });
  }

  const engine = find(["cylindrée", "displacement", "engine size"]);
  if (engine) {
    stats.push({
      label: "Cylindrée",
      value: engine.value?.replace(/NULL$/i, "") || "\u2013",
      unit: engine.unit && engine.unit !== "NULL" ? engine.unit : "cm\u00B3",
      icon: <Cog className="h-5 w-5" aria-hidden="true" />,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    });
  }

  const consumption = find(["consommation", "fuel consumption", "combined"]);
  if (consumption) {
    stats.push({
      label: "Consommation",
      value: consumption.value?.replace(/NULL$/i, "") || "\u2013",
      unit:
        consumption.unit && consumption.unit !== "NULL"
          ? consumption.unit
          : "L/100km",
      icon: <Droplets className="h-5 w-5" aria-hidden="true" />,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    });
  }

  const topSpeed = find(["vitesse max", "top speed", "vitesse maxi"]);
  if (topSpeed) {
    stats.push({
      label: "Vitesse max",
      value: topSpeed.value?.replace(/NULL$/i, "") || "\u2013",
      unit: topSpeed.unit && topSpeed.unit !== "NULL" ? topSpeed.unit : "km/h",
      icon: <Wind className="h-5 w-5" aria-hidden="true" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
    });
  }

  const accel = find(["0 à 100", "0-100", "acceleration"]);
  if (accel && stats.length < 4) {
    stats.push({
      label: "0–100 km/h",
      value: accel.value?.replace(/NULL$/i, "") || "\u2013",
      unit: accel.unit && accel.unit !== "NULL" ? accel.unit : "s",
      icon: <Activity className="h-5 w-5" aria-hidden="true" />,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    });
  }

  return stats.slice(0, 4);
}

export function QuickStats({
  specsByCategory,
}: {
  specsByCategory: Record<string, Specification[]>;
}) {
  const stats = useMemo(
    () => extractQuickStats(specsByCategory),
    [specsByCategory],
  );

  if (stats.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <AnimatedSection key={stat.label} delay={index * 100}>
          <Card className="relative overflow-hidden">
            <CardContent className="p-4 flex items-start gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  stat.bgColor,
                  stat.color,
                )}
                aria-hidden="true"
              >
                {stat.icon}
              </div>
              <div className="min-w-0">
                <dd className="text-2xl font-bold tabular-nums leading-tight truncate">
                  {stat.value}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {stat.unit}
                  </span>
                </dd>
                <dt className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </dt>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      ))}
    </dl>
  );
}
