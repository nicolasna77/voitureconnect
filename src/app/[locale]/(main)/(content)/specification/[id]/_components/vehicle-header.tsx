"use client";

import { useMemo, useCallback, useState } from "react";
import Image from "next/image";
import { CarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Car,
  Cog,
  Share2,
  Printer,
  Download,
  ChevronDown,
} from "lucide-react";
import { useParams } from "next/navigation";
import type { Generation } from "./types";

export function VehicleHeader({
  generation,
  children,
}: {
  generation: Generation;
  children?: React.ReactNode;
}) {
  const params = useParams();
  const generationId = params.id as string;
  const makeName = generation.carModel?.carMake?.name || "";
  const modelName = generation.carModel?.name || "";
  const genName = generation.name || "";
  const logoUrl = generation.carModel?.carMake?.logo_url || null;
  const imageUrl = generation.image_url || null;
  const [imgErrored, setImgErrored] = useState(false);

  const totalTrims = useMemo(() => {
    let count = 0;
    for (const serie of generation.series || []) {
      count += serie.trims?.length || 0;
    }
    return count;
  }, [generation.series]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${makeName} ${modelName} ${genName}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  }, [makeName, modelName, genName]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const showCarImage = imageUrl && !imgErrored;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/5 via-primary/2 to-transparent border">
      {/* Car image banner */}
      {showCarImage ? (
        <div className="relative w-full h-52 sm:h-64 lg:h-72 bg-muted overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${makeName} ${modelName} ${genName}`}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-contain"
            priority
            unoptimized={imageUrl.includes("upload.wikimedia.org")}
            onError={() => setImgErrored(true)}
          />
          {/* Logo badge en bas à droite */}
          {logoUrl && (
            <div
              className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-md flex items-center justify-center overflow-hidden"
              aria-hidden="true"
            >
              <Image src={logoUrl} alt="" width={32} height={32} className="object-contain" unoptimized />
            </div>
          )}
        </div>
      ) : null}
      <div className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: brand logo (only when no car image) + title */}
          <div className="flex items-center gap-5">
            {!showCarImage && (logoUrl ? (
              <div
                className="relative w-20 h-20 lg:w-32 lg:h-32 rounded-2xl shrink-0 shadow-primary/20 overflow-hidden"
                aria-hidden="true"
              >
                <Image
                  src={logoUrl}
                  alt=""
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                />
              </div>
            ) : (
              <div
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-4xl lg:text-5xl font-bold shrink-0 shadow-lg shadow-primary/20"
                aria-hidden="true"
              >
                {makeName.charAt(0)}
              </div>
            ))}
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-serif text-balance">
                {makeName} {modelName}
              </h1>
              <p className="text-lg text-muted-foreground">{genName}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant="secondary" className="gap-1.5">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="tabular-nums">
                    {generation.year_begin || "?"} {"—"}{" "}
                    {generation.year_end || "présent"}
                  </span>
                </Badge>
                {generation.series?.length > 0 && (
                  <Badge variant="outline" className="gap-1.5">
                    <Car className="h-3.5 w-3.5" aria-hidden="true" />
                    {generation.series.length} {"série"}
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
          <div className="flex flex-wrap items-center gap-2 print:hidden shrink-0">
            {/* User actions: Favoris, Garage, Comparer */}
            {children}

            {/* Export dropdown: Partager, Imprimer, PDF */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/60 backdrop-blur-sm"
                >
                  <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Exporter
                  <ChevronDown
                    className="h-3.5 w-3.5 ml-1.5 opacity-60"
                    aria-hidden="true"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Partager
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" aria-hidden="true" />
                  Imprimer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a
                    href={`/specification/${generationId}/print`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Télécharger PDF (ouvre dans un nouvel onglet)"
                  >
                    <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                    Télécharger PDF
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
