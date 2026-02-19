"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Loader2 } from "lucide-react";
import type { OwnedVehicleWithMaintenance } from "./types";

interface EditVehicleDialogProps {
  vehicle: OwnedVehicleWithMaintenance | null;
  onClose: () => void;
}

export function EditVehicleDialog({ vehicle, onClose }: EditVehicleDialogProps) {
  const queryClient = useQueryClient();
  const [km, setKm] = useState("");
  const [color, setColor] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (vehicle) {
      setKm(vehicle.km !== null ? String(vehicle.km) : "");
      setColor(vehicle.color || "");
      setNotes(vehicle.notes || "");
    }
  }, [vehicle]);

  const { mutate: updateVehicle, isPending } = useMutation({
    mutationFn: () =>
      axios.put(`/api/garage/${vehicle?.id}`, {
        km: km ? Number(km) : null,
        color: color || null,
        notes: notes || null,
      }),
    onSuccess: () => {
      toast.success("Véhicule mis à jour");
      queryClient.invalidateQueries({ queryKey: ["garage"] });
      onClose();
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  return (
    <Dialog open={!!vehicle} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            Modifier — {vehicle?.makeName} {vehicle?.modelName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-km">Kilométrage actuel</Label>
            <Input
              id="edit-km"
              type="number"
              placeholder="ex: 92000"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-color">Couleur</Label>
            <Input
              id="edit-color"
              type="text"
              placeholder="ex: Blanc nacré"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              placeholder="Remarques sur le véhicule…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Annuler
            </Button>
            <Button
              className="flex-1"
              disabled={isPending}
              onClick={() => updateVehicle()}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
