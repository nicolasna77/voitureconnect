/*
  Warnings:

  - You are about to drop the column `identifier` on the `VerificationToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `VerificationToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "base"."VerificationToken_identifier_token_key";

-- DropIndex
DROP INDEX "base"."VerificationToken_token_key";

-- AlterTable
ALTER TABLE "base"."User" ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "base"."VerificationToken" DROP COLUMN "identifier",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Car_carTypeId_carMakeId_carModelId_idx" ON "base"."Car"("carTypeId", "carMakeId", "carModelId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_email_token_key" ON "base"."VerificationToken"("email", "token");

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carEquipmentFR_fkey" TO "Car_carEquipmentId_FR_fkey";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carGenerationFR_fkey" TO "Car_carGenerationId_FR_fkey";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carMakeFR_fkey" TO "Car_carMakeId_FR_fkey";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carModelFR_fkey" TO "Car_carModelId_FR_fkey";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carSerieFR_fkey" TO "Car_carSerieId_FR_fkey";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carTrimFR_fkey" TO "Car_carTrimId_FR_fkey";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carTypeFR_fkey" TO "Car_carTypeId_FR_fkey";
