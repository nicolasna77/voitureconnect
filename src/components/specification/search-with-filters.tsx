"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Car,
  Loader2,
  Building2,
  Calendar,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import SpecificationFilter from "./specification-filter";

// ── Types ────────────────────────────────────────────────────────────────────

interface Suggestion {
  type: "marque" | "model" | "generation";
  brand: string;
  model: string | null;
  generation: string | null;
  id_car_generation?: number;
  logo_url?: string | null;
}

interface FilterState {
  marque: string;
  model: string;
  generation: string;
  yearMin: string;
  yearMax: string;
  sortBy: string;
}

interface SearchWithFiltersProps {
  className?: string;
  /** Auto-focus the text input on mount (e.g. when mobile search bar opens) */
  autoFocus?: boolean;
}

// ── Hoisted constants ─────────────────────────────────────────────────────────

const TYPE_ORDER: Array<"marque" | "model" | "generation"> = [
  "marque",
  "model",
  "generation",
];

const DEFAULT_FILTERS: FilterState = {
  marque: "",
  model: "",
  generation: "",
  yearMin: "",
  yearMax: "",
  sortBy: "make_asc",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  marque: (
    <Building2 className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
  ),
  model: <Car className="h-4 w-4 text-blue-500 shrink-0" aria-hidden="true" />,
  generation: (
    <Calendar
      className="h-4 w-4 text-emerald-500 shrink-0"
      aria-hidden="true"
    />
  ),
};

const TYPE_LABELS: Record<string, string> = {
  marque: "Marques",
  model: "Modèles",
  generation: "Générations",
};

