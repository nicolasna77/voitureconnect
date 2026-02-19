"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GarageButtonProps {
  generationId: number;
  makeName: string;
  modelName: string;
  generationName: string;
  trims?: { id_car_trim: number; name: string }[];
  className?: string;
}

export function GarageButton({
  generationId,
  makeName,
  modelName,
  generationName,
  trims = [],
  className,
}: GarageButtonProps) {
  const { data: sessionData } = useSession();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedTrimId, setSelectedTrimId] = useState<number | null>(null);
  const [selectedTrimName, setSelectedTrimName] = useState("");
  const [year, setYear] = useState("");
  const [km, setKm] = useState("");

  const { data: garageIds = [] } = useQuery<number[]>({
    queryKey: ["garageIds"],
    queryFn: async () => {
      const res = await axios.get("/api/garage");
      return (res.data as { generationId: number }[]).map((v) => v.generationId);
    },
    enabled: !!sessionData?.user,
    staleTime: 60 * 1000,
  });

  const isInGarage = garageIds.includes(generationId);

  const { mutate: addToGarage, isPending } = useMutation({
    mutationFn: () =>
      axios.post("/api/garage", {
        generationId,
        trimId: selectedTrimId,
        makeName,
        modelName,
        generationName,
        trimName: selectedTrimName || null,
        year: year ? Number(year) : null,
        km: km ? Number(km) : null,
      }),
    onSuccess: () => {
      toast.success("Ajouté à votre garage");
      queryClient.invalidateQueries({ queryKey: ["garage"] });
      queryClient.invalidateQueries({ queryKey: ["garageIds"] });
      setOpen(false);
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.info("Ce véhicule est déjà dans votre garage");
        setOpen(false);
      } else {
        toast.error("Erreur lors de l'ajout");
      }
    },
  });

  if (!sessionData?.user) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => (isInGarage ? null : setOpen(true))}
        aria-label={isInGarage ? "Dans votre garage" : "Ajouter à votre garage"}
        className={cn("bg-background/60 backdrop-blur-sm", className)}
        disabled={isInGarage}
      >
        <Car
          className={cn(
            "h-4 w-4 mr-2 transition-colors",
            isInGarage && "text-primary"
          )}
          aria-hidden="true"
        />
        {isInGarage ? "Dans le garage" : "Mon garage"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Ajouter à mon garage</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-muted px-3 py-2 text-sm">
              <span className="font-medium">
                {makeName} {modelName} — {generationName}
              </span>
            </div>

            {trims.length > 0 && (
              <div className="space-y-2">
                <Label>Motorisation (optionnel)</Label>
                <Select
                  onValueChange={(val) => {
                    const trim = trims.find((t) => t.id_car_trim === Number(val));
                    setSelectedTrimId(Number(val));
                    setSelectedTrimName(trim?.name || "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une motorisation" />
                  </SelectTrigger>
                  <SelectContent>
                    {trims.map((trim) => (
                      <SelectItem
                        key={trim.id_car_trim}
                        value={String(trim.id_car_trim)}
                      >
                        {trim.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="gb-year">Année</Label>
                <Input
                  id="gb-year"
                  type="number"
                  placeholder="ex: 2019"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min={1900}
                  max={new Date().getFullYear()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gb-km">Kilométrage</Label>
                <Input
                  id="gb-km"
                  type="number"
                  placeholder="ex: 75000"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  min={0}
                />
              </div>
            </div>

            <Button
              className="w-full"
              disabled={isPending}
              onClick={() => addToGarage()}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
              ) : (
                <Car className="h-4 w-4 mr-2" aria-hidden="true" />
              )}
              Ajouter au garage
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
