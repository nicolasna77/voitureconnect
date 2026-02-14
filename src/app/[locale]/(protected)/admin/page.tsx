"use client";

import { useAdminStats } from "@/lib/actions/admin-dashboard";
import { StatsCard } from "@/components/admin/widget/stats-card";
import { RecentTransactions } from "@/components/admin/widget/recent-transactions";
import { TopSpecifications } from "@/components/admin/widget/top-specifications";
import { Users, CreditCard, Euro, Coins } from "lucide-react";
import { StatsChart } from "@/components/admin/widget/stats-chart";
import { MonthlyData } from "@/types/admin";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  const calculateTrend = (data: MonthlyData[] = []) => {
    if (data.length < 2) return 0;
    const lastMonth = data[data.length - 1].total;
    const previousMonth = data[data.length - 2].total;
    if (previousMonth === 0) return lastMonth > 0 ? 100 : 0;
    return Math.round(((lastMonth - previousMonth) / previousMonth) * 100);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  const usersTrend = calculateTrend(stats?.monthlyUsers);
  const subsTrend = calculateTrend(stats?.monthlySubscriptions);
  const revenueTrend = calculateTrend(stats?.monthlyRevenue);
  const creditsTrend = calculateTrend(stats?.monthlyCredits);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Vue d&apos;ensemble</h1>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Utilisateurs"
            value={stats?.totalUsers ?? 0}
            icon={Users}
            loading={isLoading}
            description={
              usersTrend !== 0
                ? `${usersTrend > 0 ? "+" : ""}${usersTrend}% ce mois`
                : undefined
            }
          />
          <StatsCard
            title="Abonnements Actifs"
            value={stats?.totalSubscriptions ?? 0}
            icon={CreditCard}
            loading={isLoading}
            description={
              subsTrend !== 0
                ? `${subsTrend > 0 ? "+" : ""}${subsTrend}% ce mois`
                : undefined
            }
          />
          <StatsCard
            title="Chiffre d&#8217;Affaires"
            value={formatCurrency(stats?.totalRevenue ?? 0)}
            icon={Euro}
            loading={isLoading}
            description={
              revenueTrend !== 0
                ? `${revenueTrend > 0 ? "+" : ""}${revenueTrend}% ce mois`
                : undefined
            }
          />
          <StatsCard
            title="Crédits Utilisés"
            value={stats?.totalCreditsUsed ?? 0}
            icon={Coins}
            loading={isLoading}
            description={
              creditsTrend !== 0
                ? `${creditsTrend > 0 ? "+" : ""}${creditsTrend}% ce mois`
                : undefined
            }
          />
        </div>

        <StatsChart
          title="Revenus Mensuels"
          description="Évolution du chiffre d&#8217;affaires sur les 6 derniers mois"
          data={stats?.monthlyRevenue ?? []}
          loading={isLoading}
          color="hsl(var(--chart-1))"
          trend={{
            percentage: revenueTrend,
            period: "ce mois",
          }}
          className="col-span-1"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <StatsChart
            title="Nouveaux Utilisateurs"
            description="Nouveaux utilisateurs sur les 6 derniers mois"
            data={stats?.monthlyUsers ?? []}
            loading={isLoading}
            color="hsl(var(--chart-2))"
            trend={{
              percentage: usersTrend,
              period: "ce mois",
            }}
            className="col-span-1"
          />
          <StatsChart
            title="Abonnements Actifs"
            description="Évolution des abonnements actifs sur les 6 derniers mois"
            data={stats?.monthlySubscriptions ?? []}
            loading={isLoading}
            color="hsl(var(--chart-3))"
            trend={{
              percentage: subsTrend,
              period: "ce mois",
            }}
            className="col-span-1"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentTransactions
            transactions={stats?.recentTransactions ?? []}
            loading={isLoading}
          />
          <TopSpecifications
            specifications={stats?.topSpecifications ?? []}
            loading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
