"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useLocale } from "next-intl";
import LoaderComponent from "@/components/component/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Lazy load AI widgets - these are premium features, no need to load upfront (vercel-react-best-practices: bundle-dynamic-imports)
const AIReliabilityWidget = dynamic(
  () => import("@/components/ai/reliability-widget").then((mod) => mod.AIReliabilityWidget),
  {
    ssr: false,
    loading: () => (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-muted rounded w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted rounded" />
        </CardContent>
      </Card>
    ),
  }
);

import {
  ChevronLeft,
  Calendar,
  Car,
  Gauge,
  Cog,
  Fuel,
  Zap,
  Settings2,
  AlertCircle,
  Share2,
  Printer,
} from "lucide-react";

// Types
interface Specification {
  name: string;
  value: string;
  unit: string | null;
}

interface CarTrim {
  id_car_trim: number;
  name: string;
  specificationsByCategory: Record<string, Specification[]>;
}

interface CarSerie {
  id_car_serie: number;
  name: string;
  trims: CarTrim[];
  commonSpecifications: Record<string, Specification[]>;
}

interface Generation {
  id_car_generation: number;
  name: string;
  year_begin: string | null;
  year_end: string | null;
  carModel: {
    name: string;
    carMake: {
      name: string;
    };
  };
  series: CarSerie[];
}

// Category configuration
const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  dimensions: {
    label: "Dimensions",
    icon: <Car className="h-4 w-4" />,
    color: "text-blue-600",
  },
  weights: {
    label: "Poids & Capacités",
    icon: <Gauge className="h-4 w-4" />,
    color: "text-slate-600",
  },
  engine: {
    label: "Moteur",
    icon: <Cog className="h-4 w-4" />,
    color: "text-red-600",
  },
  gearbox: {
    label: "Transmission",
    icon: <Settings2 className="h-4 w-4" />,
    color: "text-purple-600",
  },
  fuel: {
    label: "Carburant & Consommation",
    icon: <Fuel className="h-4 w-4" />,
    color: "text-amber-600",
  },
  performance: {
    label: "Performances",
    icon: <Zap className="h-4 w-4" />,
    color: "text-green-600",
  },
  suspension: {
    label: "Freins & Suspension",
    icon: <Gauge className="h-4 w-4" />,
    color: "text-orange-600",
  },
  body: {
    label: "Carrosserie",
    icon: <Car className="h-4 w-4" />,
    color: "text-cyan-600",
  },
  other: {
    label: "Autres caractéristiques",
    icon: <Settings2 className="h-4 w-4" />,
    color: "text-gray-600",
  },
};

function getCategoryConfig(categoryId: string) {
  return CATEGORY_CONFIG[categoryId] || CATEGORY_CONFIG.other;
}

async function getGenerationDetails(id: string): Promise<Generation> {
  const { data } = await axios.get(`/api/car/detail?id=${id}`);
  return data;
}

