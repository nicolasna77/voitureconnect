"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "@/i18n/routing";
import {
  notFound,
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  Wrench,
  TrendingUp,
  Star,
} from "lucide-react";

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
import { RatingWidget } from "@/components/specification/rating-widget";
import { GarageButton } from "@/components/garage-button";

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

const VALID_TABS = ["fiche", "analyse", "avis"] as const;
type TabValue = (typeof VALID_TABS)[number];

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawTab = searchParams.get("tab");
  const activeTab: TabValue =
    rawTab && (VALID_TABS as readonly string[]).includes(rawTab)
      ? (rawTab as TabValue)
      : "fiche";

  const handleTabChange = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

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

  const allTrims = useMemo(
    () => (generation ? getAllTrims(generation) : []),
    [generation],
  );

  const [selectedTrimId, setSelectedTrimId] = useState<string>("");

  const effectiveTrimId =
    selectedTrimId || allTrims[0]?.trim.id_car_trim.toString() || "";

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
  }, [generation?.id_car_generation, sessionData?.user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!generation) return notFound();

  const hasSpecs = Object.keys(mergedSpecs).length > 0;

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Back Link */}
      <nav aria-label="Navigation retour" className="print:hidden">
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
            className="rounded-r-none border-r-0 focus-visible:z-10"
          />
          <GarageButton
            generationId={generation.id_car_generation}
            makeName={generation.carModel?.carMake?.name || ""}
            modelName={generation.carModel?.name || ""}
            generationName={generation.name || ""}
            trims={allTrims.map(({ trim }) => ({
              id_car_trim: trim.id_car_trim,
              name: trim.name,
            }))}
            className="rounded-none border-x-0 focus-visible:z-10"
          />
          <CompareButton
            generation={generation}
            className="rounded-l-none border-l-0 focus-visible:z-10"
          />
        </VehicleHeader>
      </AnimatedSection>

      {/* Tabbed sections */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-0"
      >
        {/* Sticky tab bar */}
        <div className="sticky top-14 z-20 -mx-4 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b print:hidden">
          <TabsList className="w-full h-auto rounded-none bg-transparent p-0 gap-0 justify-start">
            <TabsTrigger
              value="fiche"
              className="relative gap-2 rounded-none px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full data-[state=active]:after:bg-primary focus-visible:ring-inset"
            >
              <Wrench className="h-4 w-4" aria-hidden="true" />
              <span>Fiche technique</span>
            </TabsTrigger>
            <TabsTrigger
              value="analyse"
              className="relative gap-2 rounded-none px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full data-[state=active]:after:bg-primary focus-visible:ring-inset"
            >
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              <span>Analyse</span>
            </TabsTrigger>
            <TabsTrigger
              value="avis"
              className="relative gap-2 rounded-none px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full data-[state=active]:after:bg-primary focus-visible:ring-inset"
            >
              <Star className="h-4 w-4" aria-hidden="true" />
              <span>Avis</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── Fiche technique ───────────────────────────────────────── */}
        <TabsContent
          value="fiche"
          className="space-y-6 mt-6 outline-none print:!block"
        >
          <AnimatedSection delay={60}>
            <MotorizationSelector
              generation={generation}
              selectedTrimId={effectiveTrimId}
              onSelect={setSelectedTrimId}
            />
          </AnimatedSection>

          {hasSpecs && (
            <AnimatedSection delay={100}>
              <QuickStats specsByCategory={mergedSpecs} />
            </AnimatedSection>
          )}

          <AnimatedSection delay={140}>
            <section aria-label="Spécifications techniques complètes">
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
            </section>
          </AnimatedSection>
        </TabsContent>

        {/* ── Analyse ───────────────────────────────────────────────── */}
        <TabsContent
          value="analyse"
          className="space-y-6 mt-6 outline-none print:!block"
        >
          <AnimatedSection delay={60}>
            <AIReliabilityWidget
              generationId={generation.id_car_generation}
              locale={locale}
            />
          </AnimatedSection>

          <AnimatedSection delay={120}>
            <MarketValueWidget
              generationId={generation.id_car_generation}
              trimId={effectiveTrimId || undefined}
              makeName={generation.carModel?.carMake?.name || ""}
              modelName={generation.carModel?.name || ""}
            />
          </AnimatedSection>

          <AnimatedSection delay={180}>
            <RecallsSection
              makeName={generation.carModel?.carMake?.name || ""}
              modelName={generation.carModel?.name || ""}
            />
          </AnimatedSection>
        </TabsContent>

        {/* ── Avis ──────────────────────────────────────────────────── */}
        <TabsContent
          value="avis"
          className="space-y-6 mt-6 outline-none print:!block"
        >
          <AnimatedSection delay={60}>
            <Suspense
              fallback={
                <div className="h-32 w-full rounded-xl animate-pulse bg-muted motion-reduce:animate-none" />
              }
            >
              <RatingWidget
                generationId={generation.id_car_generation}
                trimId={effectiveTrimId || undefined}
              />
            </Suspense>
          </AnimatedSection>

          <AnimatedSection delay={120}>
            <CommentsSection generationId={generation.id_car_generation} />
          </AnimatedSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
