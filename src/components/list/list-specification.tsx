import Link from "next/link";
import Image from "next/image";
import { CarImage } from "./car-image";
import {
  CarIcon,
  Calendar,
  FileSearch,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Generation {
  id_car_generation: number;
  name: string;
  year_begin?: string;
  year_end?: string;
  image_url?: string | null;
  carModel: {
    name: string;
    carMake: {
      name: string;
      logo_url?: string | null;
    };
  };
  carType?: {
    name: string;
  };
}

const BRAND_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-pink-500",
];

// Brand color helper (generates consistent color from brand name)
function getBrandColor(brandName: string): string {
  return BRAND_COLORS[brandName.charCodeAt(0) % BRAND_COLORS.length];
}

// --- Explicit variant components (patterns-explicit-variants) ---

export function SpecificationListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card overflow-hidden animate-pulse motion-reduce:animate-none"
        >
          <div className="w-full h-40 bg-muted" />
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SpecificationListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <FileSearch
          className="w-8 h-8 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-balance">Aucun résultat trouvé</h3>
      <p className="text-muted-foreground max-w-md text-sm">
        Essayez de modifier vos filtres ou recherchez une autre marque de
        véhicule.
      </p>
    </div>
  );
}

export function SpecificationListError() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-balance">
        Une erreur s&apos;est produite
      </h3>
      <p className="text-muted-foreground max-w-md text-sm">
        Impossible de charger les données. Veuillez réessayer ultérieurement.
      </p>
    </div>
  );
}

function SpecificationCard({
  generation,
  isUnlocked,
}: {
  generation: Generation;
  isUnlocked: boolean;
}) {
  const makeName = generation.carModel.carMake.name;
  const logoUrl = generation.carModel.carMake.logo_url;
  const modelName = generation.carModel.name;
  const imageUrl = generation.image_url;
  const yearRange = `${generation.year_begin || "?"}\u00a0— ${generation.year_end || "présent"}`;

  return (
    <Link
      href={`/specification/${generation.id_car_generation}`}
      className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <article
        className={cn(
          "h-full rounded-xl border border-border bg-card overflow-hidden",
          "transition-[box-shadow,border-color] duration-200 motion-reduce:transition-none",
          "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30",
          "group-focus-visible:border-primary",
        )}
      >
        {/* Car image — imagin.studio or DB override */}
        <CarImage
          cachedUrl={imageUrl}
          make={makeName}
          model={modelName}
          year={generation.year_begin}
          alt={`${makeName} ${modelName} ${generation.name}`}
          logoUrl={logoUrl}
        />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            {/* Logo — only show standalone when no image */}
            {!imageUrl && (
              logoUrl ? (
                <div
                  className="relative w-11 h-11 rounded-lg bg-white shrink-0 transition-transform motion-reduce:transition-none group-hover:scale-105 border border-border overflow-hidden"
                  aria-hidden="true"
                >
                  <Image
                    src={logoUrl}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-contain"
                    quality={100}
                    unoptimized
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "w-11 h-11 rounded-lg flex items-center justify-center text-white text-lg font-bold shrink-0",
                    "transition-transform motion-reduce:transition-none group-hover:scale-105",
                    getBrandColor(makeName),
                  )}
                  aria-hidden="true"
                >
                  {makeName.charAt(0)}
                </div>
              )
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors motion-reduce:transition-none">
                  {makeName} {modelName}
                </h3>
                {isUnlocked && (
                  <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                    <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                    Consulté
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {generation.name}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="tabular-nums">{yearRange}</span>
            </span>
            {generation.carType && (
              <>
                <span className="text-border" aria-hidden="true">•</span>
                <span className="flex items-center gap-1.5">
                  <CarIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{generation.carType.name}</span>
                </span>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" aria-hidden="true" />
              <span>Analyse IA disponible</span>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity motion-reduce:transition-none" aria-hidden="true">
              Voir la fiche
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// --- Main list component (data only, no loading/error states) ---

export function SpecificationList({
  data,
  unlockedIds = [],
}: {
  data: Generation[];
  unlockedIds?: number[];
}) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      role="list"
      aria-label="Liste des fiches techniques"
    >
      {data.map((generation) => (
        <div key={generation.id_car_generation} role="listitem">
          <SpecificationCard
            generation={generation}
            isUnlocked={unlockedIds.includes(generation.id_car_generation)}
          />
        </div>
      ))}
    </div>
  );
}

// --- Backwards-compatible default export (composes variants internally) ---

interface ListSpecificationProps {
  data: { data: Generation[] } | null;
  isPending: boolean;
  isError: boolean;
  unlockedIds?: number[];
}

const ListSpecification = ({
  data,
  isPending,
  isError,
  unlockedIds = [],
}: ListSpecificationProps) => {
  if (isPending) return <SpecificationListSkeleton />;
  if (isError) return <SpecificationListError />;
  if (!data?.data?.length) return <SpecificationListEmpty />;

  return <SpecificationList data={data.data} unlockedIds={unlockedIds} />;
};

export default ListSpecification;
