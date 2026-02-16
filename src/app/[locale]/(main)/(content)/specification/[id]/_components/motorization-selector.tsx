import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cog } from "lucide-react";
import type { Generation } from "./types";
import { getAllTrims } from "./helpers";

export function MotorizationSelector({
  generation,
  selectedTrimId,
  onSelect,
}: {
  generation: Generation;
  selectedTrimId: string;
  onSelect: (trimId: string) => void;
}) {
  const allTrims = useMemo(() => getAllTrims(generation), [generation]);

  if (allTrims.length <= 1) return null;

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Cog className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold">Motorisation</p>
              <p className="text-xs text-muted-foreground">
                {allTrims.length} disponible{allTrims.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Select value={selectedTrimId} onValueChange={onSelect}>
            <SelectTrigger className="sm:flex-1 h-11 border-2 border-transparent focus:border-primary transition-colors" aria-label="Choisir une motorisation">
              <SelectValue placeholder="Choisir une motorisation" />
            </SelectTrigger>
            <SelectContent>
              {allTrims.map(({ trim }) => (
                <SelectItem
                  key={trim.id_car_trim}
                  value={trim.id_car_trim.toString()}
                >
                  {trim.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
