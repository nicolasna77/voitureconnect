-- CreateEnum
CREATE TYPE "base"."SubscriptionPlan" AS ENUM ('BASIC', 'PRO_STANDARD', 'PRO_PREMIUM');

-- CreateTable
CREATE TABLE "base"."subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "base"."SubscriptionPlan" NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isAnnual" BOOLEAN NOT NULL DEFAULT false,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "base"."subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "base"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
