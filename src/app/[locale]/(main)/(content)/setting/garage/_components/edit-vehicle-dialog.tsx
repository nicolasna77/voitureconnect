"use client";

import { useRef } from "react";
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

function EditForm({
  vehicle,
  onClose,
}: {
  vehicle: OwnedVehicleWithMaintenance;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const kmRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: updateVehicle, isPending } = useMutation({
    mutationFn: () =>
      axios.put(`/api/garage/${vehicle.id}`, {
        km: kmRef.current?.value ? Number(kmRef.current.value) : null,
        color: colorRef.current?.value || null,
        notes: notesRef.current?.value || null,
      }),
    onSuccess: () => {
      toast.success("Véhicule mis à jour");
      queryClient.invalidateQueries({ queryKey: ["garage"] });
      onClose();
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-km">Kilométrage actuel</Label>
        <Input
          id="edit-km"
          ref={kmRef}
          type="number"
          placeholder="ex: 92000"
          defaultValue={vehicle.km ?? ""}
          min={0}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-color">Couleur</Label>
        <Input
          id="edit-color"
          ref={colorRef}
          type="text"
          placeholder="ex: Blanc nacré"
          defaultValue={vehicle.color ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-notes">Notes</Label>
        <Textarea
          id="edit-notes"
          ref={notesRef}
          placeholder="Remarques sur le véhicule…"
          defaultValue={vehicle.notes ?? ""}
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
  );
}

export function EditVehicleDialog({ vehicle, onClose }: EditVehicleDialogProps) {
  return (
    <Dialog open={!!vehicle} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            Modifier — {vehicle?.makeName} {vehicle?.modelName}
          </DialogTitle>
        </DialogHeader>

        {vehicle && (
          <EditForm key={vehicle.id} vehicle={vehicle} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