const TYPE_BADGES: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  marque: { label: "Marque", variant: "secondary" },
  model: { label: "Modèle", variant: "outline" },
  generation: { label: "Fiche", variant: "default" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSuggestionLabel(suggestion: Suggestion): string {
  if (suggestion.type === "generation") {
    return `${suggestion.brand} ${suggestion.model} - ${suggestion.generation}`;
  }
  if (suggestion.type === "model") {
    return `${suggestion.brand} ${suggestion.model}`;
  }
  return suggestion.brand;
}

async function fetchSuggestions(
  query: string,
  brand?: string,
): Promise<{ data: Suggestion[] }> {
  if (!query || query.length < 2) return { data: [] };
  const params = new URLSearchParams({ q: query });
  if (brand) params.set("brand", brand);
  const response = await axios.get(`/api/car/suggestions?${params.toString()}`);
  return response.data;
}

// ── Chip component ────────────────────────────────────────────────────────────

function Chip({
  label,
  logoUrl,
  onRemove,
}: {
  label: string;
  logoUrl?: string | null;
  onRemove: () => void;
}) {
  return (
    <span className="flex items-center gap-1 shrink-0 rounded-md bg-primary/10 text-primary text-xs font-medium pl-1.5 pr-1 py-0.5 border border-primary/20">
      {logoUrl && (
        <span className="relative w-3.5 h-3.5 shrink-0">
          <Image
            src={logoUrl}
            alt=""
            fill
            sizes="14px"
            className="object-contain"
            unoptimized
          />
        </span>
      )}
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 rounded-sm hover:bg-primary/20 transition-colors p-0.5"
        aria-label={`Retirer ${label}`}
      >
        <X className="h-2.5 w-2.5" aria-hidden="true" />
      </button>
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SearchWithFilters({ className, autoFocus }: SearchWithFiltersProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when autoFocus is set (mobile search bar opening)
  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [autoFocus]);

  // Search state
  const [query, setQuery] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  // Keyboard navigation
  const [activeIndex, setActiveIndex] = useState(-1);

  // Chip selections
  const [selectedBrand, setSelectedBrand] = useState<{
    name: string;
    logo_url: string | null;
  } | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Filter state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // ── Suggestions query ───────────────────────────────────────────────────────

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["suggestions", debouncedQuery, selectedBrand?.name],
    queryFn: () => fetchSuggestions(debouncedQuery, selectedBrand?.name),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60 * 1000,
  });

  const groupedSuggestions = useMemo(() => {
    if (!suggestions?.data) return null;
    return suggestions.data.reduce(
      (acc, s) => {
        acc[s.type] = acc[s.type] || [];
        acc[s.type].push(s);
        return acc;
      },
      {} as Record<string, Suggestion[]>,
    );
  }, [suggestions]);

  // Flat ordered list for keyboard navigation
  const flatSuggestions = useMemo(() => {
    if (!groupedSuggestions) return [];
    return TYPE_ORDER.flatMap((type) => groupedSuggestions[type] ?? []);
  }, [groupedSuggestions]);

  const hasResults = flatSuggestions.length > 0;

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [flatSuggestions]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const item = listRef.current.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const clearBrand = useCallback(() => {
    setSelectedBrand(null);
    setSelectedModel(null);
    inputRef.current?.focus();
  }, []);

  const clearModel = useCallback(() => {
    setSelectedModel(null);
    inputRef.current?.focus();
  }, []);

  const handleSelect = useCallback(
    (suggestion: Suggestion) => {
      setSuggestionsOpen(false);
      setQuery("");
      setActiveIndex(-1);

      if (suggestion.type === "generation" && suggestion.id_car_generation) {
        router.push(`/specification/${suggestion.id_car_generation}`);
        return;
      }
      if (suggestion.type === "model") {
        setSelectedBrand({
          name: suggestion.brand,
          logo_url: suggestion.logo_url ?? null,
        });
        setSelectedModel(suggestion.model);
        inputRef.current?.focus();
        return;
      }
      setSelectedBrand({
        name: suggestion.brand,
        logo_url: suggestion.logo_url ?? null,
      });
      setSelectedModel(null);
      inputRef.current?.focus();
    },
    [router],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSuggestionsOpen(false);
      setActiveIndex(-1);

      if (selectedBrand) {
        const params = new URLSearchParams();
        params.set("marque", selectedBrand.name);
        if (selectedModel) params.set("model", selectedModel);
        router.push(`/specification?${params.toString()}`);
        return;
      }
      if (query.trim()) {
        router.push(
          `/specification?marque=${encodeURIComponent(query.trim())}`,
        );
      }
    },
    [selectedBrand, selectedModel, query, router],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setSuggestionsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        return;
      }

      if (!suggestionsOpen || !hasResults) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1 >= flatSuggestions.length ? 0 : i + 1));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? flatSuggestions.length - 1 : i - 1));
        return;
      }

      if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        handleSelect(flatSuggestions[activeIndex]);
        return;
      }
    },
    [suggestionsOpen, hasResults, flatSuggestions, activeIndex, handleSelect],
  );

  // Filter handlers
  const handleFilterChange = useCallback((type: string, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [type]: value };
      if (type === "marque") {
        next.model = "";
        next.generation = "";
      }
      if (type === "model") {
        next.generation = "";
      }
      return next;
    });
  }, []);

  const activeCount = [
    filters.marque,
    filters.model,
    filters.generation,
    filters.yearMin,
    filters.yearMax,
    filters.sortBy !== "make_asc" ? filters.sortBy : "",
  ].filter(Boolean).length;

  const handleApplyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.marque) params.set("marque", filters.marque);
    if (filters.model) params.set("model", filters.model);
    if (filters.generation) params.set("generation", filters.generation);
    if (filters.yearMin) params.set("yearMin", filters.yearMin);
    if (filters.yearMax) params.set("yearMax", filters.yearMax);
    if (filters.sortBy && filters.sortBy !== "make_asc")
      params.set("sortBy", filters.sortBy);
    router.push(`/specification?${params.toString()}`);
    setFiltersOpen(false);
  }, [filters, router]);

  const placeholder = selectedBrand
    ? selectedModel
      ? "Appuyer sur Rechercher…"
      : "Tapez un modèle…"
    : "Rechercher une marque, modèle ou génération…";

  // ── Render ──────────────────────────────────────────────────────────────────

  // Build indexed groups for rendering
  const indexedGroups = useMemo(() => {
    if (!groupedSuggestions) return [];
    let flatIndex = 0;
    return TYPE_ORDER.filter((t) => groupedSuggestions[t]?.length).map(
      (type) => {
        const items = groupedSuggestions[type].map((s) => ({
          suggestion: s,
          index: flatIndex++,
        }));
        return { type, items };
      },
    );
  }, [groupedSuggestions]);

  return (
    <div className={cn("relative", className)}>
      <Popover
        open={suggestionsOpen && hasResults}
        onOpenChange={setSuggestionsOpen}
      >
        <PopoverAnchor asChild>
          <form
            onSubmit={handleSubmit}
            role="search"
            className={cn(
              "flex items-center gap-1.5",
              "rounded-lg border-2 border-transparent bg-secondary/50",
              "transition-all focus-within:border-primary focus-within:bg-background focus-within:shadow-lg focus-within:shadow-primary/5",
            )}
          >
            <Search
              className="ml-3 h-4 w-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />

            {selectedBrand && (
              <Chip
                label={selectedBrand.name}
                logoUrl={selectedBrand.logo_url}
                onRemove={clearBrand}
              />
            )}
            {selectedModel && (
              <Chip label={selectedModel} onRemove={clearModel} />
            )}

            {!selectedModel && (
              <input
                ref={inputRef}
                type="search"
                placeholder={placeholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.length >= 2) setSuggestionsOpen(true);
                }}
                onFocus={() =>
                  debouncedQuery.length >= 2 && setSuggestionsOpen(true)
                }
                onKeyDown={handleKeyDown}
                autoComplete="off"
                aria-label="Rechercher des fiches techniques"
                aria-haspopup="listbox"
                aria-controls="search-suggestions"
                aria-autocomplete="list"
                aria-activedescendant={
                  activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
                }
                className="h-11 flex-1 min-w-0 bg-transparent px-2 text-sm outline-none focus-visible:ring-0 placeholder:text-muted-foreground/70"
              />
            )}
            {selectedModel && <span className="flex-1" />}

            {isLoading && (
              <Loader2
                className="h-4 w-4 shrink-0 animate-spin text-primary mr-1"
                aria-hidden="true"
              />
            )}

            <Button
              type="submit"
              size="sm"
              className="h-8 px-3 mr-1 gap-1.5 shadow-none shrink-0"
            >
              <span className="hidden sm:inline text-xs">Rechercher</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>

            <Separator orientation="vertical" className="h-5 bg-border/60" />

            <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={
                    activeCount > 0
                      ? `Filtres (${activeCount} actif${activeCount > 1 ? "s" : ""})`
                      : "Filtres de recherche"
                  }
                  className="relative flex items-center gap-1.5 h-11 px-3 text-sm shrink-0 text-muted-foreground hover:text-foreground transition-colors rounded-r-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Filtres</span>
                  {activeCount > 0 && (
                    <Badge className="h-4 w-4 p-0 text-[9px] flex items-center justify-center rounded-full">
                      {activeCount}
                    </Badge>
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-[min(92vw,660px)] p-0 shadow-xl"
                sideOffset={10}
              >
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold">
                      Filtres de recherche
                    </h2>
                    {activeCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setFilters(DEFAULT_FILTERS)}
                        aria-label="Réinitialiser tous les filtres"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Tout réinitialiser
                      </button>
                    )}
                  </div>
                  <SpecificationFilter
                    formState={filters}
                    onFilterChange={handleFilterChange}
                  />
                  <Separator />
                  <div className="flex gap-2">
                    <Button onClick={handleApplyFilters} className="flex-1">
                      Rechercher
                      {activeCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-2 bg-primary-foreground/20 text-primary-foreground"
                        >
                          {activeCount}
                        </Badge>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFiltersOpen(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </form>
        </PopoverAnchor>

        {/* Suggestions dropdown — plain HTML for reliable keyboard control */}
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0 shadow-xl border-border/50"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={() => setSuggestionsOpen(false)}
        >
          <div
            ref={listRef}
            id="search-suggestions"
            role="listbox"
            aria-label="Suggestions de recherche"
            className="max-h-80 overflow-y-auto py-1"
          >
            {indexedGroups.map(({ type, items }) => (
              <div key={type} role="group" aria-label={TYPE_LABELS[type]}>
                {/* Group heading */}
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {TYPE_ICONS[type]}
                  {TYPE_LABELS[type]}
                </div>

                {items.map(({ suggestion, index: fi }) => (
                  <div
                    key={`${type}-${fi}`}
                    id={`suggestion-${fi}`}
                    role="option"
                    aria-selected={fi === activeIndex}
                    data-index={fi}
                    onMouseDown={(e) => {
                      // Prevent input blur before selection fires
                      e.preventDefault();
                      handleSelect(suggestion);
                    }}
                    onMouseEnter={() => setActiveIndex(fi)}
                    onMouseLeave={() => setActiveIndex(-1)}
                    className={cn(
                      "flex items-center gap-3 mx-1 px-3 py-2.5 cursor-pointer rounded-md text-sm transition-colors",
                      fi === activeIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/60",
                    )}
                  >
                    {suggestion.logo_url && (
                      <span className="relative w-5 h-5 shrink-0">
                        <Image
                          src={suggestion.logo_url}
                          alt=""
                          fill
                          sizes="20px"
                          className="object-contain"
                          unoptimized
                        />
                      </span>
                    )}
                    <span className="flex-1 truncate font-medium">
                      {getSuggestionLabel(suggestion)}
                    </span>
                    <Badge
                      variant={TYPE_BADGES[type]?.variant || "secondary"}
                      className="text-xs shrink-0"
                    >
                      {TYPE_BADGES[type]?.label || type}
                    </Badge>
                    {suggestion.type === "generation" && (
                      <ArrowRight
                        className="h-3 w-3 text-muted-foreground shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Footer hint */}
          <div className="border-t border-border px-3 py-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Suggestions intelligentes
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                  ↑↓
                </kbd>
                <span>naviguer</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                  ↵
                </kbd>
                <span>sélectionner</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                  esc
                </kbd>
                <span>fermer</span>
              </span>
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