// Components
function SpecificationTable({
  specifications,
}: {
  specifications: Specification[];
}) {
  if (!specifications?.length) return null;

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-1/2 font-semibold">
              Caractéristique
            </TableHead>
            <TableHead className="w-1/2 font-semibold">Valeur</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specifications.map((spec, index) => (
            <TableRow key={index} className="hover:bg-muted/30">
              <TableCell className="font-medium text-muted-foreground">
                {spec.name}
              </TableCell>
              <TableCell className="tabular-nums">
                {spec.value?.replace(/NULL$/i, "")}
                {spec.unit && spec.unit !== "NULL" && (
                  <span className="text-muted-foreground ml-1">
                    {spec.unit}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CategorySection({
  category,
  specifications,
  defaultOpen = false,
}: {
  category: string;
  specifications: Specification[];
  defaultOpen?: boolean;
}) {
  const config = getCategoryConfig(category);

  return (
    <AccordionItem value={category} className="border rounded-lg px-4 mb-3">
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center gap-3">
          <div className={`${config.color}`} aria-hidden="true">
            {config.icon}
          </div>
          <span className="font-semibold">{config.label}</span>
          <Badge variant="secondary" className="ml-2 tabular-nums">
            {specifications.length}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <SpecificationTable specifications={specifications} />
      </AccordionContent>
    </AccordionItem>
  );
}

function SerieCard({ serie, isFirst }: { serie: CarSerie; isFirst: boolean }) {
  const totalSpecs = useMemo(() => {
    let count = 0;
    Object.values(serie.commonSpecifications || {}).forEach((specs) => {
      count += specs.length;
    });
    return count;
  }, [serie.commonSpecifications]);

  const defaultOpenCategories = isFirst
    ? Object.keys(serie.commonSpecifications || {}).slice(0, 2)
    : [];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{serie.name}</CardTitle>
            <CardDescription className="mt-1">
              {serie.trims?.length || 0} motorisation
              {(serie.trims?.length || 0) > 1 ? "s" : ""} disponible
              {(serie.trims?.length || 0) > 1 ? "s" : ""}
            </CardDescription>
          </div>
          <Badge variant="outline" className="tabular-nums">
            {totalSpecs} specs
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Common Specifications */}
        {serie.commonSpecifications &&
          Object.keys(serie.commonSpecifications).length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                Caractéristiques communes
              </h4>
              <Accordion
                type="multiple"
                defaultValue={defaultOpenCategories}
                className="space-y-2"
              >
                {Object.entries(serie.commonSpecifications).map(
                  ([category, specs]) => (
                    <CategorySection
                      key={category}
                      category={category}
                      specifications={specs}
                      defaultOpen={defaultOpenCategories.includes(category)}
                    />
                  ),
                )}
              </Accordion>
            </div>
          )}

        {/* Motorisations */}
        {serie.trims?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Motorisations
            </h4>
            <Tabs
              defaultValue={serie.trims[0]?.id_car_trim?.toString()}
              className="w-full"
            >
              <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1 bg-muted/50">
                {serie.trims.map((trim) => (
                  <TabsTrigger
                    key={trim.id_car_trim}
                    value={trim.id_car_trim.toString()}
                    className="whitespace-nowrap data-[state=active]:bg-background"
                  >
                    {trim.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {serie.trims.map((trim) => (
                <TabsContent
                  key={trim.id_car_trim}
                  value={trim.id_car_trim.toString()}
                  className="mt-4"
                >
                  {trim.specificationsByCategory &&
                  Object.keys(trim.specificationsByCategory).length > 0 ? (
                    <Accordion type="multiple" className="space-y-2">
                      {Object.entries(trim.specificationsByCategory).map(
                        ([category, specs]) => (
                          <CategorySection
                            key={category}
                            category={category}
                            specifications={specs}
                          />
                        ),
                      )}
                    </Accordion>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Toutes les spécifications sont communes à cette série.
                    </p>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SpecificationsContent({ generation }: { generation: Generation }) {
  if (!generation.series || generation.series.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Aucune spécification disponible pour ce véhicule.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {generation.series.map((serie, index) => (
        <SerieCard
          key={serie.id_car_serie}
          serie={serie}
          isFirst={index === 0}
        />
      ))}
    </div>
  );
}

function VehicleHeader({ generation }: { generation: Generation }) {
  const makeName = generation.carModel?.carMake?.name || "";
  const modelName = generation.carModel?.name || "";
  const genName = generation.name || "";

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${makeName} ${modelName} ${genName}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-3">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm"
            >
              <Link
                href="/specification"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Fiches techniques
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link
                href={`/specification?marque=${encodeURIComponent(makeName)}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {makeName}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">{modelName}</span>
            </nav>

            {/* Title */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shrink-0"
                aria-hidden="true"
              >
                {makeName.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                  {makeName} {modelName}
                </h1>
                <p className="text-lg text-muted-foreground">{genName}</p>
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="gap-1.5">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="tabular-nums">
                  {generation.year_begin || "–"} —{" "}
                  {generation.year_end || "présent"}
                </span>
              </Badge>
              <Badge variant="outline">{makeName}</Badge>
              <Badge variant="outline">{modelName}</Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              aria-label="Partager cette fiche"
            >
              <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
              Partager
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              aria-label="Imprimer cette fiche"
            >
              <Printer className="h-4 w-4 mr-2" aria-hidden="true" />
              Imprimer
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function ErrorState() {
  return (
    <div className="container mx-auto py-16">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle
              className="h-8 w-8 text-destructive"
              aria-hidden="true"
            />
          </div>
          <CardTitle className="text-xl">
            Une erreur s&apos;est produite
          </CardTitle>
          <CardDescription>
            Impossible de charger les données de cette fiche technique.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/specification">
              <ChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Retour aux fiches
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className="container mx-auto py-16 flex flex-col items-center justify-center gap-4"
      role="status"
      aria-label="Chargement de la fiche technique"
    >
      <LoaderComponent />
      <p className="text-muted-foreground">Chargement de la fiche technique…</p>
    </div>
  );
}

// Main Page
export default function SpecificationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const locale = useLocale() as "fr" | "en";

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

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!generation) return notFound();

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Back Link */}
      <nav className="print:hidden">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/specification">
            <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
            Retour aux fiches
          </Link>
        </Button>
      </nav>

      {/* Header */}
      <VehicleHeader generation={generation} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Specifications - 3/4 (Free for all users) */}
        <main className="lg:col-span-3 space-y-6">
          <SpecificationsContent generation={generation} />
        </main>

        {/* Sidebar - 1/4 */}
        <aside className="lg:col-span-1 space-y-6 print:hidden">
          {/* Reliability Widget (Premium - requires credits for USER role) */}
          <AIReliabilityWidget
            generationId={generation.id_car_generation}
            locale={locale}
          />
        </aside>
      </div>
    </div>
  );
}
