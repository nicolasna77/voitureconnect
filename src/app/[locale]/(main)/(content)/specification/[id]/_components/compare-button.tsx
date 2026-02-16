"use client";

import { Button } from "@/components/ui/button";
import { GitCompareArrows, Check } from "lucide-react";
import { useCompare } from "@/hooks/use-compare";
import type { Generation } from "./types";

export function CompareButton({ generation }: { generation: Generation }) {
  const { add, remove, isInCompare, isFull } = useCompare();

  const inCompare = isInCompare(generation.id_car_generation);

  const handleClick = () => {
    if (inCompare) {
      remove(generation.id_car_generation);
    } else {
      add({
        generationId: generation.id_car_generation,
        makeName: generation.carModel?.carMake?.name || "",
        modelName: generation.carModel?.name || "",
        generationName: generation.name || "",
      });
    }
  };

  return (
    <Button
      variant={inCompare ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={!inCompare && isFull}
      aria-label={inCompare ? "Retirer du comparateur" : "Ajouter au comparateur"}
      className="bg-background/60 backdrop-blur-sm"
    >
      {inCompare ? (
        <Check className="h-4 w-4 mr-2" aria-hidden="true" />
      ) : (
        <GitCompareArrows className="h-4 w-4 mr-2" aria-hidden="true" />
      )}
      {inCompare ? "Comparé" : "Comparer"}
    </Button>
  );
}
