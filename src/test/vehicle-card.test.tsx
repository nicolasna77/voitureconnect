/**
 * Tests — VehicleCard component
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockInvalidateQueries = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

vi.mock("axios", () => {
  const mockAxios = {
    delete: vi.fn().mockResolvedValue({}),
  };
  return { default: mockAxios };
});

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { useMutation } from "@tanstack/react-query";
import { VehicleCard } from "@/app/[locale]/(main)/(content)/setting/garage/_components/vehicle-card";
import type { OwnedVehicleWithMaintenance } from "@/app/[locale]/(main)/(content)/setting/garage/_components/types";

const mockUseMutation = vi.mocked(useMutation);

const BASE_VEHICLE: OwnedVehicleWithMaintenance = {
  id: "v1",
  userId: "user1",
  generationId: 1234,
  trimId: 5678,
  makeName: "Peugeot",
  modelName: "308",
  generationName: "II (2013–2021)",
  trimName: "1.6 BlueHDi 120",
  year: 2017,
  km: 85000,
  color: "gris",
  notes: null,
  purchaseDate: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  maintenances: [],
};

describe("VehicleCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useMutation>);
  });

  it("renders the vehicle make and model", () => {
    render(
      <VehicleCard
        vehicle={BASE_VEHICLE}
        onEdit={vi.fn()}
        onMaintenance={vi.fn()}
      />
    );
    expect(screen.getByText("Peugeot 308")).toBeInTheDocument();
  });

  it("renders the generation and trim name", () => {
    render(
      <VehicleCard
        vehicle={BASE_VEHICLE}
        onEdit={vi.fn()}
        onMaintenance={vi.fn()}
      />
    );
    expect(screen.getByText(/II \(2013–2021\).*1\.6 BlueHDi 120/)).toBeInTheDocument();
  });

  it("renders year and mileage when provided", () => {
    render(
      <VehicleCard
        vehicle={BASE_VEHICLE}
        onEdit={vi.fn()}
        onMaintenance={vi.fn()}
      />
    );
    expect(screen.getByText("2017")).toBeInTheDocument();
    expect(screen.getByText(/85.*000.*km/)).toBeInTheDocument();
  });

  it("renders color when provided", () => {
    render(
      <VehicleCard
        vehicle={BASE_VEHICLE}
        onEdit={vi.fn()}
        onMaintenance={vi.fn()}
      />
    );
    expect(screen.getByText("gris")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <VehicleCard
        vehicle={BASE_VEHICLE}
        onEdit={onEdit}
        onMaintenance={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /modifier peugeot 308/i })
    );

    expect(onEdit).toHaveBeenCalledWith(BASE_VEHICLE);
  });

  it("calls onMaintenance when maintenance button is clicked", async () => {
    const onMaintenance = vi.fn();
    const user = userEvent.setup();

    render(
      <VehicleCard
        vehicle={BASE_VEHICLE}
        onEdit={vi.fn()}
        onMaintenance={onMaintenance}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /entretien de peugeot 308/i })
    );

    expect(onMaintenance).toHaveBeenCalledWith(BASE_VEHICLE);
  });

  it("shows delete confirmation dialog when delete button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <VehicleCard
        vehicle={BASE_VEHICLE}
        onEdit={vi.fn()}
        onMaintenance={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /supprimer peugeot 308/i })
    );

    expect(screen.getByText("Supprimer le véhicule ?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Annuler" })).toBeInTheDocument();
  });

  it("does NOT show maintenance alert badge when no upcoming maintenance", () => {
    render(
      <VehicleCard
        vehicle={BASE_VEHICLE}
        onEdit={vi.fn()}
        onMaintenance={vi.fn()}
      />
    );
    // Only the action button renders "Entretien" (not the alert badge)
    expect(screen.getAllByText("Entretien").length).toBe(1);
    expect(
      screen.queryByRole("button", { name: /entretien de peugeot 308/i })
    ).toBeInTheDocument();
  });

  it("shows maintenance alert badge when nextDueDate is within 30 days", () => {
    const soonDate = new Date();
    soonDate.setDate(soonDate.getDate() + 10);

    const vehicleWithAlert: OwnedVehicleWithMaintenance = {
      ...BASE_VEHICLE,
      maintenances: [
        {
          id: "m1",
          ownedVehicleId: "v1",
          type: "oil_change",
          label: "Vidange",
          date: "2025-06-01T00:00:00.000Z",
          km: 80000,
          notes: null,
          nextDueDate: soonDate.toISOString(),
          nextDueKm: null,
          createdAt: "2025-06-01T00:00:00.000Z",
        },
      ],
    };

    render(
      <VehicleCard
        vehicle={vehicleWithAlert}
        onEdit={vi.fn()}
        onMaintenance={vi.fn()}
      />
    );

    // Both the alert badge AND the action button contain "Entretien"
    expect(screen.getAllByText("Entretien").length).toBe(2);
  });

  it("shows maintenance count when entries exist", () => {
    const vehicleWithMaintenance: OwnedVehicleWithMaintenance = {
      ...BASE_VEHICLE,
      maintenances: [
        {
          id: "m1",
          ownedVehicleId: "v1",
          type: "oil_change",
          label: "Vidange",
          date: "2025-06-01T00:00:00.000Z",
          km: 80000,
          notes: null,
          nextDueDate: null,
          nextDueKm: null,
          createdAt: "2025-06-01T00:00:00.000Z",
        },
      ],
    };

    render(
      <VehicleCard
        vehicle={vehicleWithMaintenance}
        onEdit={vi.fn()}
        onMaintenance={vi.fn()}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
