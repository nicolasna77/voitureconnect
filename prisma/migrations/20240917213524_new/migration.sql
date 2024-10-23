/*
  Warnings:

  - You are about to drop the column `carTrimId` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `carModelId` on the `CarGeneration` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarGeneration` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarMake` table. All the data in the column will be lost.
  - You are about to drop the column `carMakeId` on the `CarModel` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarModel` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarOption` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `CarOption` table. All the data in the column will be lost.
  - You are about to drop the column `carEquipmentId` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `carOptionId` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `carModelId` on the `CarSerie` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarSerie` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarSpecification` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `CarSpecification` table. All the data in the column will be lost.
  - You are about to drop the column `carSpecificationId` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to drop the column `carTrimId` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to drop the column `carSerieId` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarTrim` table. All the data in the column will be lost.
  - Added the required column `id_car_trim` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `CarEquipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_model` to the `CarGeneration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarGeneration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarMake` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_make` to the `CarModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_equipment` to the `CarOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_option` to the `CarOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_generation` to the `CarSerie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_model` to the `CarSerie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarSerie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarSpecification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_specification` to the `CarSpecificationValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_trim` to the `CarSpecificationValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarSpecificationValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_serie` to the `CarTrim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarTrim` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_carTrimId_fkey";

-- DropForeignKey
ALTER TABLE "CarGeneration" DROP CONSTRAINT "CarGeneration_carModelId_fkey";

-- DropForeignKey
ALTER TABLE "CarGeneration" DROP CONSTRAINT "CarGeneration_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "CarMake" DROP CONSTRAINT "CarMake_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "CarModel" DROP CONSTRAINT "CarModel_carMakeId_fkey";

-- DropForeignKey
ALTER TABLE "CarModel" DROP CONSTRAINT "CarModel_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "CarOption" DROP CONSTRAINT "CarOption_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "CarOptionValue" DROP CONSTRAINT "CarOptionValue_carEquipmentId_fkey";

-- DropForeignKey
ALTER TABLE "CarOptionValue" DROP CONSTRAINT "CarOptionValue_carOptionId_fkey";

-- DropForeignKey
ALTER TABLE "CarOptionValue" DROP CONSTRAINT "CarOptionValue_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "CarSerie" DROP CONSTRAINT "CarSerie_carModelId_fkey";

-- DropForeignKey
ALTER TABLE "CarSerie" DROP CONSTRAINT "CarSerie_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "CarSpecification" DROP CONSTRAINT "CarSpecification_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "CarSpecificationValue" DROP CONSTRAINT "CarSpecificationValue_carSpecificationId_fkey";

-- DropForeignKey
ALTER TABLE "CarSpecificationValue" DROP CONSTRAINT "CarSpecificationValue_carTrimId_fkey";

-- DropForeignKey
ALTER TABLE "CarSpecificationValue" DROP CONSTRAINT "CarSpecificationValue_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "CarTrim" DROP CONSTRAINT "CarTrim_carSerieId_fkey";

-- DropForeignKey
ALTER TABLE "CarTrim" DROP CONSTRAINT "CarTrim_carTypeId_fkey";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "carTrimId",
ADD COLUMN     "id_car_trim" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CarEquipment" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CarGeneration" DROP COLUMN "carModelId",
DROP COLUMN "carTypeId",
ADD COLUMN     "id_car_model" INTEGER NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CarMake" DROP COLUMN "carTypeId",
ADD COLUMN     "id_car_type" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CarModel" DROP COLUMN "carMakeId",
DROP COLUMN "carTypeId",
ADD COLUMN     "id_car_make" INTEGER NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CarOption" DROP COLUMN "carTypeId",
DROP COLUMN "parentId",
ADD COLUMN     "id_car_type" INTEGER NOT NULL,
ADD COLUMN     "id_parent" INTEGER;

-- AlterTable
ALTER TABLE "CarOptionValue" DROP COLUMN "carEquipmentId",
DROP COLUMN "carOptionId",
DROP COLUMN "carTypeId",
ADD COLUMN     "id_car_equipment" INTEGER NOT NULL,
ADD COLUMN     "id_car_option" INTEGER NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CarSerie" DROP COLUMN "carModelId",
DROP COLUMN "carTypeId",
ADD COLUMN     "id_car_generation" INTEGER NOT NULL,
ADD COLUMN     "id_car_model" INTEGER NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CarSpecification" DROP COLUMN "carTypeId",
DROP COLUMN "parentId",
ADD COLUMN     "id_car_type" INTEGER NOT NULL,
ADD COLUMN     "id_parent" INTEGER;

-- AlterTable
ALTER TABLE "CarSpecificationValue" DROP COLUMN "carSpecificationId",
DROP COLUMN "carTrimId",
DROP COLUMN "carTypeId",
ADD COLUMN     "id_car_specification" INTEGER NOT NULL,
ADD COLUMN     "id_car_trim" INTEGER NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CarTrim" DROP COLUMN "carSerieId",
DROP COLUMN "carTypeId",
ADD COLUMN     "id_car_serie" INTEGER NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CarMake" ADD CONSTRAINT "CarMake_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarModel" ADD CONSTRAINT "CarModel_id_car_make_fkey" FOREIGN KEY ("id_car_make") REFERENCES "CarMake"("id_car_make") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarModel" ADD CONSTRAINT "CarModel_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarGeneration" ADD CONSTRAINT "CarGeneration_id_car_model_fkey" FOREIGN KEY ("id_car_model") REFERENCES "CarModel"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarGeneration" ADD CONSTRAINT "CarGeneration_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOption" ADD CONSTRAINT "CarOption_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOptionValue" ADD CONSTRAINT "CarOptionValue_id_car_option_fkey" FOREIGN KEY ("id_car_option") REFERENCES "CarOption"("id_car_option") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOptionValue" ADD CONSTRAINT "CarOptionValue_id_car_equipment_fkey" FOREIGN KEY ("id_car_equipment") REFERENCES "CarEquipment"("id_car_equipment") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOptionValue" ADD CONSTRAINT "CarOptionValue_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecification" ADD CONSTRAINT "CarSpecification_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecificationValue" ADD CONSTRAINT "CarSpecificationValue_id_car_trim_fkey" FOREIGN KEY ("id_car_trim") REFERENCES "CarTrim"("id_car_trim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecificationValue" ADD CONSTRAINT "CarSpecificationValue_id_car_specification_fkey" FOREIGN KEY ("id_car_specification") REFERENCES "CarSpecification"("id_car_specification") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecificationValue" ADD CONSTRAINT "CarSpecificationValue_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarTrim" ADD CONSTRAINT "CarTrim_id_car_serie_fkey" FOREIGN KEY ("id_car_serie") REFERENCES "CarSerie"("id_car_serie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarTrim" ADD CONSTRAINT "CarTrim_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSerie" ADD CONSTRAINT "CarSerie_id_car_model_fkey" FOREIGN KEY ("id_car_model") REFERENCES "CarModel"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSerie" ADD CONSTRAINT "CarSerie_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_id_car_trim_fkey" FOREIGN KEY ("id_car_trim") REFERENCES "CarTrim"("id_car_trim") ON DELETE RESTRICT ON UPDATE CASCADE;
