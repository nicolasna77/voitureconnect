// This webhook is now handled by Better Auth Stripe plugin
// The plugin automatically handles checkout.session.completed events
// See: src/lib/auth.ts -> stripe plugin -> onEvent callback

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/prisma";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Fallback webhook handler in case Better Auth plugin doesn't catch the event
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Signature manquante" },
      { status: 400 }
    );
  }

  // Skip if no webhook secret configured (dev mode)
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn("[Webhook] STRIPE_WEBHOOK_SECRET not configured, skipping verification");
    return NextResponse.json({ received: true, warning: "No webhook secret configured" });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Signature invalide" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits || "0", 10);

    if (!userId || !credits) {
      console.error("Missing metadata in checkout session:", session.id);
      return NextResponse.json(
        { error: "Metadata manquante" },
        { status: 400 }
      );
    }

    // Check if already processed (idempotency)
    const existingTransaction = await prisma.creditTransaction.findFirst({
      where: { referenceId: session.id },
    });

    if (existingTransaction) {
      console.log(`[Webhook] Transaction already processed: ${session.id}`);
      return NextResponse.json({ received: true, status: "already_processed" });
    }

    try {
      // Add credits to user balance
      await prisma.$transaction(async (tx) => {
        // Upsert user credits
        await tx.userCredit.upsert({
          where: { userId },
          create: {
            userId,
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
            userId,
            type: "PURCHASE",
            amount: credits,
            description: `Achat de ${credits} credits`,
            referenceId: session.id,
          },
        });
      });

      console.log(`[Webhook] Added ${credits} credits to user ${userId}`);
    } catch (error) {
      console.error("Error processing credit purchase:", error);
      return NextResponse.json(
        { error: "Erreur lors du traitement" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
