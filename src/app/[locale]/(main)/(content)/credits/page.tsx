"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Coins, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CREDIT_PACKAGES } from "@/config/credits";
import Title from "@/components/title";

async function fetchBalance(): Promise<{ balance: number }> {
  const response = await fetch("/api/credits/balance");
  if (!response.ok) {
    throw new Error("Failed to fetch balance");
  }
  return response.json();
}

export default function CreditsPage() {
  const t = useTranslations("Credits");
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);

  const { data: balanceData } = useQuery({
    queryKey: ["creditBalance"],
    queryFn: fetchBalance,
  });

  const handlePurchase = async (packageId: string) => {
    setLoadingPackage(packageId);
    try {
      const response = await fetch("/api/credits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Purchase error:", error);
    } finally {
      setLoadingPackage(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Title>{t("title")}</Title>

      {/* Current Balance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-yellow-500" />
            {t("yourBalance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {balanceData?.balance ?? 0} {t("credits")}
          </p>
          <p className="text-muted-foreground mt-2">
            {t("balanceDescription")}
          </p>
        </CardContent>
      </Card>

      {/* Credit Packages */}
      <h2 className="text-2xl font-bold mb-6">{t("buyCredits")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CREDIT_PACKAGES.map((pkg, index) => {
          const isPopular = index === 1;
          const savings = index > 0 ? Math.round((1 - pkg.price / (pkg.credits * 0.5)) * 100) : 0;

          return (
            <Card
              key={pkg.id}
              className={`relative ${isPopular ? "border-primary border-2" : ""}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {t("popular")}
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{pkg.credits} {t("credits")}</CardTitle>
                <CardDescription>
                  {savings > 0 && (
                    <span className="text-green-600 font-semibold">
                      {t("save")} {savings}%
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{pkg.price.toFixed(2)} EUR</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    {t("unlockSpecs", { count: pkg.credits })}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    {t("permanentAccess")}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    {t("noExpiration")}
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  variant={isPopular ? "default" : "outline"}
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={loadingPackage !== null}
                >
                  {loadingPackage === pkg.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Coins className="w-4 h-4 mr-2" />
                  )}
                  {t("buy")}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
