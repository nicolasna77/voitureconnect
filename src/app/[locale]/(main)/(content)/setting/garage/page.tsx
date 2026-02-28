"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Car, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddVehicleDialog } from "./_components/add-vehicle-dialog";
import { VehicleCard } from "./_components/vehicle-card";
import { EditVehicleDialog } from "./_components/edit-vehicle-dialog";
import { MaintenanceDialog } from "./_components/maintenance-dialog";
import type { OwnedVehicleWithMaintenance } from "./_components/types";

export default function GaragePage() {
  const [editVehicle, setEditVehicle] = useState<OwnedVehicleWithMaintenance | null>(null);
  const [maintenanceVehicle, setMaintenanceVehicle] =
    useState<OwnedVehicleWithMaintenance | null>(null);

  const { data: vehicles = [], isLoading } = useQuery<OwnedVehicleWithMaintenance[]>({
    queryKey: ["garage"],
    queryFn: async () => {
      const res = await axios.get("/api/garage");
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Mon Garage</h2>
          <p className="text-sm text-muted-foreground">
            Gérez vos véhicules et suivez leur entretien
          </p>
        </div>
        <AddVehicleDialog />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" aria-hidden="true" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Car className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="font-semibold mb-1">Votre garage est vide</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Ajoutez votre premier véhicule pour commencer le suivi d&apos;entretien
          </p>
          <AddVehicleDialog />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={setEditVehicle}
              onMaintenance={setMaintenanceVehicle}
            />
          ))}
          <div className="h-full min-h-[180px] rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <PlusCircle className="h-8 w-8" aria-hidden="true" />
            <AddVehicleDialog />
          </div>
        </div>
      )}

      {/* Dialogs */}
      <EditVehicleDialog
        vehicle={editVehicle}
        onClose={() => setEditVehicle(null)}
      />
      <MaintenanceDialog
        vehicle={maintenanceVehicle}
        onClose={() => setMaintenanceVehicle(null)}
      />
    </div>
  );
}
