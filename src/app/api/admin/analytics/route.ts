import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      creditPurchases,
      creditConsumptions,
      totalCreditsBalance,
      totalSpecAccesses,
      topSpecifications,
      monthlyCreditTransactions,
      monthlySpecAccessData,
    ] = await Promise.all([
      prisma.creditTransaction.aggregate({
        _sum: { amount: true },
        where: { type: "PURCHASE" },
      }),
      prisma.creditTransaction.aggregate({
        _sum: { amount: true },
        where: { type: "CONSUMPTION" },
      }),
      prisma.userCredit.aggregate({
        _sum: { balance: true },
      }),
      prisma.specificationAccess.count(),
      prisma.specificationAccess.groupBy({
        by: ["specificationId", "specificationType"],
        _count: { _all: true },
        _sum: { creditCost: true },
        orderBy: { _count: { specificationId: "desc" } },
        take: 10,
      }),
      prisma.creditTransaction.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: { gte: sixMonthsAgo },
          type: "PURCHASE",
        },
        _sum: { amount: true },
      }),
      prisma.specificationAccess.groupBy({
        by: ["accessedAt"],
        where: {
          accessedAt: { gte: sixMonthsAgo },
        },
        _count: { _all: true },
      }),
    ]);

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
            if (valueKey === "credits") {
              return acc + (curr._sum?.amount || 0);
            }
            return acc + (curr._count?._all || 0);
          }, 0),
      }));
    };

    return NextResponse.json({
      totalCreditsPurchased: creditPurchases._sum.amount || 0,
      totalCreditsUsed: creditConsumptions._sum.amount || 0,
      totalCreditsBalance: totalCreditsBalance._sum.balance || 0,
      totalSpecAccesses,
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
    console.error("[ADMIN_ANALYTICS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
