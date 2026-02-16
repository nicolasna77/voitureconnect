"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCompare } from "@/hooks/use-compare";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GitCompareArrows,
  X,
  ChevronLeft,
  Plus,
  ArrowRight,
  Cog,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Specification {
  name: string;
  value: string;
  unit: string | null;
}

interface Trim {
  id_car_trim: number;
  name: string;
  specificationsByCategory: Record<string, Specification[]>;
}

interface CompareVehicle {
  id_car_generation: number;
  name: string;
  year_begin: string | null;
  year_end: string | null;
  carModel: {
    name: string;
    carMake: {
      name: string;
      logo_url: string | null;
    };
  };
  series: {
    commonSpecifications: Record<string, Specification[]>;
    trims: Trim[];
  }[];
}

const CATEGORY_LABELS: Record<string, string> = {
  engine: "Moteur",
  performance: "Performance",
  dimensions: "Dimensions",
  weights: "Poids & capacités",
  gearbox: "Transmission",
  fuel: "Consommation",
  suspension: "Châssis",
  body: "Carrosserie",
  other: "Autres",
};

interface CompareContentProps {
  isModal?: boolean;
}

export function CompareContent({ isModal = false }: CompareContentProps) {
  const { items, remove, clear } = useCompare();

  const [selectedTrims, setSelectedTrims] = useState<Record<number, number>>(
    {}
  );

  const ids = items.map((i) => i.generationId).join(",");

  const { data: vehicles, isLoading } = useQuery<CompareVehicle[]>({
    queryKey: ["compare", ids],
    queryFn: async () => {
      const { data } = await axios.get(`/api/car/compare?ids=${ids}`);
      return data;
    },
    enabled: items.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  const getTrims = (vehicle: CompareVehicle): Trim[] => {
    return vehicle.series?.[0]?.trims || [];
  };

  const getSelectedTrim = (vehicle: CompareVehicle): Trim | null => {
    const trims = getTrims(vehicle);
    if (trims.length === 0) return null;
    const selectedId = selectedTrims[vehicle.id_car_generation];
    if (selectedId) {
      const found = trims.find((t) => t.id_car_trim === selectedId);
      if (found) return found;
    }
    return trims[0];
  };

  const handleTrimChange = (generationId: number, trimId: string) => {
    setSelectedTrims((prev) => ({
      ...prev,
      [generationId]: Number(trimId),
    }));
  };

  const vehicleSpecs = useMemo(() => {
    if (!vehicles) return [];
    return vehicles.map((v) => {
      const allSpecs: Record<string, Specification[]> = {};
      const serie = v.series?.[0];
      if (!serie) return { vehicle: v, specs: allSpecs };

      for (const [cat, specs] of Object.entries(
        serie.commonSpecifications || {}
      )) {
        allSpecs[cat] = [...(allSpecs[cat] || []), ...specs];
      }

      const selectedTrim = getSelectedTrim(v);
      if (selectedTrim) {
        for (const [cat, specs] of Object.entries(
          selectedTrim.specificationsByCategory || {}
        )) {
          allSpecs[cat] = [...(allSpecs[cat] || []), ...specs];
        }
      }

      return { vehicle: v, specs: allSpecs };
    });
  }, [vehicles, selectedTrims]);

  const categories = useMemo(() => {
    const catMap = new Map<string, Set<string>>();
    for (const { specs } of vehicleSpecs) {
      for (const [cat, specList] of Object.entries(specs)) {
        if (!catMap.has(cat)) catMap.set(cat, new Set());
        for (const spec of specList) {
          catMap.get(cat)!.add(spec.name);
        }
      }
    }
    return catMap;
  }, [vehicleSpecs]);

  if (items.length < 2) {
    return (
      <div className="py-12 space-y-6">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <GitCompareArrows className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold">Comparateur de véhicules</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Sélectionnez au moins 2 véhicules depuis les fiches techniques pour
            les comparer côte à côte.
          </p>
          <Button asChild>
            <Link href="/specification">
              <ArrowRight className="h-4 w-4 mr-2" />
              Parcourir les fiches
            </Link>
          </Button>
        </div>

        {items.length === 1 && (
          <Card className="max-w-sm mx-auto">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {items[0].makeName} {items[0].modelName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {items[0].generationName}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Retirer du comparateur"
                  onClick={() => remove(items[0].generationId)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", !isModal && "py-6")}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isModal && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/specification">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Retour
              </Link>
            </Button>
          )}
          <h1 className={cn("font-bold", isModal ? "text-lg" : "text-2xl")}>
            Comparateur
          </h1>
        </div>
        <Button variant="outline" size="sm" onClick={clear}>
          Tout effacer
        </Button>
      </div>

      {/* Vehicle headers with trim selectors */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `200px repeat(${items.length}, 1fr)${items.length < 3 ? " 1fr" : ""}`,
        }}
      >
        <div />
        {items.map((item) => {
          const vehicle = vehicles?.find(
            (v) => v.id_car_generation === item.generationId
          );
          const trims = vehicle ? getTrims(vehicle) : [];
          const currentTrim = vehicle ? getSelectedTrim(vehicle) : null;

          return (
            <Card key={item.generationId} className="relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Retirer ${item.makeName} ${item.modelName}`}
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => remove(item.generationId)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
              <CardContent className="p-4 space-y-3">
                <Link
                  href={`/specification/${item.generationId}`}
                  className="hover:underline block text-center"
                >
                  <p className="font-semibold">
                    {item.makeName} {item.modelName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.generationName}
                  </p>
                </Link>

                {trims.length > 1 && (
                  <div className="pt-1">
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                      <Cog className="h-3 w-3" aria-hidden="true" />
                      Motorisation
                    </label>
                    <Select
                      value={
                        currentTrim?.id_car_trim.toString() ||
                        trims[0]?.id_car_trim.toString()
                      }
                      onValueChange={(val) =>
                        handleTrimChange(item.generationId, val)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Choisir\u2026" />
                      </SelectTrigger>
                      <SelectContent>
                        {trims.map((trim) => (
                          <SelectItem
                            key={trim.id_car_trim}
                            value={trim.id_car_trim.toString()}
                            className="text-xs"
                          >
                            {trim.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {trims.length === 1 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    <Cog className="h-3 w-3 inline mr-1" aria-hidden="true" />
                    {trims[0].name}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
        {items.length < 3 && (
          <Card className="border-dashed">
            <CardContent className="p-4 flex items-center justify-center">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/specification">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Comparison table */}
      {vehicleSpecs.length > 0 && (
        <div className="space-y-6 overflow-x-auto">
          {Array.from(categories.entries()).map(([category, specNames]) => (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {CATEGORY_LABELS[category] || category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm" style={{ fontVariantNumeric: "tabular-nums" }}>
                  <tbody>
                    {Array.from(specNames).map((specName) => {
                      const values = vehicleSpecs.map(({ specs }) => {
                        const spec = specs[category]?.find(
                          (s) => s.name === specName
                        );
                        return spec
                          ? `${spec.value}${spec.unit && spec.unit !== "NULL" ? ` ${spec.unit}` : ""}`
                          : "—";
                      });

                      const allSame = values.every((v) => v === values[0]);

                      return (
                        <tr key={specName} className="border-t">
                          <td className="px-4 py-2.5 font-medium text-muted-foreground w-[200px] shrink-0">
                            {specName}
                          </td>
                          {values.map((val, i) => (
                            <td
                              key={i}
                              className={cn(
                                "px-4 py-2.5 text-center",
                                !allSame &&
                                  val !== "—" &&
                                  "font-medium text-primary"
                              )}
                            >
                              {val}
                            </td>
                          ))}
                          {items.length < 3 && <td />}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
