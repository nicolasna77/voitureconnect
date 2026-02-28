/**
 * Tests — GaragePage component
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

vi.mock("axios", () => ({
  default: { get: vi.fn(), delete: vi.fn() },
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// Mock complex child dialogs so we can focus on page-level logic
vi.mock(
  "@/app/[locale]/(main)/(content)/setting/garage/_components/add-vehicle-dialog",
  () => ({
    AddVehicleDialog: () => <button>Ajouter un véhicule</button>,
  })
);

vi.mock(
  "@/app/[locale]/(main)/(content)/setting/garage/_components/edit-vehicle-dialog",
  () => ({
    EditVehicleDialog: () => null,
  })
);

vi.mock(
  "@/app/[locale]/(main)/(content)/setting/garage/_components/maintenance-dialog",
  () => ({
    MaintenanceDialog: () => null,
  })
);

import { useQuery, useMutation } from "@tanstack/react-query";
import GaragePage from "@/app/[locale]/(main)/(content)/setting/garage/page";
import type { OwnedVehicleWithMaintenance } from "@/app/[locale]/(main)/(content)/setting/garage/_components/types";

const mockUseQuery = vi.mocked(useQuery);
const mockUseMutation = vi.mocked(useMutation);

const MOCK_VEHICLES: OwnedVehicleWithMaintenance[] = [
  {
    id: "v1",
    userId: "user1",
    generationId: 1234,
    trimId: null,
    makeName: "Renault",
    modelName: "Clio",
    generationName: "IV (2012–2019)",
    trimName: null,
    year: 2015,
    km: 120000,
    color: null,
    notes: null,
    purchaseDate: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    maintenances: [],
  },
  {
    id: "v2",
    userId: "user1",
    generationId: 5678,
    trimId: null,
    makeName: "Citroën",
    modelName: "C3",
    generationName: "III (2016–)",
    trimName: null,
    year: 2020,
    km: 40000,
    color: null,
    notes: null,
    purchaseDate: null,
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    maintenances: [],
  },
];

describe("GaragePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useMutation>);
  });

  it("shows loading skeletons while data is loading", () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: true,
    } as unknown as ReturnType<typeof useQuery>);

    const { container } = render(<GaragePage />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("shows empty state when no vehicles", () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<GaragePage />);
    expect(screen.getByText("Votre garage est vide")).toBeInTheDocument();
  });

  it("shows the page title and subtitle", () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<GaragePage />);
    expect(screen.getByText("Mon Garage")).toBeInTheDocument();
    expect(
      screen.getByText(/gérez vos véhicules et suivez leur entretien/i)
    ).toBeInTheDocument();
  });

  it("renders vehicle cards when vehicles are loaded", () => {
    mockUseQuery.mockReturnValue({
      data: MOCK_VEHICLES,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<GaragePage />);
    expect(screen.getByText("Renault Clio")).toBeInTheDocument();
    expect(screen.getByText("Citroën C3")).toBeInTheDocument();
  });

  it("shows 'Ajouter un véhicule' button in header and in empty state", () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<GaragePage />);
    const addBtns = screen.getAllByRole("button", { name: /ajouter un véhicule/i });
    expect(addBtns.length).toBeGreaterThanOrEqual(2);
  });

  it("renders the add vehicle button alongside vehicle cards", () => {
    mockUseQuery.mockReturnValue({
      data: MOCK_VEHICLES,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<GaragePage />);
    // Both header + grid slot render AddVehicleDialog
    const addBtns = screen.getAllByRole("button", { name: /ajouter un véhicule/i });
    expect(addBtns.length).toBeGreaterThanOrEqual(1);
  });
});
