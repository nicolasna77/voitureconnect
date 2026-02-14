import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CREDIT_PACKAGES } from "@/config/credits";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Start both operations in parallel (async-parallel optimization)
    const sessionPromise = auth.api.getSession({
      headers: await headers(),
    });
    const bodyPromise = req.json();

    const [session, body] = await Promise.all([sessionPromise, bodyPromise]);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { packageId } = body;

    const creditPackage = CREDIT_PACKAGES.find((p) => p.id === packageId);
    if (!creditPackage) {
      return NextResponse.json({ error: "Pack invalide" }, { status: 400 });
    }

    // Get Stripe customer ID from user (managed by Better Auth Stripe plugin)
    let stripeCustomerId = (session.user as { stripeCustomerId?: string }).stripeCustomerId;

    if (!stripeCustomerId) {
      // Create customer if not exists (fallback, normally handled by plugin)
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: {
          userId: session.user.id,
        },
      });
      stripeCustomerId = customer.id;
    }

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${creditPackage.credits} Credits`,
              description: `Pack de ${creditPackage.credits} credits pour fiches techniques`,
            },
            unit_amount: Math.round(creditPackage.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        credits: creditPackage.credits.toString(),
        packageId: creditPackage.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/credits`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de la session" },
      { status: 500 }
    );
  }
}
