/*
  Warnings:

  - Added the required column `carMakeId` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carTypeId` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "carEquipmentId" INTEGER,
ADD COLUMN     "carGenerationId" INTEGER,
ADD COLUMN     "carMakeId" INTEGER NOT NULL,
ADD COLUMN     "carOptionId" INTEGER,
ADD COLUMN     "carOptionValueId" INTEGER,
ADD COLUMN     "carSerieId" INTEGER,
ADD COLUMN     "carSpecificationId" INTEGER,
ADD COLUMN     "carSpecificationValueId" INTEGER,
ADD COLUMN     "carTypeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carMakeId_fkey" FOREIGN KEY ("carMakeId") REFERENCES "CarMake"("id_car_make") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carGenerationId_fkey" FOREIGN KEY ("carGenerationId") REFERENCES "CarGeneration"("id_car_generation") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carSerieId_fkey" FOREIGN KEY ("carSerieId") REFERENCES "CarSerie"("id_car_serie") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carEquipmentId_fkey" FOREIGN KEY ("carEquipmentId") REFERENCES "CarEquipment"("id_car_equipment") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carOptionId_fkey" FOREIGN KEY ("carOptionId") REFERENCES "CarOption"("id_car_option") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carOptionValueId_fkey" FOREIGN KEY ("carOptionValueId") REFERENCES "CarOptionValue"("id_car_option_value") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carSpecificationId_fkey" FOREIGN KEY ("carSpecificationId") REFERENCES "CarSpecification"("id_car_specification") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carSpecificationValueId_fkey" FOREIGN KEY ("carSpecificationValueId") REFERENCES "CarSpecificationValue"("id_car_specification_value") ON DELETE SET NULL ON UPDATE CASCADE;
