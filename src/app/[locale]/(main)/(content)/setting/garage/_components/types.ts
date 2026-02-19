export interface MaintenanceEntry {
  id: string;
  ownedVehicleId: string;
  type: string;
  label: string | null;
  date: string;
  km: number | null;
  notes: string | null;
  nextDueDate: string | null;
  nextDueKm: number | null;
  createdAt: string;
}

export interface OwnedVehicleWithMaintenance {
  id: string;
  userId: string;
  generationId: number;
  trimId: number | null;
  makeName: string;
  modelName: string;
  generationName: string;
  trimName: string | null;
  year: number | null;
  km: number | null;
  color: string | null;
  notes: string | null;
  purchaseDate: string | null;
  createdAt: string;
  updatedAt: string;
  maintenances: MaintenanceEntry[];
}

export const MAINTENANCE_TYPES = [
  { value: "oil_change", label: "Vidange" },
  { value: "timing_belt", label: "Courroie de distribution" },
  { value: "brakes", label: "Freins" },
  { value: "tires", label: "Pneus" },
  { value: "revision", label: "Révision générale" },
  { value: "other", label: "Autre" },
] as const;
