"use client";

import { useState } from "react";
import Image from "next/image";
import { CarIcon } from "lucide-react";
import { getImaginstudioUrl } from "@/lib/car-image";
import { cn } from "@/lib/utils";

interface CarImageProps {
  /** URL already stored in DB (highest priority) */
  cachedUrl?: string | null;
  /** Fallback: construct URL from imagin.studio */
  make: string;
  model: string;
  year?: string | null;
  alt: string;
  logoUrl?: string | null;
  className?: string;
}

export function CarImage({
  cachedUrl,
  make,
  model,
  year,
  alt,
  logoUrl,
  className,
}: CarImageProps) {
  const src = cachedUrl ?? getImaginstudioUrl(make, model, year);
  const [errored, setErrored] = useState(false);
  const unoptimized = !!src?.includes("upload.wikimedia.org");

  const showImage = src && !errored;

  return (
    <div
      className={cn(
        "relative w-full h-40 bg-muted overflow-hidden",
        className
      )}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105"
          unoptimized={unoptimized}
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <CarIcon className="w-10 h-10 text-muted-foreground/30" aria-hidden="true" />
        </div>
      )}

      {/* Brand logo badge */}
      {logoUrl && showImage && (
        <div
          className="absolute bottom-2 right-2 w-9 h-9 rounded-md bg-white/90 backdrop-blur-sm border border-white/60 shadow flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <Image
            src={logoUrl}
            alt=""
            width={28}
            height={28}
            className="object-contain"
            unoptimized
          />
        </div>
      )}
    </div>
  );
}
