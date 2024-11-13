-- DropForeignKey
ALTER TABLE "dataCarFR"."car_make" DROP CONSTRAINT "car_make_id_car_type_fkey";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carEquipmentId_fkey" TO "Car_carEquipmentFR_fkey";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carGenerationId_fkey" TO "Car_carGenerationFR_fkey";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carMakeId_fkey" TO "Car_carMakeFR_fkey";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carModelId_fkey" TO "Car_carModelFR_fkey";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carSerieId_fkey" TO "Car_carSerieFR_fkey";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carTrimId_fkey" TO "Car_carTrimFR_fkey";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carTypeId_fkey" TO "Car_carTypeFR_fkey";

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_make" ADD CONSTRAINT "car_make_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarFR"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;
