import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/prisma";
import {
  categorizeSpecifications,
  sortTrimsByEngineAndFinition,
  getCommonSpecifications,
} from "@/lib/car-specs";
import { PrintLayout } from "./print-layout";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const generation = await prisma.carGenerationFR.findUnique({
    where: { id_car_generation: parseInt(id) },
    include: { carModel: { include: { carMake: true } } },
  });

  if (!generation) return {};

  const make = generation.carModel?.carMake?.name || "";
  const model = generation.carModel?.name || "";
  const gen = generation.name || "";

  return {
    title: `Fiche technique — ${make} ${model} ${gen}`,
  };
}

async function getGenerationForPrint(id: string) {
  const generation = await prisma.carGenerationFR.findUnique({
    where: { id_car_generation: parseInt(id) },
    include: {
      carModel: { include: { carMake: true } },
    },
  });

  if (!generation) return null;

  const trims = await prisma.carTrimFR.findMany({
    where: { id_car_model: generation.id_car_model },
    include: {
      specifications: {
        include: {
          carSpecification: { select: { name: true, id_parent: true } },
        },
      },
    },
  });

  const sortedTrims = sortTrimsByEngineAndFinition(trims);
  const commonSpecs = getCommonSpecifications(sortedTrims);
  const commonSpecsByCategory = categorizeSpecifications(commonSpecs);

  const virtualSeries =
    sortedTrims.length > 0
      ? [
          {
            id_car_serie: 0,
            name: generation.carModel?.name || "Motorisations",
            commonSpecifications: commonSpecsByCategory,
            trims: sortedTrims.map((trim) => {
              const uniqueSpecs = trim.specifications.filter(
                (spec) =>
                  !commonSpecs.some(
                    (cs) =>
                      cs.carSpecification.name === spec.carSpecification.name &&
                      cs.value === spec.value &&
                      cs.unit === spec.unit
                  )
              );
              return {
                ...trim,
                specificationsByCategory: categorizeSpecifications(uniqueSpecs),
              };
            }),
          },
        ]
      : [];

  return {
    ...generation,
    series: virtualSeries,
  };
}

export default async function PrintPage({ params }: Props) {
  const { id } = await params;
  const generation = await getGenerationForPrint(id);

  if (!generation) return notFound();

  return (
    <>
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { margin: 0; }
          .no-print { display: none !important; }
        }
        @page {
          size: A4;
          margin: 0;
        }
      `}</style>

      {/* Print trigger button (hidden on print) */}
      <div
        className="no-print"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 100,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          onClick={() => window.print()}
          style={{
            background: "#0f172a",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 14,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Imprimer / Enregistrer PDF
        </button>
        <button
          onClick={() => window.close()}
          style={{
            background: "#e2e8f0",
            color: "#0f172a",
            border: "none",
            padding: "8px 16px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 14,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Fermer
        </button>
      </div>

      {/* Auto-print script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', function() {
              setTimeout(function() { window.print(); }, 500);
            });
          `,
        }}
      />

      <PrintLayout generation={generation as Parameters<typeof PrintLayout>[0]["generation"]} />
    </>
  );
}
