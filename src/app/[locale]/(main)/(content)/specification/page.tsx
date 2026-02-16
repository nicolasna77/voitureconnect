import type { Metadata } from "next";
import { SpecificationPage } from "./client-page";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title =
    locale === "fr"
      ? "Fiches techniques automobiles"
      : "Car technical specifications";
  const description =
    locale === "fr"
      ? "Consultez les fiches techniques complètes de milliers de véhicules. Motorisations, dimensions, performances, consommation et analyse IA de fiabilité."
      : "Browse complete technical specifications for thousands of vehicles. Engine, dimensions, performance, fuel consumption and AI reliability analysis.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/specification`,
      languages: {
        fr: "/fr/specification",
        en: "/en/specification",
      },
    },
  };
}

export default function Page() {
  return <SpecificationPage />;
}
