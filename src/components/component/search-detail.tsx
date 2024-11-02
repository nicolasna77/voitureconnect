"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Command,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type SearchDetailProps = {
  type: "marque" | "model" | "generation";
  placeholder: string;
  initialValue?: string;
  onValueChange: (value: string) => void;
  parentFormState: any;
  disabled?: boolean;
};

const SearchDetail: React.FC<SearchDetailProps> = ({
  type,
  placeholder,
  initialValue = "",
  onValueChange,
  parentFormState,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(initialValue);
  const queryClient = useQueryClient();

  const { data, error } = useQuery<{ name: string }[]>({
    queryKey: [type, parentFormState.marque, parentFormState.model],
    queryFn: async () => {
      let url = "/api/car/";
      switch (type) {
        case "marque":
          url += "brand";
          break;
        case "model":
          if (!parentFormState.marque) {
            return [];
          }
          url += `model?name=${encodeURIComponent(parentFormState.marque)}`;
          break;
        case "generation":
          if (!parentFormState.model) {
            return [];
          }
          url += `generation?model=${encodeURIComponent(
            parentFormState.model
          )}`;
          break;
      }
      const response = await axios.get(url);
      return response.data.data;
    },
    enabled:
      type === "marque" ||
      (type === "model" && !!parentFormState.marque) ||
      (type === "generation" && !!parentFormState.model),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });

  if (error) {
    console.error("Une erreur s'est produite:", error);
    return (
      <div>{"Une erreur s'est produite. Veuillez réessayer plus tard."}</div>
    );
  }

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    onValueChange(currentValue);
    setIsOpen(false);

    // Préchargement des données pour le prochain niveau
    if (type === "marque") {
      queryClient.prefetchQuery({
        queryKey: ["model", currentValue],
        queryFn: () =>
          axios
            .get(`/api/car/model?name=${encodeURIComponent(currentValue)}`)
            .then((res) => res.data.data),
      });
    } else if (type === "model") {
      queryClient.prefetchQuery({
        queryKey: ["generation", currentValue],
        queryFn: () =>
          axios
            .get(
              `/api/car/generation?model=${encodeURIComponent(currentValue)}`
            )
            .then((res) => res.data.data),
      });
    }
  };

  // Réinitialisation des valeurs si nécessaire
  if (type === "model" && !parentFormState.marque && value !== "") {
    setValue("");
    onValueChange("");
  }
  if (type === "generation" && !parentFormState.model && value !== "") {
    setValue("");
    onValueChange("");
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between overflow-hidden"
          disabled={disabled}
        >
          {value || placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Rechercher un ${placeholder.toLowerCase()}...`}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              Pas de {placeholder.toLowerCase()} trouvé
            </CommandEmpty>
            <CommandGroup>
              {data &&
                data.map((item: { name: string }) => (
                  <CommandItem
                    key={item.name}
                    value={item.name}
                    onSelect={handleSelect}
                  >
                    {item.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchDetail;
