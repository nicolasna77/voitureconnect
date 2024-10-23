/*
  Warnings:

  - Added the required column `carModelId` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carTrimId` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "carModelId" INTEGER NOT NULL,
ADD COLUMN     "carTrimId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carTrimId_fkey" FOREIGN KEY ("carTrimId") REFERENCES "CarTrim"("id_car_trim") ON DELETE RESTRICT ON UPDATE CASCADE;
