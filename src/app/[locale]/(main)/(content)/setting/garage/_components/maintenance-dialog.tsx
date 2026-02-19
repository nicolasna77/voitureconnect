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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Wrench, Droplets } from "lucide-react";
import type { OwnedVehicleWithMaintenance, MaintenanceEntry } from "./types";
import { MAINTENANCE_TYPES } from "./types";
import { cn } from "@/lib/utils";

interface MaintenanceDialogProps {
  vehicle: OwnedVehicleWithMaintenance | null;
  onClose: () => void;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  oil_change: <Droplets className="h-4 w-4" aria-hidden="true" />,
  timing_belt: <Wrench className="h-4 w-4" aria-hidden="true" />,
  brakes: <Wrench className="h-4 w-4" aria-hidden="true" />,
  tires: <Wrench className="h-4 w-4" aria-hidden="true" />,
  revision: <Wrench className="h-4 w-4" aria-hidden="true" />,
  other: <Wrench className="h-4 w-4" aria-hidden="true" />,
};

function getTypeLabel(type: string): string {
  return MAINTENANCE_TYPES.find((t) => t.value === type)?.label || type;
}

export function MaintenanceDialog({ vehicle, onClose }: MaintenanceDialogProps) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("");
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const [km, setKm] = useState("");
  const [notes, setNotes] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [nextDueKm, setNextDueKm] = useState("");

  const { data: entries = [], isFetching } = useQuery<MaintenanceEntry[]>({
    queryKey: ["maintenance", vehicle?.id],
    queryFn: async () => {
      const res = await axios.get(`/api/maintenance?vehicleId=${vehicle!.id}`);
      return res.data;
    },
    enabled: !!vehicle,
  });

  const { mutate: addEntry, isPending } = useMutation({
    mutationFn: () =>
      axios.post("/api/maintenance", {
        ownedVehicleId: vehicle?.id,
        type,
        label: label || null,
        date,
        km: km ? Number(km) : null,
        notes: notes || null,
        nextDueDate: nextDueDate || null,
        nextDueKm: nextDueKm ? Number(nextDueKm) : null,
      }),
    onSuccess: () => {
      toast.success("Entretien ajouté");
      queryClient.invalidateQueries({ queryKey: ["maintenance", vehicle?.id] });
      queryClient.invalidateQueries({ queryKey: ["garage"] });
      setShowForm(false);
      resetForm();
    },
    onError: () => toast.error("Erreur lors de l'ajout"),
  });

  const { mutate: deleteEntry } = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/maintenance/${id}`),
    onSuccess: () => {
      toast.success("Entrée supprimée");
      queryClient.invalidateQueries({ queryKey: ["maintenance", vehicle?.id] });
      queryClient.invalidateQueries({ queryKey: ["garage"] });
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const resetForm = () => {
    setType("");
    setLabel("");
    setDate("");
    setKm("");
    setNotes("");
    setNextDueDate("");
    setNextDueKm("");
  };

  const isOverdue = (entry: MaintenanceEntry) => {
    if (!entry.nextDueDate) return false;
    return new Date(entry.nextDueDate) < new Date();
  };

  return (
    <Dialog open={!!vehicle} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Entretien — {vehicle?.makeName} {vehicle?.modelName}
          </DialogTitle>
        </DialogHeader>

        {/* Entries list */}
        <div className="space-y-3">
          {isFetching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Chargement" />
            </div>
          ) : entries.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-4">
              Aucun entretien enregistré
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "flex items-start justify-between rounded-lg border p-3 text-sm",
                  isOverdue(entry) && "border-destructive/50 bg-destructive/5"
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 text-muted-foreground">
                    {TYPE_ICONS[entry.type] || <Wrench className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">
                      {entry.label || getTypeLabel(entry.type)}
                    </p>
                    <p className="text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString("fr-FR")}
                      {entry.km && ` · ${entry.km.toLocaleString("fr-FR")} km`}
                    </p>
                    {entry.nextDueDate && (
                      <Badge
                        variant={isOverdue(entry) ? "destructive" : "outline"}
                        className="mt-1 text-xs"
                      >
                        Prochain :{" "}
                        {new Date(entry.nextDueDate).toLocaleDateString("fr-FR")}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive h-7 w-7 p-0"
                  onClick={() => deleteEntry(entry.id)}
                  aria-label="Supprimer cette entrée"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Add form */}
        {showForm ? (
          <div className="border-t pt-4 space-y-3">
            <h3 className="text-sm font-semibold">Nouvel entretien</h3>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'entretien" />
                </SelectTrigger>
                <SelectContent>
                  {MAINTENANCE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maint-label">Label (optionnel)</Label>
              <Input
                id="maint-label"
                placeholder="ex: Vidange 15 000 km"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="maint-date">Date *</Label>
                <Input
                  id="maint-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maint-km">Kilométrage</Label>
                <Input
                  id="maint-km"
                  type="number"
                  placeholder="ex: 85000"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  min={0}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="maint-next-date">Prochain entretien</Label>
                <Input
                  id="maint-next-date"
                  type="date"
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maint-next-km">Prochain km</Label>
                <Input
                  id="maint-next-km"
                  type="number"
                  placeholder="ex: 100000"
                  value={nextDueKm}
                  onChange={(e) => setNextDueKm(e.target.value)}
                  min={0}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maint-notes">Notes</Label>
              <Textarea
                id="maint-notes"
                placeholder="Remarques sur l'entretien…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Annuler
              </Button>
              <Button
                className="flex-1"
                disabled={!type || !date || isPending}
                onClick={() => addEntry()}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  "Ajouter"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Ajouter un entretien
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
