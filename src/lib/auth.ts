import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import prisma from "@/prisma";
import {
  sendPasswordResetEmail,
  sendEmailVerification,
  sendWelcomeEmail,
  sendDeleteAccountVerification,
  sendCreditPurchaseConfirmation,
} from "@/lib/email";

const stripeClient = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : undefined;

// Build plugins array conditionally
const plugins = [];

// Only add Stripe plugin if webhook secret is configured
if (stripeClient && process.env.STRIPE_WEBHOOK_SECRET) {
  plugins.push(
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
      onEvent: async (event) => {
        // Handle credit purchase completion via webhook
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          const credits = parseInt(session.metadata?.credits || "0", 10);

          if (userId && credits > 0) {
            // Check if already processed (idempotency)
            const existing = await prisma.creditTransaction.findFirst({
              where: { referenceId: session.id },
            });

            if (existing) {
              console.log(`[Stripe Plugin] Transaction already processed: ${session.id}`);
              return;
            }

            try {
              await prisma.$transaction(async (tx) => {
                await tx.userCredit.upsert({
                  where: { userId },
                  create: { userId, balance: credits },
                  update: { balance: { increment: credits } },
                });

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

              // Send purchase confirmation email
              const user = await prisma.user.findUnique({ where: { id: userId } });
              if (user?.email) {
                const amountTotal = session.amount_total || 0;
                await sendCreditPurchaseConfirmation(user.email, user.name, credits, amountTotal).catch(
                  (err) => console.error("[Email] Purchase confirmation error:", err)
                );
              }

              console.log(`[Stripe Plugin] Added ${credits} credits to user ${userId}`);
            } catch (error) {
              console.error("[Stripe Plugin] Error processing credit purchase:", error);
            }
          }
        }
      },
    })
  );
}

export const auth = betterAuth({
  appName: "DriveMetric",

  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  database: prismaAdapter(prisma, { provider: "postgresql" }),

  // Trusted origins for CSRF protection
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    // Add production URLs here
  ].filter(Boolean) as string[],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    // Password reset handler
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(user.email, url).catch(
        (err) => console.error("[Email] Password reset error:", err)
      );
    },
    // Password requirements
    minPasswordLength: 8,
  },

  // Email verification (ready for when you add email service)
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerification(user.email, url).catch(
        (err) => console.error("[Email] Verification error:", err)
      );
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || "",
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        input: false,
      },
      picture: {
        type: "string",
        defaultValue:
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
        input: false,
      },
    },
    // Enable user deletion via Better Auth
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountVerification(user.email, url).catch(
          (err) => console.error("[Email] Delete account verification error:", err)
        );
      },
    },
    // Enable email change
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        await sendEmailVerification(newEmail, url).catch(
          (err) => console.error("[Email] Change email verification error:", err)
        );
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: false,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  // Grant 3 free credits on sign-up
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await prisma.$transaction(async (tx) => {
              await tx.userCredit.create({
                data: { userId: user.id, balance: 3 },
              });
              await tx.creditTransaction.create({
                data: {
                  userId: user.id,
                  type: "BONUS",
                  amount: 3,
                  description: "Bienvenue ! 3 crédits offerts à l'inscription",
                },
              });
            });

            // Send welcome email
            if (user.email) {
              await sendWelcomeEmail(user.email, user.name || "").catch(
                (err) => console.error("[Email] Welcome email error:", err)
              );
            }
          } catch (error) {
            console.error("[Auth] Error granting welcome credits:", error);
          }
        },
      },
    },
  },

  // Rate limiting for security
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute window
    max: 100, // Max 100 requests per window
    storage: "memory", // Use "database" or "secondary-storage" for production
  },

  // Advanced security options
  advanced: {
    // Use secure cookies in production
    useSecureCookies: process.env.NODE_ENV === "production",
    // IP address headers for proxies (Vercel, Cloudflare, etc.)
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
    },
  },

  plugins,
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
