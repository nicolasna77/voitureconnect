"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Search } from "lucide-react";

interface Make {
  id_car_make: number;
  name: string;
}

interface Model {
  id_car_model: number;
  name: string;
}

interface Generation {
  id_car_generation: number;
  name: string;
  year_begin: string | null;
  year_end: string | null;
}

interface Trim {
  id_car_trim: number;
  name: string;
}

interface AddVehicleDialogProps {
  initialGenerationId?: number;
  initialMakeName?: string;
  initialModelName?: string;
  initialGenerationName?: string;
}

export function AddVehicleDialog({
  initialGenerationId,
  initialMakeName,
  initialModelName,
  initialGenerationName,
}: AddVehicleDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const [makeName, setMakeName] = useState(initialMakeName || "");
  const [modelName, setModelName] = useState(initialModelName || "");
  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [selectedGenerationId, setSelectedGenerationId] = useState<number | null>(
    initialGenerationId || null
  );
  const [selectedGenerationName, setSelectedGenerationName] = useState(
    initialGenerationName || ""
  );
  const [selectedTrimId, setSelectedTrimId] = useState<number | null>(null);
  const [selectedTrimName, setSelectedTrimName] = useState("");
  const [year, setYear] = useState("");
  const [km, setKm] = useState("");
  const [color, setColor] = useState("");

  const { data: makes = [], isFetching: makesLoading } = useQuery<Make[]>({
    queryKey: ["makes"],
    queryFn: async () => {
      const res = await axios.get("/api/car/brand");
      return res.data;
    },
    enabled: open,
    staleTime: 10 * 60 * 1000,
  });

  const { data: models = [], isFetching: modelsLoading } = useQuery<Model[]>({
    queryKey: ["models", selectedMakeId],
    queryFn: async () => {
      const res = await axios.get(`/api/car/model?makeId=${selectedMakeId}`);
      return res.data;
    },
    enabled: !!selectedMakeId,
    staleTime: 10 * 60 * 1000,
  });

  const { data: generations = [], isFetching: generationsLoading } = useQuery<Generation[]>({
    queryKey: ["generations", selectedModelId],
    queryFn: async () => {
      const res = await axios.get(`/api/car/generation?modelId=${selectedModelId}`);
      return res.data;
    },
    enabled: !!selectedModelId,
    staleTime: 10 * 60 * 1000,
  });

  const { data: detail } = useQuery({
    queryKey: ["detail", selectedGenerationId],
    queryFn: async () => {
      const res = await axios.get(`/api/car/detail?id=${selectedGenerationId}`);
      return res.data;
    },
    enabled: !!selectedGenerationId,
    staleTime: 10 * 60 * 1000,
  });

  const trims: Trim[] = [];
  if (detail?.series) {
    for (const serie of detail.series) {
      for (const trim of serie.trims || []) {
        trims.push({ id_car_trim: trim.id_car_trim, name: trim.name });
      }
    }
  }

  const { mutate: addVehicle, isPending } = useMutation({
    mutationFn: () =>
      axios.post("/api/garage", {
        generationId: selectedGenerationId,
        trimId: selectedTrimId,
        makeName,
        modelName,
        generationName: selectedGenerationName,
        trimName: selectedTrimName || null,
        year: year ? Number(year) : null,
        km: km ? Number(km) : null,
        color: color || null,
      }),
    onSuccess: () => {
      toast.success("Véhicule ajouté au garage");
      queryClient.invalidateQueries({ queryKey: ["garage"] });
      setOpen(false);
      resetForm();
    },
    onError: (err: unknown) => {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 409
      ) {
        toast.error("Ce véhicule est déjà dans votre garage");
      } else {
        toast.error("Erreur lors de l'ajout");
      }
    },
  });

  const resetForm = () => {
    if (!initialGenerationId) {
      setSelectedMakeId(null);
      setSelectedModelId(null);
      setSelectedGenerationId(null);
      setSelectedGenerationName("");
      setMakeName("");
      setModelName("");
    }
    setSelectedTrimId(null);
    setSelectedTrimName("");
    setYear("");
    setKm("");
    setColor("");
  };

  const canSubmit =
    selectedGenerationId && makeName && modelName && selectedGenerationName;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Ajouter un véhicule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter à mon garage</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!initialGenerationId && (
            <>
              <div className="space-y-2">
                <Label>Marque</Label>
                {makesLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Chargement…
                  </div>
                ) : (
                  <Select
                    onValueChange={(val) => {
                      const make = makes.find(
                        (m) => m.id_car_make === Number(val)
                      );
                      setSelectedMakeId(Number(val));
                      setMakeName(make?.name || "");
                      setSelectedModelId(null);
                      setModelName("");
                      setSelectedGenerationId(null);
                      setSelectedGenerationName("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une marque" />
                    </SelectTrigger>
                    <SelectContent>
                      {makes.map((make) => (
                        <SelectItem
                          key={make.id_car_make}
                          value={String(make.id_car_make)}
                        >
                          {make.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {selectedMakeId && (
                <div className="space-y-2">
                  <Label>Modèle</Label>
                  {modelsLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Chargement…
                    </div>
                  ) : (
                    <Select
                      onValueChange={(val) => {
                        const model = models.find(
                          (m) => m.id_car_model === Number(val)
                        );
                        setSelectedModelId(Number(val));
                        setModelName(model?.name || "");
                        setSelectedGenerationId(null);
                        setSelectedGenerationName("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un modèle" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem
                            key={model.id_car_model}
                            value={String(model.id_car_model)}
                          >
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              {selectedModelId && (
                <div className="space-y-2">
                  <Label>Génération</Label>
                  {generationsLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Chargement…
                    </div>
                  ) : (
                    <Select
                      onValueChange={(val) => {
                        const gen = generations.find(
                          (g) => g.id_car_generation === Number(val)
                        );
                        setSelectedGenerationId(Number(val));
                        setSelectedGenerationName(gen?.name || "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une génération" />
                      </SelectTrigger>
                      <SelectContent>
                        {generations.map((gen) => (
                          <SelectItem
                            key={gen.id_car_generation}
                            value={String(gen.id_car_generation)}
                          >
                            {gen.name}
                            {gen.year_begin && ` (${gen.year_begin}${gen.year_end ? `—${gen.year_end}` : ""})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
            </>
          )}

          {initialGenerationId && (
            <div className="rounded-lg bg-muted px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="font-medium">
                  {makeName} {modelName} — {selectedGenerationName}
                </span>
              </div>
            </div>
          )}

          {selectedGenerationId && trims.length > 0 && (
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
              <Label htmlFor="year">Année</Label>
              <Input
                id="year"
                type="number"
                placeholder="ex: 2018"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min={1900}
                max={new Date().getFullYear()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="km">Kilométrage</Label>
              <Input
                id="km"
                type="number"
                placeholder="ex: 85000"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Couleur (optionnel)</Label>
            <Input
              id="color"
              type="text"
              placeholder="ex: Gris anthracite"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            disabled={!canSubmit || isPending}
            onClick={() => addVehicle()}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                Ajout en cours…
              </>
            ) : (
              "Ajouter au garage"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
