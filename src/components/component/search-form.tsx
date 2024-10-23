"use client";
import React, { useState, useCallback, useMemo } from "react";
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

type FormState = {
  marque: string;
  model: string;
  moteur: string;
  generation: string;
  input: string;
  localisation: string;
  vehicleType: "voiture" | "moto";
};

const SearchForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formState, setFormState] = useState<FormState>({
    marque: searchParams.get("marque") || "",
    model: searchParams.get("model") || "",
    moteur: searchParams.get("moteur") || "",
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
        version: formState.generation,
        moteur: formState.moteur,
        page: "1",
        type: formState.vehicleType,
      }).toString();
      await router.push(`/search?${query}`);
    },
  });

  const { data: suggestionsData } = useQuery<string[][]>({
    queryKey: ["suggestions", debouncedInput],
    queryFn: async () => {
      if (!debouncedInput) return [];
      const response = await axios.get(
        `/api/car/suggestions?q=${debouncedInput}`
      );
      return response.data.data;
    },
    enabled: debouncedInput.length > 0,
  });

  const handleSuggestionSelect = useCallback(
    (suggestion: string[]) => {
      const [type, brand, model, generation] = suggestion;
      if (type === "marque") {
        updateFormState("marque", brand);
      } else if (type === "model") {
        updateFormState("marque", brand);
        updateFormState("model", model);
      } else if (type === "generation") {
        updateFormState("marque", brand);
        updateFormState("model", model);
        updateFormState("generation", generation);
      }
      updateFormState("input", "");
    },
    [updateFormState]
  );

  const removeParam = useCallback(
    (param: keyof FormState) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete(param);
      router.push(`?${newSearchParams.toString()}`);
      updateFormState(param, "");
    },
    [searchParams, router, updateFormState]
  );

  const CommandSearch = () => {
    const [open, setOpen] = useState(false);

    const handleValueChange = (value: string) => {
      updateFormState("input", value);
      setOpen(!!value);
    };

    const filteredSuggestions = suggestionsData || [];
    console.log(filteredSuggestions);

    return (
      <Command className="rounded-lg border bg-background shadow-md">
        <CommandInput
          placeholder={`Rechercher votre ${formState.vehicleType} ...`}
          onValueChange={handleValueChange}
          value={formState.input}
        />
        <CommandList>
          {open &&
            (filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion, index) => (
                <CommandItem
                  key={index}
                  value={suggestion[0]}
                  onSelect={() => handleSuggestionSelect(suggestion)}
                >
                  {suggestion[0]} {suggestion[2]} {suggestion[3]}
                </CommandItem>
              ))
            ) : (
              <CommandEmpty>Aucune suggestion trouvée</CommandEmpty>
            ))}
        </CommandList>
      </Command>
    );
  };

  return (
    <Card className="bg-card  border-border border-4  max-w-4xl m-auto p-8 relative">
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
          <CommandSearch />
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

      <div className="mt-4 flex flex-wrap gap-2">
        {(
          ["marque", "model", "moteur", "generation", "localisation"] as const
        ).map(
          (param) =>
            formState[param] && (
              <Badge key={param} variant="secondary" className="text-sm">
                {formState[param]}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => removeParam(param)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
        )}
      </div>
    </Card>
  );
};

export default SearchForm;
