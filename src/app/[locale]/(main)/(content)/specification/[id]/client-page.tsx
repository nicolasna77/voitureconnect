"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "@/i18n/routing";
import { notFound, useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

import type { Generation } from "./_components/types";
import { getAllTrims, getMergedSpecs } from "./_components/helpers";
import { AnimatedSection } from "./_components/animated-section";
import { VehicleHeader } from "./_components/vehicle-header";
import { MotorizationSelector } from "./_components/motorization-selector";
import { QuickStats } from "./_components/quick-stats";
import { AllSpecifications } from "./_components/all-specifications";
import { ErrorState } from "./_components/error-state";
import { LoadingState } from "./_components/loading-state";
import { RecallsSection } from "./_components/recalls-section";
import { CompareButton } from "./_components/compare-button";
import { CommentsSection } from "./_components/comments/comments-section";
import { FavoriteButton } from "@/components/favorite-button";
import { MarketValueWidget } from "@/components/specification/market-value-widget";

const AIReliabilityWidget = dynamic(
  () =>
    import("@/components/ai/reliability-widget").then(
      (mod) => mod.AIReliabilityWidget,
    ),
  {
    ssr: false,
    loading: () => (
      <Card className="animate-pulse motion-reduce:animate-none">
        <CardHeader>
          <div className="h-5 bg-muted rounded w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted rounded" />
        </CardContent>
      </Card>
    ),
  },
);

async function getGenerationDetails(id: string): Promise<Generation> {
  const { data } = await axios.get(`/api/car/detail?id=${id}`);
  return data;
}

export function SpecificationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const locale = useLocale() as "fr" | "en";
  const { data: sessionData } = useSession();
  const historyRecorded = useRef(false);

  const {
    data: generation,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["generation", id],
    queryFn: () => getGenerationDetails(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Get all trims and default to first one
  const allTrims = useMemo(
    () => (generation ? getAllTrims(generation) : []),
    [generation],
  );

  const [selectedTrimId, setSelectedTrimId] = useState<string>("");

  // Auto-select first trim when data loads
  const effectiveTrimId =
    selectedTrimId || allTrims[0]?.trim.id_car_trim.toString() || "";

  // Compute merged specs for the selected trim
  const mergedSpecs = useMemo(() => {
    if (!effectiveTrimId || allTrims.length === 0) return {};
    const found = allTrims.find(
      ({ trim }) => trim.id_car_trim.toString() === effectiveTrimId,
    );
    if (!found) return {};
    return getMergedSpecs(
      found.serie.commonSpecifications || {},
      found.trim.specificationsByCategory || {},
    );
  }, [effectiveTrimId, allTrims]);

  // Record view history when generation loads
  useEffect(() => {
    if (!generation || !sessionData?.user || historyRecorded.current) return;
    historyRecorded.current = true;

    axios
      .post("/api/history", {
        generationId: generation.id_car_generation,
        makeName: generation.carModel?.carMake?.name || "",
        modelName: generation.carModel?.name || "",
        generationName: generation.name || "",
        imageUrl: generation.carModel?.carMake?.logo_url || null,
      })
      .catch(() => {});
  }, [generation, sessionData]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!generation) return notFound();

  const hasSpecs = Object.keys(mergedSpecs).length > 0;

  return (
    <div className="space-y-8 print:space-y-4">
      {/* Back Link */}
      <nav className="print:hidden">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/specification">
            <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
            Retour aux fiches
          </Link>
        </Button>
      </nav>

      {/* Hero */}
      <AnimatedSection>
        <VehicleHeader generation={generation}>
          <FavoriteButton
            generationId={generation.id_car_generation}
            makeName={generation.carModel?.carMake?.name || ""}
            modelName={generation.carModel?.name || ""}
            generationName={generation.name || ""}
            imageUrl={generation.carModel?.carMake?.logo_url || null}
          />
          <CompareButton generation={generation} />
        </VehicleHeader>
      </AnimatedSection>

      {/* Motorization Selector */}
      <AnimatedSection delay={100}>
        <MotorizationSelector
          generation={generation}
          selectedTrimId={effectiveTrimId}
          onSelect={setSelectedTrimId}
        />
      </AnimatedSection>

      {/* Quick Stats for selected trim */}
      {hasSpecs && <QuickStats specsByCategory={mergedSpecs} />}

      {/* AI Reliability Widget */}
      <AnimatedSection delay={200}>
        <div className="print:hidden">
          <AIReliabilityWidget
            generationId={generation.id_car_generation}
            locale={locale}
          />
        </div>
      </AnimatedSection>

      {/* Market Value Widget */}
      <AnimatedSection delay={230}>
        <div className="print:hidden">
          <MarketValueWidget
            generationId={generation.id_car_generation}
            trimId={effectiveTrimId || undefined}
            makeName={generation.carModel?.carMake?.name || ""}
            modelName={generation.carModel?.name || ""}
          />
        </div>
      </AnimatedSection>

      {/* NHTSA Recalls */}
      <AnimatedSection delay={250}>
        <RecallsSection
          makeName={generation.carModel?.carMake?.name || ""}
          modelName={generation.carModel?.name || ""}
        />
      </AnimatedSection>

      {/* All Specifications for selected trim */}
      <main>
        {hasSpecs ? (
          <AllSpecifications specsByCategory={mergedSpecs} />
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Aucune spécification disponible pour ce véhicule.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Comments */}
      <AnimatedSection delay={300}>
        <CommentsSection generationId={generation.id_car_generation} />
      </AnimatedSection>
    </div>
  );
}
