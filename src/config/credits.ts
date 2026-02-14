export const CREDIT_PACKAGES = [
  {
    id: "credits_10",
    credits: 10,
    price: 4.99,
    stripePriceId: process.env.STRIPE_PRICE_10_CREDITS,
  },
  {
    id: "credits_50",
    credits: 50,
    price: 19.99,
    stripePriceId: process.env.STRIPE_PRICE_50_CREDITS,
  },
  {
    id: "credits_100",
    credits: 100,
    price: 34.99,
    stripePriceId: process.env.STRIPE_PRICE_100_CREDITS,
  },
] as const;

// Specification sheets are now FREE for all users
export const SPECIFICATION_CREDIT_COST = 0;

// Cost for AI analysis features (report + chat) - only for USER role
// ADMIN and PRO users have free access to AI features
export const AI_ANALYSIS_CREDIT_COST = 1;

export type CreditPackage = (typeof CREDIT_PACKAGES)[number];
