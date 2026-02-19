/**
 * Tests — PrintLayout component (PDF export)
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrintLayout } from "@/app/[locale]/(main)/(content)/specification/[id]/print/print-layout";
import type { Generation } from "@/app/[locale]/(main)/(content)/specification/[id]/_components/types";

const MOCK_GENERATION: Generation = {
  id: 1234,
  name: "Série 3 (E90)",
  year_begin: 2005,
  year_end: 2011,
  carModel: {
    id: 10,
    name: "Série 3",
    carMake: {
      id: 1,
      name: "BMW",
      logo: null,
    },
  },
  series: [
    {
      id: 100,
      name: "Berline",
      commonSpecifications: {
        Moteur: [
          { name: "Cylindrée", value: "1995", unit: "cm³" },
          { name: "Puissance", value: "150", unit: "ch" },
        ],
      },
      trims: [
        {
          id: 1001,
          name: "318d",
          specificationsByCategory: {
            Transmission: [
              { name: "Boîte de vitesses", value: "Manuelle", unit: null },
            ],
          },
        },
      ],
    },
  ],
} as unknown as Generation;

describe("PrintLayout", () => {
  it("renders the vehicle make and model in the header", () => {
    render(<PrintLayout generation={MOCK_GENERATION} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("BMW Série 3");
  });

  it("renders the generation name", () => {
    render(<PrintLayout generation={MOCK_GENERATION} />);
    expect(screen.getByText(/série 3 \(e90\)/i)).toBeInTheDocument();
  });

  it("renders the year range", () => {
    render(<PrintLayout generation={MOCK_GENERATION} />);
    expect(screen.getByText(/2005.*2011/i)).toBeInTheDocument();
  });

  it("renders the voitureconnect.fr branding", () => {
    render(<PrintLayout generation={MOCK_GENERATION} />);
    const brandingElements = screen.getAllByText(/voitureconnect\.fr/i);
    expect(brandingElements.length).toBeGreaterThan(0);
  });

  it("renders spec sections from commonSpecifications", () => {
    render(<PrintLayout generation={MOCK_GENERATION} />);
    expect(screen.getByText("Moteur")).toBeInTheDocument();
    expect(screen.getByText("Cylindrée")).toBeInTheDocument();
    expect(screen.getByText(/1995.*cm³/)).toBeInTheDocument();
  });

  it("renders spec sections from trim specificationsByCategory", () => {
    render(<PrintLayout generation={MOCK_GENERATION} />);
    expect(screen.getByText("Transmission")).toBeInTheDocument();
    expect(screen.getByText("Boîte de vitesses")).toBeInTheDocument();
    expect(screen.getByText("Manuelle")).toBeInTheDocument();
  });

  it("renders the footer with generation date", () => {
    render(<PrintLayout generation={MOCK_GENERATION} />);
    expect(screen.getByText(/fiche générée le/i)).toBeInTheDocument();
  });

  it("does not render a section when specs array is empty", () => {
    const generationNoSpecs: Generation = {
      ...MOCK_GENERATION,
      series: [
        {
          id: 101,
          name: "Berline",
          commonSpecifications: { Carrosserie: [] },
          trims: [],
        },
      ],
    } as unknown as Generation;

    render(<PrintLayout generation={generationNoSpecs} />);
    expect(screen.queryByText("Carrosserie")).not.toBeInTheDocument();
  });
});
