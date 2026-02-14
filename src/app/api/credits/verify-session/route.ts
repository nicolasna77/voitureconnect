import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/prisma";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID manquant" }, { status: 400 });
    }

    // Retrieve the Stripe checkout session
    const checkoutSession = await getStripe().checkout.sessions.retrieve(sessionId);

    // Verify payment was successful
    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json({
        error: "Paiement non complete",
        status: checkoutSession.payment_status
      }, { status: 400 });
    }

    // Verify the session belongs to this user
    const userId = checkoutSession.metadata?.userId;
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Session non autorisee" }, { status: 403 });
    }

    const credits = parseInt(checkoutSession.metadata?.credits || "0", 10);

    if (!credits) {
      return NextResponse.json({ error: "Credits non specifies" }, { status: 400 });
    }

    // Check if already processed (idempotency)
    const existingTransaction = await prisma.creditTransaction.findFirst({
      where: { referenceId: sessionId },
    });

    if (existingTransaction) {
      // Already processed, just return success
      const userCredit = await prisma.userCredit.findUnique({
        where: { userId: session.user.id },
      });

      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        credits: existingTransaction.amount,
        balance: userCredit?.balance || 0
      });
    }

    // Process the credit purchase
    const result = await prisma.$transaction(async (tx) => {
      // Upsert user credits
      const userCredit = await tx.userCredit.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          balance: credits,
        },
        update: {
          balance: {
            increment: credits,
          },
        },
      });

      // Record transaction
      await tx.creditTransaction.create({
        data: {
          userId: session.user.id,
          type: "PURCHASE",
          amount: credits,
          description: `Achat de ${credits} credits`,
          referenceId: sessionId,
        },
      });

      return userCredit;
    });

    console.log(`[Verify Session] Added ${credits} credits to user ${session.user.id}`);

    return NextResponse.json({
      success: true,
      credits,
      balance: result.balance
    });
  } catch (error) {
    console.error("Verify session error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la verification" },
      { status: 500 }
    );
  }
}
