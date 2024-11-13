import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

interface SearchItemSelectProps {
  onRemoveParam: (param: string) => void;
}

const SearchItemSelect = ({ onRemoveParam }: SearchItemSelectProps) => {
  const searchParams = useSearchParams();

  // Filtrer les paramètres valides (exclus page, q et view)
  const validParams = Array.from(searchParams.entries()).filter(
    ([param, value]) =>
      value && param !== "page" && param !== "q" && param !== "view"
  );

  // Si aucun paramètre valide, ne pas rendre le composant
  if (validParams.length === 0) return null;

  const formatParamLabel = (param: string): string => {
    const labels: Record<string, string> = {
      marque: "Marque",
      model: "Modèle",
      generation: "Génération",
      localisation: "Localisation",
      vehicleType: "Type de véhicule",
      fuelType: "Carburant",
      priceMin: "Prix min",
      priceMax: "Prix max",
      yearMin: "Année min",
      yearMax: "Année max",
      transmission: "Boîte de vitesse",
      kmMin: "Km min",
      kmMax: "Km max",
    };
    return labels[param] || param;
  };

  const formatParamValue = (param: string, value: string): string => {
    if (param.includes("price")) {
      return `${value}€`;
    }
    if (param.includes("km")) {
      return `${value}km`;
    }
    return value;
  };

  return (
    <div className="max-w-sm hidden md:block">
      <Carousel className="">
        <CarouselContent>
          {validParams.map(([param, value]) => (
            <CarouselItem key={param} className="basis-auto max-w-sm">
              <Badge variant="outline" className="text-sm">
                {`${formatParamLabel(param)}: ${formatParamValue(
                  param,
                  value
                )}`}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => onRemoveParam(param)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default SearchItemSelect;
