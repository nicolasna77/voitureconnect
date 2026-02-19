"use client";

import { useState } from "react";
import { Check, Coins, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CREDIT_PACKAGES } from "@/config/credits";

interface PricingCardsProps {
  onPurchase?: (packageId: string) => Promise<void>;
  showHeader?: boolean;
  className?: string;
}

const packageAccents = [
  {
    border: "border-border",
    badge: "",
    icon: "text-chart-2",
    iconBg: "bg-chart-2/8 border-chart-2/15",
    button: "outline" as const,
    price: "text-foreground",
  },
  {
    border: "border-primary shadow-lg shadow-primary/10 scale-[1.02]",
    badge: "bg-primary text-primary-foreground",
    icon: "text-primary",
    iconBg: "bg-primary/8 border-primary/15",
    button: "default" as const,
    price: "text-primary",
  },
  {
    border: "border-border",
    badge: "",
    icon: "text-chart-3",
    iconBg: "bg-chart-3/8 border-chart-3/15",
    button: "outline" as const,
    price: "text-foreground",
  },
];

export function PricingCards({
  onPurchase,
  showHeader = true,
  className,
}: PricingCardsProps) {
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    if (!onPurchase) return;
    setLoadingPackage(packageId);
    try {
      await onPurchase(packageId);
    } finally {
      setLoadingPackage(null);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {showHeader && (
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Tarifs
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Des credits pour chaque besoin
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Achetez des credits pour acceder aux analyses IA de vos vehicules.
            Sans abonnement, sans engagement.
          </p>
        </div>
      )}

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 items-start">
        {CREDIT_PACKAGES.map((pkg, index) => {
          const isPopular = index === 1;
          const accent = packageAccents[index];
          const pricePerCredit = (pkg.price / pkg.credits).toFixed(2);
          const savings =
            index > 0
              ? Math.round(
                  (1 - pkg.price / (pkg.credits * (CREDIT_PACKAGES[0].price / CREDIT_PACKAGES[0].credits))) * 100
                )
              : 0;

          const formattedPrice = new Intl.NumberFormat("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(pkg.price);
          const [priceParts] = [formattedPrice.split(",")];
          const priceInt = priceParts[0];
          const priceDec = formattedPrice.split(",")[1];

          return (
            <div
              key={pkg.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg lg:p-8",
                accent.border
              )}
            >
              {/* Popular badge */}
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold",
                      accent.badge
                    )}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Populaire
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <div
                  className={cn(
                    "mb-4 flex h-11 w-11 items-center justify-center rounded-xl border",
                    accent.iconBg
                  )}
                >
                  <Coins className={cn("h-5 w-5", accent.icon)} />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  {pkg.credits} credits
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {savings > 0
                    ? `Economisez ${savings}% par rapport au pack de base`
                    : "Ideal pour decouvrir"}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      "text-4xl font-bold tracking-tight",
                      accent.price
                    )}
                  >
                    {priceInt}
                  </span>
                  <span className="text-lg font-medium text-muted-foreground">
                    ,{priceDec}€
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pricePerCredit}€ par credit
                </p>
              </div>

              {/* Separator */}
              <div className="mb-6 h-px bg-border" />

              {/* Features */}
              <ul className="mb-8 flex-1 space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <Check
                    className={cn("mt-0.5 h-4 w-4 shrink-0", accent.icon)}
                  />
                  <span className="text-card-foreground">
                    {pkg.credits} analyses IA
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check
                    className={cn("mt-0.5 h-4 w-4 shrink-0", accent.icon)}
                  />
                  <span className="text-card-foreground">
                    Acces permanent aux resultats
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check
                    className={cn("mt-0.5 h-4 w-4 shrink-0", accent.icon)}
                  />
                  <span className="text-card-foreground">
                    Credits sans expiration
                  </span>
                </li>
                {index >= 1 && (
                  <li className="flex items-start gap-3 text-sm">
                    <Check
                      className={cn("mt-0.5 h-4 w-4 shrink-0", accent.icon)}
                    />
                    <span className="text-card-foreground">
                      Meilleur rapport qualite-prix
                    </span>
                  </li>
                )}
                {index === 2 && (
                  <li className="flex items-start gap-3 text-sm">
                    <Check
                      className={cn("mt-0.5 h-4 w-4 shrink-0", accent.icon)}
                    />
                    <span className="text-card-foreground">
                      Usage professionnel
                    </span>
                  </li>
                )}
              </ul>

              {/* CTA */}
              <Button
                className={cn(
                  "w-full",
                  isPopular && "shadow-sm shadow-primary/20"
                )}
                size="lg"
                variant={accent.button}
                onClick={() => handlePurchase(pkg.id)}
                disabled={loadingPackage !== null}
              >
                {loadingPackage === pkg.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isPopular ? "Acheter maintenant" : "Acheter"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
