"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw, Loader2, Building2, Car, Calendar, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FilterState {
  marque: string;
  model: string;
  generation: string;
}

interface SpecificationFilterProps {
  formState: FilterState;
  onFilterChange: (type: string, value: string) => void;
}

// Hoisted fetch functions
const fetchBrands = async () => {
  const response = await axios.get("/api/car/brand");
  return response.data;
};

const fetchModels = async (brand: string) => {
  const response = await axios.get(`/api/car/model?name=${encodeURIComponent(brand)}`);
  return response.data;
};

const fetchGenerations = async (model: string) => {
  const response = await axios.get(`/api/car/generation?model=${encodeURIComponent(model)}`);
  return response.data;
};

// Loading indicator component
const LoadingIndicator = () => (
  <span className="flex items-center gap-2 text-muted-foreground">
    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
    <span>Chargement…</span>
  </span>
);

export default function SpecificationFilter({
  formState,
  onFilterChange,
}: SpecificationFilterProps) {
  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    staleTime: 5 * 60 * 1000,
  });

  const { data: modelsData, isLoading: modelsLoading } = useQuery({
    queryKey: ["models", formState.marque],
    queryFn: () => fetchModels(formState.marque),
    enabled: !!formState.marque,
    staleTime: 5 * 60 * 1000,
  });

  const { data: generationsData, isLoading: generationsLoading } = useQuery({
    queryKey: ["generations", formState.model],
    queryFn: () => fetchGenerations(formState.model),
    enabled: !!formState.model,
    staleTime: 5 * 60 * 1000,
  });

  const handleReset = () => {
    onFilterChange("marque", "");
  };

  const hasFilters = formState.marque || formState.model || formState.generation;

  // Progress indicator
  const progress = useMemo(() => {
    let step = 0;
    if (formState.marque) step = 1;
    if (formState.model) step = 2;
    if (formState.generation) step = 3;
    return step;
  }, [formState]);

  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="sr-only">Filtrer les fiches techniques par marque, modèle et génération</legend>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <span className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors",
          progress >= 1 ? "bg-primary/10 text-primary" : "text-muted-foreground"
        )}>
          <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
          Marque
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
        <span className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors",
          progress >= 2 ? "bg-primary/10 text-primary" : "text-muted-foreground"
        )}>
          <Car className="h-3.5 w-3.5" aria-hidden="true" />
          Modèle
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
        <span className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors",
          progress >= 3 ? "bg-primary/10 text-primary" : "text-muted-foreground"
        )}>
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          Génération
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Brand Select */}
        <div className="space-y-2">
          <Label htmlFor="filter-marque" className="text-sm font-medium flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Marque
          </Label>
          <Select
            value={formState.marque}
            onValueChange={(value) => onFilterChange("marque", value)}
          >
            <SelectTrigger
              id="filter-marque"
              className={cn(
                "h-11 transition-all",
                formState.marque && "border-primary/50 bg-primary/5"
              )}
            >
              {brandsLoading ? (
                <LoadingIndicator />
              ) : (
                <SelectValue placeholder="Toutes les marques" />
              )}
            </SelectTrigger>
            <SelectContent>
              {brandsData?.data?.map((brand: { name: string; logo_url?: string | null }) => (
                <SelectItem key={brand.name} value={brand.name}>
                  <span className="flex items-center gap-2">
                    {brand.logo_url ? (
                      <span className="relative w-5 h-5 shrink-0">
                        <Image
                          src={brand.logo_url}
                          alt=""
                          fill
                          sizes="20px"
                          className="object-contain"
                          quality={100}
                          unoptimized
                        />
                      </span>
                    ) : null}
                    {brand.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model Select */}
        <div className="space-y-2">
          <Label htmlFor="filter-model" className="text-sm font-medium flex items-center gap-2">
            <Car className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Modèle
          </Label>
          <Select
            value={formState.model}
            onValueChange={(value) => onFilterChange("model", value)}
            disabled={!formState.marque}
          >
            <SelectTrigger
              id="filter-model"
              className={cn(
                "h-11 transition-all",
                !formState.marque && "opacity-50",
                formState.model && "border-primary/50 bg-primary/5"
              )}
            >
              {!formState.marque ? (
                <span className="text-muted-foreground">Sélectionnez une marque</span>
              ) : modelsLoading ? (
                <LoadingIndicator />
              ) : (
                <SelectValue placeholder="Tous les modèles" />
              )}
            </SelectTrigger>
            <SelectContent>
              {modelsData?.data?.map((model: { name: string }) => (
                <SelectItem key={model.name} value={model.name}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Generation Select */}
        <div className="space-y-2">
          <Label htmlFor="filter-generation" className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Génération
          </Label>
          <Select
            value={formState.generation}
            onValueChange={(value) => onFilterChange("generation", value)}
            disabled={!formState.model}
          >
            <SelectTrigger
              id="filter-generation"
              className={cn(
                "h-11 transition-all",
                !formState.model && "opacity-50",
                formState.generation && "border-primary/50 bg-primary/5"
              )}
            >
              {!formState.model ? (
                <span className="text-muted-foreground">Sélectionnez un modèle</span>
              ) : generationsLoading ? (
                <LoadingIndicator />
              ) : (
                <SelectValue placeholder="Toutes les générations" />
              )}
            </SelectTrigger>
            <SelectContent>
              {generationsData?.data?.map((gen: { name: string }) => (
                <SelectItem key={gen.name} value={gen.name}>
                  {gen.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reset button */}
      {hasFilters && (
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </fieldset>
  );
}
