import { auth } from "@/lib/auth";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

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
            const dataDate = new Date(d.createdAt);
            return (
              dataDate.getMonth() === month.date.getMonth() &&
              dataDate.getFullYear() === month.date.getFullYear()
            );
          })
          .reduce((acc, curr) => {
            // Pour les transactions, utiliser _sum.amount
            if (valueKey === "transactions") {
              return acc + (curr._sum?.amount?.toNumber() || 0);
            }
            // Pour les autres statistiques, utiliser _count
            return acc + (curr._count?._all || 0);
          }, 0),
      }));
    };

    return NextResponse.json({
      totalUsers,
      totalAds,
      totalSubscriptions,
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
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
