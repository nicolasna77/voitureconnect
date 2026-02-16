import type { Metadata } from "next";
import prisma from "@/prisma";
import { SpecificationDetailPage } from "./client-page";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;

  try {
    const generation = await prisma.carGenerationFR.findUnique({
      where: { id_car_generation: parseInt(id) },
      include: {
        carModel: {
          include: { carMake: true },
        },
      },
    });

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

export default function Page() {
  return <SpecificationDetailPage />;
}
