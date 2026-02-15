"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Coins } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PricingCards } from "@/components/pricing-cards";
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

  const { data: balanceData } = useQuery({
    queryKey: ["creditBalance"],
    queryFn: fetchBalance,
  });

  const handlePurchase = async (packageId: string) => {
    const response = await fetch("/api/credits/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageId }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Title>{t("title")}</Title>

      {/* Current Balance */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/15 bg-primary/5">
              <Coins className="h-4.5 w-4.5 text-primary" />
            </div>
            {t("yourBalance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">
            {balanceData?.balance ?? 0}{" "}
            <span className="text-lg font-medium text-muted-foreground">
              {t("credits")}
            </span>
          </p>
          <p className="text-muted-foreground mt-2">
            {t("balanceDescription")}
          </p>
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <PricingCards onPurchase={handlePurchase} />
    </div>
  );
}
