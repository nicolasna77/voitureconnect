"use client";

import { useAdminStats } from "@/hooks/use-admin-data";
import { StatsCard } from "@/components/admin/stats-card";
import { RecentTransactions } from "@/components/admin/recent-transactions";
import { Users, ShoppingCart, CreditCard } from "lucide-react";
import { StatsChart } from "@/components/admin/stats-chart";
import { MonthlyData } from "@/types/admin";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  const calculateTrend = (data: MonthlyData[] = []) => {
    if (data.length < 2) return 0;
    const lastMonth = data[data.length - 1].total;
    const previousMonth = data[data.length - 2].total;
    if (previousMonth === 0) return 100;
    return Math.round(((lastMonth - previousMonth) / previousMonth) * 100);
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">
        Tableau de Bord Administrateur
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Utilisateurs"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          loading={isLoading}
        />
        <StatsCard
          title="Total Annonces"
          value={stats?.totalAds ?? 0}
          icon={ShoppingCart}
          loading={isLoading}
        />
        <StatsCard
          title="Total Abonnements"
          value={stats?.totalSubscriptions ?? 0}
          icon={CreditCard}
          loading={isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StatsChart
          title="Transactions Mensuelles"
          description="Total des transactions sur les 6 derniers mois"
          data={stats?.monthlyTransactions ?? []}
          loading={isLoading}
          color="hsl(var(--chart-1))"
          trend={{
            percentage: calculateTrend(stats?.monthlyTransactions),
            period: "ce mois",
          }}
          className="col-span-1"
        />
        <RecentTransactions
          transactions={stats?.recentTransactions ?? []}
          loading={isLoading}
          className="col-span-1"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StatsChart
          title="Nouveaux Utilisateurs"
          description="Nouveaux utilisateurs sur les 6 derniers mois"
          data={stats?.monthlyUsers ?? []}
          loading={isLoading}
          color="hsl(var(--chart-2))"
          trend={{
            percentage: calculateTrend(stats?.monthlyUsers),
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
            percentage: calculateTrend(stats?.monthlySubscriptions),
            period: "ce mois",
          }}
          className="col-span-1"
        />
      </div>
    </div>
  );
}
