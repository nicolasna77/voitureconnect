/*
  Warnings:

  - You are about to drop the column `make` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `vin` on the `Car` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vin]` on the table `Ad` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vin` to the `Ad` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Car_vin_key";

-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "vin" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "make",
DROP COLUMN "vin",
ADD COLUMN     "garageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Ad_vin_key" ON "Ad"("vin");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
