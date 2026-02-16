import { useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Car,
  Cog,
  Share2,
  Printer,
} from "lucide-react";
import type { Generation } from "./types";

export function VehicleHeader({
  generation,
  children,
}: {
  generation: Generation;
  children?: React.ReactNode;
}) {
  const makeName = generation.carModel?.carMake?.name || "";
  const modelName = generation.carModel?.name || "";
  const genName = generation.name || "";
  const logoUrl = generation.carModel?.carMake?.logo_url || null;

  const totalTrims = useMemo(() => {
    let count = 0;
    for (const serie of generation.series || []) {
      count += serie.trims?.length || 0;
    }
    return count;
  }, [generation.series]);

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
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/5 via-primary/2 to-transparent border">
      <div className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: brand initial + title */}
          <div className="flex items-center gap-5">
            {logoUrl ? (
              <div
                className="relative w-20 h-20 lg:w-28 lg:h-28 rounded-2xl bg-white shrink-0 shadow-lg shadow-primary/20 overflow-hidden"
                aria-hidden="true"
              >
                <Image
                  src={logoUrl}
                  alt={`Logo ${makeName}`}
                  fill
                  sizes="(min-width: 1024px) 96px, 80px"
                  className="object-contain"
                  quality={100}
                  unoptimized
                />
              </div>
            ) : (
              <div
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-4xl lg:text-5xl font-bold shrink-0 shadow-lg shadow-primary/20"
                aria-hidden="true"
              >
                {makeName.charAt(0)}
              </div>
            )}
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-serif text-balance">
                {makeName} {modelName}
              </h1>
              <p className="text-lg text-muted-foreground">{genName}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant="secondary" className="gap-1.5">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="tabular-nums">
                    {generation.year_begin || "\u2013"} {"\u2014"}{" "}
                    {generation.year_end || "pr\u00E9sent"}
                  </span>
                </Badge>
                {generation.series?.length > 0 && (
                  <Badge variant="outline" className="gap-1.5">
                    <Car className="h-3.5 w-3.5" aria-hidden="true" />
                    {generation.series.length} {"\u0073\u00E9rie"}
                    {generation.series.length > 1 ? "s" : ""}
                  </Badge>
                )}
                {totalTrims > 0 && (
                  <Badge variant="outline" className="gap-1.5">
                    <Cog className="h-3.5 w-3.5" aria-hidden="true" />
                    {totalTrims} motorisation{totalTrims > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 print:hidden shrink-0">
            {children}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              aria-label="Partager cette fiche"
              className="bg-background/60 backdrop-blur-sm"
            >
              <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
              Partager
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              aria-label="Imprimer cette fiche"
              className="bg-background/60 backdrop-blur-sm"
            >
              <Printer className="h-4 w-4 mr-2" aria-hidden="true" />
              Imprimer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
