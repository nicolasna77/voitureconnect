"use client";

import { useAdminAnalytics } from "@/lib/actions/admin-dashboard";
import { StatsCard } from "@/components/admin/widget/stats-card";
import { StatsChart } from "@/components/admin/widget/stats-chart";
import { TopSpecifications } from "@/components/admin/widget/top-specifications";
import { Coins, TrendingDown, Wallet } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useAdminAnalytics();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Analytiques</h1>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Crédits Achetés"
            value={analytics?.totalCreditsPurchased ?? 0}
            icon={Coins}
            loading={isLoading}
          />
          <StatsCard
            title="Crédits Consommés"
            value={analytics?.totalCreditsUsed ?? 0}
            icon={TrendingDown}
            loading={isLoading}
          />
          <StatsCard
            title="Balance Totale"
            value={analytics?.totalCreditsBalance ?? 0}
            icon={Wallet}
            loading={isLoading}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <StatsChart
            title="Crédits Achetés par Mois"
            description="Évolution des achats de crédits sur 6 mois"
            data={analytics?.monthlyCredits ?? []}
            loading={isLoading}
            color="hsl(var(--chart-1))"
            className="col-span-1"
          />
          <StatsChart
            title="Accès Spécifications par Mois"
            description="Évolution des consultations de spécifications sur 6 mois"
            data={analytics?.monthlySpecAccesses ?? []}
            loading={isLoading}
            color="hsl(var(--chart-2))"
            className="col-span-1"
          />
        </div>

        <TopSpecifications
          specifications={analytics?.topSpecifications ?? []}
          loading={isLoading}
        />
      </div>
    </>
  );
}
