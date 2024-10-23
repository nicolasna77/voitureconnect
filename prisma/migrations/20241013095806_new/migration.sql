/*
  Warnings:

  - You are about to drop the column `carTrimId_car_trim` on the `Ad` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "carTrimId_car_trim",
ADD COLUMN     "carTrimId" INTEGER;

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_carTrimId_fkey" FOREIGN KEY ("carTrimId") REFERENCES "CarTrim"("id_car_trim") ON DELETE SET NULL ON UPDATE CASCADE;
