"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Command,
} from "../ui/command";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import SearchLocalisation from "../searchLocalisation";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { useDebounce } from "use-debounce";
import SearchDetail from "./search-detail";
import SearchItemSelect from "./search-item-select";

type FormState = {
  marque: string;
  model: string;
  generation: string;
  input: string;
  localisation: string;
  vehicleType: "voiture" | "moto";
};

const CommandSearch = ({
  value,
  onValueChange,
  suggestions,
  onSuggestionSelect,
}: {
  value: string;
  onValueChange: (value: string) => void;
  suggestions: any[];
  onSuggestionSelect: (
    type: string,
    brand: string,
    model?: string,
    generation?: string
  ) => void;
}) => {
  const [open, setOpen] = useState(false);

  const renderSuggestion = (suggestion: any) => {
    const { type, brand, model, generation } = suggestion;
    switch (type) {
      case "marque":
        return `${brand}`;
      case "model":
        return `${brand} ${model}`;
      case "generation":
        return `${brand} ${model} ${generation}`;
      default:
        return "";
    }
  };

  return (
    <div className="relative">
      <Command className="rounded-lg border shadow-md" shouldFilter={false}>
        <CommandInput
          value={value}
          onValueChange={(newValue) => {
            onValueChange(newValue);
            setOpen(newValue.length > 0);
          }}
          placeholder="Rechercher une voiture..."
        />
        {open && suggestions.length > 0 && (
          <CommandList className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border shadow-md max-h-[300px] overflow-auto z-50">
            <CommandGroup>
              {suggestions.map((suggestion, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    onSuggestionSelect(
                      suggestion.type,
                      suggestion.brand,
                      suggestion.model,
                      suggestion.generation
                    );
                    setOpen(false);
                  }}
                >
                  {renderSuggestion(suggestion)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
};

const SearchForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formState, setFormState] = useState<FormState>({
    marque: searchParams.get("marque") || "",
    model: searchParams.get("model") || "",
    generation: searchParams.get("generation") || "",
    input: searchParams.get("q") || "",
    localisation: searchParams.get("localisation") || "",
    vehicleType: "voiture",
  });

  const [debouncedInput] = useDebounce(formState.input, 300);

  const updateFormState = useCallback((key: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const query = new URLSearchParams({
        q: formState.input,
        marque: formState.marque,
        model: formState.model,
        generation: formState.generation,
        page: "1",
        type: formState.vehicleType,
      }).toString();
      await router.push(`/search?${query}`);
    },
  });

  const { data: suggestions = [] } = useQuery({
    queryKey: ["suggestions", debouncedInput],
    queryFn: async () => {
      if (!debouncedInput) return [];
      const res = await fetch(
        `/api/car/suggestions?q=${encodeURIComponent(debouncedInput)}`
      );
      const data = await res.json();
      return data.data || [];
    },
    enabled: Boolean(debouncedInput),
  });

  const handleSuggestionSelect = useCallback(
    (type: string, brand: string, model?: string, generation?: string) => {
      setFormState((prev) => {
        const newState = { ...prev };

        switch (type) {
          case "marque":
            newState.marque = brand;
            newState.model = "";
            newState.generation = "";
            break;
          case "model":
            newState.marque = brand;
            newState.model = model || "";
            newState.generation = "";
            break;
          case "generation":
            newState.marque = brand;
            newState.model = model || "";
            newState.generation = generation || "";
            break;
        }

        newState.input = "";
        return newState;
      });
    },
    []
  );

  return (
    <Card className="bg-card border-border border-4 max-w-4xl m-auto p-8 relative">
      <Tabs
        defaultValue="voiture"
        className="mb-8 -mt-14 m-auto w-1/2"
        onValueChange={(value: string) => {
          if (value === "voiture" || value === "moto") {
            updateFormState("vehicleType", value);
          }
        }}
      >
        <TabsList className="w-full">
          <TabsTrigger className="w-1/2" value="voiture">
            Voiture
          </TabsTrigger>
          <TabsTrigger className="w-1/2" value="moto">
            Moto
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit.mutate} className="space-y-6">
        <div className="flex flex-col max-w-md m-auto gap-4">
          <CommandSearch
            value={formState.input}
            onValueChange={(value) => updateFormState("input", value)}
            suggestions={suggestions}
            onSuggestionSelect={handleSuggestionSelect}
          />
          <SearchLocalisation />
        </div>

        <div className="grid grid-cols-1 max-w-md m-auto md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SearchDetail
            type="marque"
            placeholder="Marque"
            initialValue={formState.marque}
            onValueChange={(value) => updateFormState("marque", value)}
            parentFormState={formState}
          />
          <SearchDetail
            type="model"
            placeholder="Modèle"
            initialValue={formState.model}
            onValueChange={(value) => updateFormState("model", value)}
            parentFormState={formState}
            disabled={!formState.marque}
          />
          <SearchDetail
            type="generation"
            placeholder="Generation"
            initialValue={formState.generation}
            onValueChange={(value) => updateFormState("generation", value)}
            parentFormState={formState}
            disabled={!formState.model}
          />
        </div>

        <div className="flex justify-center mt-6">
          <Button
            type="submit"
            className="text-md tracking-wider font-bold px-8 py-3"
            variant="default"
            size="lg"
          >
            Rechercher
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SearchForm;
