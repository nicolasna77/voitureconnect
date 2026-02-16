"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Search, Car, Loader2, Building2, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Suggestion {
  type: "marque" | "model" | "generation";
  brand: string;
  model: string | null;
  generation: string | null;
  id_car_generation?: number;
  logo_url?: string | null;
}

interface SpecificationSearchProps {
  placeholder?: string;
  className?: string;
  size?: "default" | "lg";
  autoFocus?: boolean;
}

// Hoisted helper functions (vercel-react-best-practices: rendering-hoist-jsx)
const TYPE_ICONS: Record<string, React.ReactNode> = {
  marque: <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />,
  model: <Car className="h-4 w-4 text-blue-500" aria-hidden="true" />,
  generation: <Calendar className="h-4 w-4 text-emerald-500" aria-hidden="true" />,
};

const TYPE_LABELS: Record<string, string> = {
  marque: "Marques",
  model: "Modèles",
  generation: "Générations",
};

const TYPE_BADGES: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  marque: { label: "Marque", variant: "secondary" },
  model: { label: "Modèle", variant: "outline" },
  generation: { label: "Fiche", variant: "default" },
};

function getSuggestionLabel(suggestion: Suggestion): string {
  if (suggestion.type === "generation") {
    return `${suggestion.brand} ${suggestion.model} - ${suggestion.generation}`;
  }
  if (suggestion.type === "model") {
    return `${suggestion.brand} ${suggestion.model}`;
  }
  return suggestion.brand;
}

async function fetchSuggestions(query: string): Promise<{ data: Suggestion[] }> {
  if (!query || query.length < 2) return { data: [] };
  const response = await axios.get(
    `/api/car/suggestions?q=${encodeURIComponent(query)}`
  );
  return response.data;
}

export default function SpecificationSearch({
  placeholder = "Rechercher une marque, modèle ou génération…",
  className,
  size = "default",
  autoFocus = false,
}: SpecificationSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["suggestions", debouncedQuery],
    queryFn: () => fetchSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60 * 1000,
  });

  // Memoize grouped suggestions (vercel-react-best-practices: rerender-derived-state-no-effect)
  const groupedSuggestions = useMemo(() => {
    if (!suggestions?.data) return null;
    return suggestions.data.reduce(
      (acc, suggestion) => {
        acc[suggestion.type] = acc[suggestion.type] || [];
        acc[suggestion.type].push(suggestion);
        return acc;
      },
      {} as Record<string, Suggestion[]>
    );
  }, [suggestions?.data]);

  const handleSelect = useCallback(
    (suggestion: Suggestion) => {
      setOpen(false);
      setQuery("");

      if (suggestion.type === "generation" && suggestion.id_car_generation) {
        router.push(`/specification/${suggestion.id_car_generation}`);
      } else if (suggestion.type === "model" && suggestion.model) {
        router.push(
          `/specification?marque=${encodeURIComponent(suggestion.brand)}&model=${encodeURIComponent(suggestion.model)}`
        );
      } else {
        router.push(
          `/specification?marque=${encodeURIComponent(suggestion.brand)}`
        );
      }
    },
    [router]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        setOpen(false);
        router.push(
          `/specification?marque=${encodeURIComponent(query.trim())}`
        );
      }
    },
    [query, router]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setOpen(true);
    }
  }, [debouncedQuery]);

  const isLarge = size === "lg";
  const hasResults = (suggestions?.data?.length ?? 0) > 0;

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Popover open={open && hasResults} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative group">
            {/* Search icon */}
            <Search
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary",
                isLarge ? "h-5 w-5" : "h-4 w-4"
              )}
              aria-hidden="true"
            />

            {/* Input */}
            <Input
              ref={inputRef}
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => debouncedQuery.length >= 2 && setOpen(true)}
              onKeyDown={handleKeyDown}
              className={cn(
                "border-2 border-transparent bg-secondary/50 transition-all",
                "focus:border-primary focus:bg-background focus:shadow-lg focus:shadow-primary/5",
                "placeholder:text-muted-foreground/70",
                isLarge
                  ? "h-14 pl-12 pr-36 text-lg rounded-xl"
                  : "h-11 pl-11 pr-28 rounded-lg"
              )}
              autoFocus={autoFocus}
              autoComplete="off"
              aria-label="Rechercher des fiches techniques"
              aria-expanded={open}
              aria-controls="search-suggestions"
              aria-autocomplete="list"
            />

            {/* Right side: loader + button */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isLoading && (
                <Loader2
                  className="h-4 w-4 animate-spin text-primary"
                  aria-hidden="true"
                />
              )}
              <Button
                type="submit"
                size={isLarge ? "default" : "sm"}
                className={cn(
                  "gap-2 shadow-none",
                  isLarge ? "h-10 px-4" : "h-8 px-3"
                )}
              >
                <span className="hidden sm:inline">Rechercher</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </PopoverAnchor>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 shadow-xl border-border/50"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command id="search-suggestions" className="rounded-lg">
            <CommandList className="max-h-80">
              {!hasResults && debouncedQuery.length >= 2 && !isLoading && (
                <CommandEmpty className="py-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
                    <p className="text-sm text-muted-foreground">
                      Aucun résultat pour "<span className="font-medium text-foreground">{debouncedQuery}</span>"
                    </p>
                  </div>
                </CommandEmpty>
              )}

              {groupedSuggestions &&
                Object.entries(groupedSuggestions).map(([type, items]) => (
                  <CommandGroup
                    key={type}
                    heading={
                      <span className="flex items-center gap-2">
                        {TYPE_ICONS[type]}
                        {TYPE_LABELS[type] || type}
                      </span>
                    }
                    className="px-2"
                  >
                    {items.map((suggestion, index) => (
                      <CommandItem
                        key={`${type}-${index}`}
                        value={getSuggestionLabel(suggestion)}
                        onSelect={() => handleSelect(suggestion)}
                        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md aria-selected:bg-accent"
                      >
                        {suggestion.logo_url && (
                          <span className="relative w-5 h-5 shrink-0">
                            <Image
                              src={suggestion.logo_url}
                              alt=""
                              fill
                              sizes="20px"
                              className="object-contain"
                              quality={100}
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
                          <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
            </CommandList>

            {/* Keyboard hint */}
            <div className="border-t border-border px-3 py-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Suggestions intelligentes
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">↵</kbd>
                <span>sélectionner</span>
                <kbd className="ml-2 px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">esc</kbd>
                <span>fermer</span>
              </span>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </form>
  );
}
