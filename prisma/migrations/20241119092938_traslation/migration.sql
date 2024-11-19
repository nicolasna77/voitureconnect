-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carEquipmentId_FR_fkey_new";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carGenerationId_FR_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carMakeId_FR_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carModelId_FR_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carSerieId_FR_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carTrimId_FR_fkey_new";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carTypeId_FR_fkey";

-- AlterTable
ALTER TABLE "base"."Car" ADD COLUMN     "carEquipmentIdEN" INTEGER,
ADD COLUMN     "carGenerationIdEN" INTEGER,
ADD COLUMN     "carMakeIdEN" INTEGER,
ADD COLUMN     "carModelIdEN" INTEGER,
ADD COLUMN     "carSerieIdEN" INTEGER,
ADD COLUMN     "carTrimIdEN" INTEGER,
ADD COLUMN     "carTypeIdEN" INTEGER,
ALTER COLUMN "carModelId" DROP NOT NULL,
ALTER COLUMN "carTrimId" DROP NOT NULL,
ALTER COLUMN "carEquipmentId" DROP NOT NULL,
ALTER COLUMN "carGenerationId" DROP NOT NULL,
ALTER COLUMN "carMakeId" DROP NOT NULL,
ALTER COLUMN "carSerieId" DROP NOT NULL,
ALTER COLUMN "carTypeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "base"."User" ALTER COLUMN "role" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Car_carTypeIdEN_carMakeIdEN_carModelIdEN_idx" ON "base"."Car"("carTypeIdEN", "carMakeIdEN", "carModelIdEN");

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "dataCarFR"."car_type"("id_car_type") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carMakeId_fkey" FOREIGN KEY ("carMakeId") REFERENCES "dataCarFR"."car_make"("id_car_make") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "dataCarFR"."car_model"("id_car_model") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carGenerationId_fkey" FOREIGN KEY ("carGenerationId") REFERENCES "dataCarFR"."car_generation"("id_car_generation") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carSerieId_fkey" FOREIGN KEY ("carSerieId") REFERENCES "dataCarFR"."car_serie"("id_car_serie") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carTrimId_fkey" FOREIGN KEY ("carTrimId") REFERENCES "dataCarFR"."car_trim"("id_car_trim") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carEquipmentId_fkey" FOREIGN KEY ("carEquipmentId") REFERENCES "dataCarFR"."car_equipment"("id_car_equipment") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carTypeIdEN_fkey" FOREIGN KEY ("carTypeIdEN") REFERENCES "dataCarEN"."car_type"("id_car_type") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carMakeIdEN_fkey" FOREIGN KEY ("carMakeIdEN") REFERENCES "dataCarEN"."car_make"("id_car_make") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carModelIdEN_fkey" FOREIGN KEY ("carModelIdEN") REFERENCES "dataCarEN"."car_model"("id_car_model") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carGenerationIdEN_fkey" FOREIGN KEY ("carGenerationIdEN") REFERENCES "dataCarEN"."car_generation"("id_car_generation") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carSerieIdEN_fkey" FOREIGN KEY ("carSerieIdEN") REFERENCES "dataCarEN"."car_serie"("id_car_serie") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carTrimIdEN_fkey" FOREIGN KEY ("carTrimIdEN") REFERENCES "dataCarEN"."car_trim"("id_car_trim") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carEquipmentIdEN_fkey" FOREIGN KEY ("carEquipmentIdEN") REFERENCES "dataCarEN"."car_equipment"("id_car_equipment") ON DELETE SET NULL ON UPDATE CASCADE;
