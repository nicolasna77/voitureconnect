import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { getCachedSession } from "@/lib/cached-session";

export async function GET() {
  try {
    const session = await getCachedSession();

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      totalUsers,
      totalAds,
      totalSubscriptions,
      recentTransactions,
      monthlyTransactions,
      monthlyUsers,
      monthlySubscriptions,
      subscriptionRevenueAgg,
      creditPurchases,
      creditConsumptions,
      totalSpecAccesses,
      topSpecifications,
      monthlyCreditTransactions,
      monthlySpecAccessData,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.ad.count(),
      prisma.subscription.count(),
      prisma.transaction.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          buyer: true,
          seller: true,
        },
      }),
      // Statistiques mensuelles des transactions
      prisma.transaction.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: {
            gte: sixMonthsAgo,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      // Statistiques mensuelles des nouveaux utilisateurs
      prisma.user.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: {
            gte: sixMonthsAgo,
          },
        },
        _count: {
          _all: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
      // Statistiques mensuelles des abonnements
      prisma.subscription.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: {
            gte: sixMonthsAgo,
          },
          status: "active",
        },
        _count: true,
      }),
      // Revenue from subscriptions
      prisma.subscription.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: "active",
        },
      }),
      // Total credits purchased
      prisma.creditTransaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          type: "PURCHASE",
        },
      }),
      // Total credits consumed
      prisma.creditTransaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          type: "CONSUMPTION",
        },
      }),
      // Total spec accesses
      prisma.specificationAccess.count(),
      // Top specifications by access count
      prisma.specificationAccess.groupBy({
        by: ["specificationId", "specificationType"],
        _count: {
          _all: true,
        },
        _sum: {
          creditCost: true,
        },
        orderBy: {
          _count: {
            specificationId: "desc",
          },
        },
        take: 10,
      }),
      // Monthly credit transactions
      prisma.creditTransaction.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: {
            gte: sixMonthsAgo,
          },
          type: "PURCHASE",
        },
        _sum: {
          amount: true,
        },
      }),
      // Monthly spec accesses
      prisma.specificationAccess.groupBy({
        by: ["accessedAt"],
        where: {
          accessedAt: {
            gte: sixMonthsAgo,
          },
        },
        _count: {
          _all: true,
        },
      }),
    ]);

    // Formater les données pour les graphiques
    const formatMonthlyData = (data: any[], valueKey: string) => {
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
          name: date.toLocaleDateString("fr-FR", { month: "short" }),
          date: date,
        };
      }).reverse();

      return months.map((month) => ({
        name: month.name,
        total: data
          .filter((d) => {
            const dateField = d.createdAt || d.accessedAt;
            const dataDate = new Date(dateField);
            return (
              dataDate.getMonth() === month.date.getMonth() &&
              dataDate.getFullYear() === month.date.getFullYear()
            );
          })
          .reduce((acc: number, curr: any) => {
            if (valueKey === "transactions" || valueKey === "credits") {
              return acc + (curr._sum?.amount?.toNumber?.() || curr._sum?.amount || 0);
            }
            return acc + (curr._count?._all || 0);
          }, 0),
      }));
    };

    const subscriptionRevenue = subscriptionRevenueAgg._sum.amount?.toNumber?.() || Number(subscriptionRevenueAgg._sum.amount) || 0;
    const totalCreditsPurchased = creditPurchases._sum.amount || 0;
    const totalCreditsUsed = creditConsumptions._sum.amount || 0;

    // Calculate total revenue from transactions
    const totalTransactionRevenue = monthlyTransactions.reduce(
      (acc: number, curr: any) => acc + (curr._sum?.amount?.toNumber?.() || 0),
      0
    );
    const totalRevenue = subscriptionRevenue + totalTransactionRevenue;

    return NextResponse.json({
      totalUsers,
      totalAds,
      totalSubscriptions,
      totalRevenue,
      subscriptionRevenue,
      totalCreditsPurchased,
      totalCreditsUsed,
      totalSpecAccesses,
      recentTransactions,
      monthlyTransactions: formatMonthlyData(
        monthlyTransactions,
        "transactions"
      ),
      monthlyUsers: formatMonthlyData(monthlyUsers, "users"),
      monthlySubscriptions: formatMonthlyData(
        monthlySubscriptions,
        "subscriptions"
      ),
      monthlyRevenue: formatMonthlyData(monthlyTransactions, "transactions"),
      monthlyCredits: formatMonthlyData(monthlyCreditTransactions, "credits"),
      monthlySpecAccesses: formatMonthlyData(monthlySpecAccessData, "specAccesses"),
      topSpecifications: topSpecifications.map((spec) => ({
        specificationId: spec.specificationId,
        specificationType: spec.specificationType,
        accessCount: spec._count._all,
        totalCreditsSpent: spec._sum.creditCost || 0,
      })),
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
