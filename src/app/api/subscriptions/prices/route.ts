import { NextResponse } from "next/server";
import { SubscriptionPlan } from "@prisma/client";
import prisma from "@/prisma";

function roundUpToTwoDecimals(num: number): number {
  return Number((Math.ceil(num * 100) / 100).toFixed(2));
}

function calculateAnnualPrice(monthlyPrice: number): number {
  // Calculer le prix annuel : prix mensuel * 12 mois - 10%
  const annualBeforeDiscount = monthlyPrice * 12;
  const discount = annualBeforeDiscount * 0.1; // 10% de réduction
  return roundUpToTwoDecimals(annualBeforeDiscount - discount);
}

export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: "active",
      },
      select: {
        plan: true,
        amount: true,
        isAnnual: true,
      },
    });

    const pricesByPlan = Object.values(SubscriptionPlan).map((plan) => {
      const monthlySubscription = subscriptions.find(
        (s) => s.plan === plan && !s.isAnnual
      );

      const monthlyPrice = monthlySubscription?.amount?.toNumber() || 0;
      const annualPrice = calculateAnnualPrice(monthlyPrice);

      return {
        plan,
        monthlyPrice: roundUpToTwoDecimals(monthlyPrice),
        annualPrice: annualPrice,
      };
    });

    return NextResponse.json(pricesByPlan);
  } catch (error) {
    console.error("Erreur lors de la récupération des prix:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des prix" },
      { status: 500 }
    );
  }
}
