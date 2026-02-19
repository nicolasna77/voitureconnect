"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Trash2, Pencil, Wrench, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { OwnedVehicleWithMaintenance } from "./types";

interface VehicleCardProps {
  vehicle: OwnedVehicleWithMaintenance;
  onEdit: (vehicle: OwnedVehicleWithMaintenance) => void;
  onMaintenance: (vehicle: OwnedVehicleWithMaintenance) => void;
}

export function VehicleCard({ vehicle, onEdit, onMaintenance }: VehicleCardProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteVehicle, isPending } = useMutation({
    mutationFn: () => axios.delete(`/api/garage/${vehicle.id}`),
    onSuccess: () => {
      toast.success("Véhicule supprimé du garage");
      queryClient.invalidateQueries({ queryKey: ["garage"] });
      setOpen(false);
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const hasUpcomingMaintenance = vehicle.maintenances.some((m) => {
    if (!m.nextDueDate) return false;
    const dueDate = new Date(m.nextDueDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return dueDate <= thirtyDaysFromNow;
  });

  return (
    <Card className="relative transition-shadow hover:shadow-md">
      {hasUpcomingMaintenance && (
        <div className="absolute top-3 right-3">
          <Badge variant="destructive" className="gap-1 text-xs">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            Entretien
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Car className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base leading-snug">
              {vehicle.makeName} {vehicle.modelName}
            </CardTitle>
            <p className="text-sm text-muted-foreground truncate">
              {vehicle.generationName}
              {vehicle.trimName && ` — ${vehicle.trimName}`}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {vehicle.year && (
            <div>
              <span className="text-muted-foreground">Année</span>
              <p className="font-medium">{vehicle.year}</p>
            </div>
          )}
          {vehicle.km !== null && vehicle.km !== undefined && (
            <div>
              <span className="text-muted-foreground">Kilométrage</span>
              <p className="font-medium">{vehicle.km.toLocaleString("fr-FR")} km</p>
            </div>
          )}
          {vehicle.color && (
            <div>
              <span className="text-muted-foreground">Couleur</span>
              <p className="font-medium capitalize">{vehicle.color}</p>
            </div>
          )}
          {vehicle.maintenances.length > 0 && (
            <div>
              <span className="text-muted-foreground">Entretiens</span>
              <p className="font-medium">{vehicle.maintenances.length}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onMaintenance(vehicle)}
            aria-label={`Entretien de ${vehicle.makeName} ${vehicle.modelName}`}
          >
            <Wrench className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Entretien
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(vehicle)}
            aria-label={`Modifier ${vehicle.makeName} ${vehicle.modelName}`}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Modifier</span>
          </Button>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                aria-label={`Supprimer ${vehicle.makeName} ${vehicle.modelName}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer le véhicule ?</AlertDialogTitle>
                <AlertDialogDescription>
                  {vehicle.makeName} {vehicle.modelName} sera retiré de votre garage ainsi que tout son historique d&apos;entretien.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteVehicle()}
                  disabled={isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
