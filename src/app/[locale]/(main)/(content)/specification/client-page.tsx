"use client";

import React, { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import PaginationComponant from "@/components/component/pagination";
import ListSpecification from "@/components/list/list-specification";
import SpecificationFilter from "@/components/specification/specification-filter";
import SpecificationSearch from "@/components/specification/specification-search";
import { FileText, SlidersHorizontal, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { RecentHistory } from "./_components/recent-history";

const fetchCarData = async (params: URLSearchParams) => {
  const response = await axios.get(`/api/car?${params.toString()}`);
  return response.data;
};

const fetchUnlockedIds = async (): Promise<number[]> => {
  const response = await axios.get("/api/credits/unlocked-ids");
  return response.data.ids;
};

const SpecificationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = React.useState(false);

  // Derive state directly from URL params (vercel-react-best-practices: rerender-derived-state-no-effect)
  // This is the source of truth - no useEffect sync needed
  const formState = useMemo(
    () => ({
      marque: searchParams.get("marque") || "",
      model: searchParams.get("model") || "",
      generation: searchParams.get("generation") || "",
      yearMin: searchParams.get("yearMin") || "",
      yearMax: searchParams.get("yearMax") || "",
      sortBy: searchParams.get("sortBy") || "make_asc",
      page: parseInt(searchParams.get("page") || "1", 10),
    }),
    [searchParams]
  );

  const query = new URLSearchParams(searchParams.toString());

  const {
    data: carData,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["carData", query.toString()],
    queryFn: () => fetchCarData(query),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
  });

  const { data: unlockedIds = [] } = useQuery({
    queryKey: ["unlockedIds"],
    queryFn: fetchUnlockedIds,
    staleTime: 60 * 1000,
  });

  // Update URL directly - formState derives from URL automatically (vercel-react-best-practices: rerender-derived-state-no-effect)
  const updateFormState = useCallback(
    (type: string, value: string | number) => {
      const newState = { ...formState, [type]: value };

      // Clear dependent fields when parent changes
      if (type === "marque") {
        newState.model = "";
        newState.generation = "";
      } else if (type === "model") {
        newState.generation = "";
      }

      // Reset to page 1 unless explicitly changing page
      newState.page = type === "page" ? Number(value) : 1;

      // Build URL params
      const params = new URLSearchParams();
      if (newState.marque) params.append("marque", newState.marque);
      if (newState.model) params.append("model", newState.model);
      if (newState.generation) params.append("generation", newState.generation);
      if (newState.yearMin) params.append("yearMin", newState.yearMin);
      if (newState.yearMax) params.append("yearMax", newState.yearMax);
      if (newState.sortBy && newState.sortBy !== "make_asc") params.append("sortBy", newState.sortBy);
      if (newState.page > 1) params.append("page", newState.page.toString());

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [formState, router]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const totalPages = carData?.pagination?.totalPages || 0;
      if (newPage < 1 || newPage > totalPages) return;
      updateFormState("page", newPage);
    },
    [carData?.pagination?.totalPages, updateFormState]
  );

  const clearFilter = useCallback(
    (type: "marque" | "model" | "generation" | "yearMin" | "yearMax" | "sortBy") => {
      updateFormState(type, "");
    },
    [updateFormState]
  );

  const totalCars = carData?.pagination?.totalCars || 0;
  const currentPage = formState.page;
  const totalPages = carData?.pagination?.totalPages || 0;

  // Active filters for display
  const activeFilters = useMemo(() => {
    const filters: { type: "marque" | "model" | "generation" | "yearMin" | "yearMax" | "sortBy"; value: string }[] = [];
    if (formState.marque) filters.push({ type: "marque", value: formState.marque });
    if (formState.model) filters.push({ type: "model", value: formState.model });
    if (formState.generation) filters.push({ type: "generation", value: formState.generation });
    if (formState.yearMin) filters.push({ type: "yearMin", value: `≥ ${formState.yearMin}` });
    if (formState.yearMax) filters.push({ type: "yearMax", value: `≤ ${formState.yearMax}` });
    if (formState.sortBy && formState.sortBy !== "make_asc") {
      const sortLabel = formState.sortBy === "year_desc" ? "Récent en premier" : "Ancien en premier";
      filters.push({ type: "sortBy", value: sortLabel });
    }
    return filters;
  }, [formState]);

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="space-y-6 py-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Fiches Techniques
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Analyse IA de {totalCars.toLocaleString("fr-FR")}+ véhicules
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl">
            <SpecificationSearch
              placeholder="Rechercher une marque, modèle ou génération…"
              size="lg"
              autoFocus
            />
          </div>

          {/* Advanced filters toggle */}
          <div className="mt-4">
            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2 text-muted-foreground hover:text-foreground",
                    showFilters && "text-primary"
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  Filtres avancés
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="rounded-xl border border-border bg-card p-4">
                  <SpecificationFilter
                    formState={formState}
                    onFilterChange={updateFormState}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </header>

      {/* Recent history */}
      <RecentHistory />

      {/* Active filters pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtres actifs :</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.type}
              variant="secondary"
              className="gap-1.5 pl-3 pr-1.5 py-1.5"
            >
              <span>{filter.value}</span>
              <button
                onClick={() => clearFilter(filter.type)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                aria-label={`Supprimer le filtre ${filter.value}`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateFormState("marque", "")}
            className="text-muted-foreground hover:text-destructive text-xs h-7"
          >
            Tout effacer
          </Button>
        </div>
      )}

      {/* Results count */}
      <div
        className="flex items-center justify-between"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">
            {totalCars.toLocaleString("fr-FR")}
          </span>{" "}
          résultat{totalCars !== 1 ? "s" : ""}
        </p>
        {isFetching && !isLoading && (
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Mise à jour…
          </span>
        )}
      </div>

      {/* Results list */}
      <ListSpecification
        isPending={isLoading}
        isError={!!error}
        data={carData}
        unlockedIds={unlockedIds}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Pagination des fiches techniques" className="pt-4">
          <PaginationComponant
            page={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </nav>
      )}
    </div>
  );
};

export { SpecificationPage };
