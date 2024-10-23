"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, X, MapPin, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CaretSortIcon } from "@radix-ui/react-icons";

interface Localisation {
  code: string;
  nom: string;
  type: "Commune" | "Département" | "Région";
}

const SearchLocalisation = () => {
  const [openLocalisation, setOpenLocalisation] = useState(false);
  const [selectedLocalisations, setSelectedLocalisations] = useState<
    Localisation[]
  >([]);
  const [localisations, setLocalisations] = useState<Localisation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allLocalisations, setAllLocalisations] = useState<Localisation[]>([]);
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);

  const fetchLocalisations = useCallback(async () => {
    if (!searchTerm) {
      setLocalisations([]);
      return;
    }

    try {
      const responses = await Promise.all([
        fetch(
          `https://geo.api.gouv.fr/communes?nom=${searchTerm}&fields=departement&boost=population&limit=5`
        ),
        fetch(`https://geo.api.gouv.fr/departements?nom=${searchTerm}&limit=5`),
        fetch(`https://geo.api.gouv.fr/regions?nom=${searchTerm}&limit=5`),
      ]);

      const [communeData, departementData, regionData] = await Promise.all(
        responses.map((r) => r.json())
      );

      const formattedData: Localisation[] = [
        ...communeData.map((c: any) => ({
          code: c.code,
          nom: c.nom,
          type: "Commune" as const,
        })),
        ...departementData.map((d: any) => ({
          code: d.code,
          nom: d.nom,
          type: "Département" as const,
        })),
        ...regionData.map((r: any) => ({
          code: r.code,
          nom: r.nom,
          type: "Région" as const,
        })),
      ];

      setLocalisations(formattedData);
    } catch (error) {
      console.error("Erreur lors de la récupération des localisations:", error);
      setLocalisations([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchLocalisations();
  }, [fetchLocalisations]);

  useEffect(() => {
    const fetchAllLocalisations = async () => {
      try {
        const responses = await Promise.all([
          fetch("https://geo.api.gouv.fr/communes?fields=nom,code&limit=100"),
          fetch("https://geo.api.gouv.fr/departements"),
          fetch("https://geo.api.gouv.fr/regions"),
        ]);

        const [communeData, departementData, regionData] = await Promise.all(
          responses.map((r) => r.json())
        );

        const formattedData: Localisation[] = [
          ...communeData.map((c: any) => ({
            code: c.code,
            nom: c.nom,
            type: "Commune" as const,
          })),
          ...departementData.map((d: any) => ({
            code: d.code,
            nom: d.nom,
            type: "Département" as const,
          })),
          ...regionData.map((r: any) => ({
            code: r.code,
            nom: r.nom,
            type: "Région" as const,
          })),
        ];

        setAllLocalisations(formattedData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de toutes les localisations:",
          error
        );
      }
    };

    fetchAllLocalisations();
  }, []);

  const toggleLocalisation = useCallback((localisation: Localisation) => {
    setSelectedLocalisations([localisation]);
    setOpenLocalisation(false);
  }, []);

  const removeLocalisation = useCallback((code: string) => {
    setSelectedLocalisations([]);
  }, []);

  const displayedLocalisations = useMemo(() => {
    return searchTerm ? localisations : allLocalisations;
  }, [searchTerm, localisations, allLocalisations]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position.coords);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
        }
      );
    } else {
      console.error(
        "La géolocalisation n'est pas supportée par ce navigateur."
      );
    }
  };

  return (
    <div className="w-full flex justify-center">
      <Popover open={openLocalisation} onOpenChange={setOpenLocalisation}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openLocalisation}
            className="justify-between rounded-xl w-full max-w-md"
            size="lg"
          >
            <MapPin className="mr-2 h-4 w-4" />
            {selectedLocalisations.length > 0
              ? selectedLocalisations[0].nom
              : "Localisation"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full max-w-md">
          <Command>
            <CommandInput
              placeholder="Rechercher une localisation..."
              className="h-9"
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>Aucune localisation trouvée</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  className="py-2 bg-secondary"
                  onSelect={getUserLocation}
                >
                  <Crosshair className="mr-2 h-4 w-4" />
                  Utiliser ma position actuelle
                </CommandItem>
                {displayedLocalisations.map((localisation: Localisation) => (
                  <CommandItem
                    key={`${localisation.type}-${localisation.code}`}
                    value={localisation.nom}
                    onSelect={() => toggleLocalisation(localisation)}
                  >
                    {localisation.nom} ({localisation.type})
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedLocalisations.some(
                          (item) => item.code === localisation.code
                        )
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchLocalisation;
