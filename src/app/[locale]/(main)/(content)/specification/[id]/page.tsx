import type { Metadata } from "next";
import { Suspense } from "react";
import prisma from "@/prisma";
import { SpecificationDetailPage } from "./client-page";
import { LoadingState } from "./_components/loading-state";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

async function getGeneration(id: string) {
  return prisma.carGenerationFR.findUnique({
    where: { id_car_generation: parseInt(id) },
    include: {
      carModel: {
        include: { carMake: true },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;

  try {
    const generation = await getGeneration(id);

    if (!generation) {
      return {
        title: "Fiche technique introuvable",
      };
    }

    const makeName = generation.carModel?.carMake?.name || "";
    const modelName = generation.carModel?.name || "";
    const genName = generation.name || "";
    const yearRange = [generation.year_begin, generation.year_end || "présent"]
      .filter(Boolean)
      .join(" - ");

    const title = `${makeName} ${modelName} ${genName} - Fiche technique`;
    const description = `Fiche technique complète ${makeName} ${modelName} ${genName} (${yearRange}). Caractéristiques moteur, dimensions, performances, consommation et analyse IA de fiabilité.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        locale: locale === "fr" ? "fr_FR" : "en_US",
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
      alternates: {
        canonical: `/${locale}/specification/${id}`,
        languages: {
          fr: `/fr/specification/${id}`,
          en: `/en/specification/${id}`,
        },
      },
    };
  } catch {
    return {
      title: "Fiche technique",
    };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  let jsonLd: object | null = null;
  try {
    const generation = await getGeneration(id);
    if (generation) {
      const makeName = generation.carModel?.carMake?.name || "";
      const modelName = generation.carModel?.name || "";
      const genName = generation.name || "";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Car",
        name: `${makeName} ${modelName} ${genName}`.trim(),
        brand: { "@type": "Brand", name: makeName },
        model: modelName,
        vehicleModelDate: generation.year_begin ?? undefined,
      };
    }
  } catch {
    // JSON-LD is optional — don't fail the page render
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Suspense fallback={<LoadingState />}>
        <SpecificationDetailPage />
      </Suspense>
    </>
  );
}
