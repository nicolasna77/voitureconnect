/*
  Warnings:

  - The primary key for the `CarEquipment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carTrimId` on the `CarEquipment` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarEquipment` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreate` on the `CarEquipment` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `CarEquipment` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CarEquipment` table. All the data in the column will be lost.
  - The `year` column on the `CarEquipment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CarGeneration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carModelId` on the `CarGeneration` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarGeneration` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreate` on the `CarGeneration` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `CarGeneration` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CarGeneration` table. All the data in the column will be lost.
  - You are about to drop the column `yearBegin` on the `CarGeneration` table. All the data in the column will be lost.
  - You are about to drop the column `yearEnd` on the `CarGeneration` table. All the data in the column will be lost.
  - The primary key for the `CarMake` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carTypeId` on the `CarMake` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreate` on the `CarMake` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `CarMake` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CarMake` table. All the data in the column will be lost.
  - The primary key for the `CarModel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carMakeId` on the `CarModel` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarModel` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreate` on the `CarModel` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `CarModel` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CarModel` table. All the data in the column will be lost.
  - The primary key for the `CarOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carTypeId` on the `CarOption` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreate` on the `CarOption` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `CarOption` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CarOption` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `CarOption` table. All the data in the column will be lost.
  - The primary key for the `CarOptionValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carEquipmentId` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `carOptionId` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreate` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `isBase` on the `CarOptionValue` table. All the data in the column will be lost.
  - The primary key for the `CarSerie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carGenerationId` on the `CarSerie` table. All the data in the column will be lost.
  - You are about to drop the column `carModelId` on the `CarSerie` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarSerie` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreate` on the `CarSerie` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `CarSerie` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CarSerie` table. All the data in the column will be lost.
  - The primary key for the `CarSpecification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carTypeId` on the `CarSpecification` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreate` on the `CarSpecification` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `CarSpecification` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CarSpecification` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `CarSpecification` table. All the data in the column will be lost.
  - The primary key for the `CarSpecificationValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carSpecificationId` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to drop the column `carTrimId` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreate` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - The primary key for the `CarTrim` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carModelId` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `carSerieId` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `carTypeId` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreate` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `endProductionYear` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `startProductionYear` on the `CarTrim` table. All the data in the column will be lost.
  - The primary key for the `CarType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CarType` table. All the data in the column will be lost.
  - Added the required column `id_car_trim` to the `CarEquipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarEquipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_model` to the `CarGeneration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarGeneration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarMake` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `CarMake` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id_car_make` to the `CarModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarOption` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `CarOption` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id_car_equipment` to the `CarOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_option` to the `CarOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_base` to the `CarOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_generation` to the `CarSerie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_model` to the `CarSerie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarSerie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarSpecification` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `CarSpecification` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id_car_specification` to the `CarSpecificationValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_trim` to the `CarSpecificationValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarSpecificationValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_model` to the `CarTrim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_serie` to the `CarTrim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_type` to the `CarTrim` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `CarType` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CarEquipment" DROP CONSTRAINT "CarEquipment_carTrimId_fkey";

-- DropForeignKey
ALTER TABLE "CarEquipment" DROP CONSTRAINT "CarEquipment_carTypeId_fkey";

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
ALTER TABLE "CarOption" DROP CONSTRAINT "CarOption_parentId_fkey";

-- DropForeignKey
ALTER TABLE "CarOptionValue" DROP CONSTRAINT "CarOptionValue_carEquipmentId_fkey";

-- DropForeignKey
ALTER TABLE "CarOptionValue" DROP CONSTRAINT "CarOptionValue_carOptionId_fkey";

-- DropForeignKey
ALTER TABLE "CarOptionValue" DROP CONSTRAINT "CarOptionValue_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "CarSerie" DROP CONSTRAINT "CarSerie_carGenerationId_fkey";

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
ALTER TABLE "CarTrim" DROP CONSTRAINT "CarTrim_carModelId_fkey";

-- DropForeignKey
ALTER TABLE "CarTrim" DROP CONSTRAINT "CarTrim_carSerieId_fkey";

-- DropForeignKey
ALTER TABLE "CarTrim" DROP CONSTRAINT "CarTrim_carTypeId_fkey";

-- AlterTable
ALTER TABLE "CarEquipment" DROP CONSTRAINT "CarEquipment_pkey",
DROP COLUMN "carTrimId",
DROP COLUMN "carTypeId",
DROP COLUMN "dateCreate",
DROP COLUMN "dateUpdate",
DROP COLUMN "id",
ADD COLUMN     "date_create" INTEGER,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "id_car_equipment" SERIAL NOT NULL,
ADD COLUMN     "id_car_trim" INTEGER NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL,
DROP COLUMN "year",
ADD COLUMN     "year" INTEGER,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ADD CONSTRAINT "CarEquipment_pkey" PRIMARY KEY ("id_car_equipment");

-- AlterTable
ALTER TABLE "CarGeneration" DROP CONSTRAINT "CarGeneration_pkey",
DROP COLUMN "carModelId",
DROP COLUMN "carTypeId",
DROP COLUMN "dateCreate",
DROP COLUMN "dateUpdate",
DROP COLUMN "id",
DROP COLUMN "yearBegin",
DROP COLUMN "yearEnd",
ADD COLUMN     "date_create" INTEGER,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "id_car_generation" SERIAL NOT NULL,
ADD COLUMN     "id_car_model" INTEGER NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL,
ADD COLUMN     "year_begin" INTEGER,
ADD COLUMN     "year_end" INTEGER,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ADD CONSTRAINT "CarGeneration_pkey" PRIMARY KEY ("id_car_generation");

-- AlterTable
ALTER TABLE "CarMake" DROP CONSTRAINT "CarMake_pkey",
DROP COLUMN "carTypeId",
DROP COLUMN "dateCreate",
DROP COLUMN "dateUpdate",
DROP COLUMN "id",
ADD COLUMN     "date_create" INTEGER,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "id_car_make" SERIAL NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ADD CONSTRAINT "CarMake_pkey" PRIMARY KEY ("id_car_make");

-- AlterTable
ALTER TABLE "CarModel" DROP CONSTRAINT "CarModel_pkey",
DROP COLUMN "carMakeId",
DROP COLUMN "carTypeId",
DROP COLUMN "dateCreate",
DROP COLUMN "dateUpdate",
DROP COLUMN "id",
ADD COLUMN     "date_create" INTEGER,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "id_car_make" INTEGER NOT NULL,
ADD COLUMN     "id_car_model" SERIAL NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL,
ADD CONSTRAINT "CarModel_pkey" PRIMARY KEY ("id_car_model");

-- AlterTable
ALTER TABLE "CarOption" DROP CONSTRAINT "CarOption_pkey",
DROP COLUMN "carTypeId",
DROP COLUMN "dateCreate",
DROP COLUMN "dateUpdate",
DROP COLUMN "id",
DROP COLUMN "parentId",
ADD COLUMN     "date_create" INTEGER,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "id_car_option" SERIAL NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL,
ADD COLUMN     "id_parent" INTEGER,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ADD CONSTRAINT "CarOption_pkey" PRIMARY KEY ("id_car_option");

-- AlterTable
ALTER TABLE "CarOptionValue" DROP CONSTRAINT "CarOptionValue_pkey",
DROP COLUMN "carEquipmentId",
DROP COLUMN "carOptionId",
DROP COLUMN "carTypeId",
DROP COLUMN "dateCreate",
DROP COLUMN "dateUpdate",
DROP COLUMN "id",
DROP COLUMN "isBase",
ADD COLUMN     "date_create" INTEGER,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "id_car_equipment" INTEGER NOT NULL,
ADD COLUMN     "id_car_option" INTEGER NOT NULL,
ADD COLUMN     "id_car_option_value" SERIAL NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL,
ADD COLUMN     "is_base" BOOLEAN NOT NULL,
ADD CONSTRAINT "CarOptionValue_pkey" PRIMARY KEY ("id_car_option_value");

-- AlterTable
ALTER TABLE "CarSerie" DROP CONSTRAINT "CarSerie_pkey",
DROP COLUMN "carGenerationId",
DROP COLUMN "carModelId",
DROP COLUMN "carTypeId",
DROP COLUMN "dateCreate",
DROP COLUMN "dateUpdate",
DROP COLUMN "id",
ADD COLUMN     "date_create" INTEGER,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "id_car_generation" INTEGER NOT NULL,
ADD COLUMN     "id_car_model" INTEGER NOT NULL,
ADD COLUMN     "id_car_serie" SERIAL NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ADD CONSTRAINT "CarSerie_pkey" PRIMARY KEY ("id_car_serie");

-- AlterTable
ALTER TABLE "CarSpecification" DROP CONSTRAINT "CarSpecification_pkey",
DROP COLUMN "carTypeId",
DROP COLUMN "dateCreate",
DROP COLUMN "dateUpdate",
DROP COLUMN "id",
DROP COLUMN "parentId",
ADD COLUMN     "date_create" INTEGER,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "id_car_specification" SERIAL NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL,
ADD COLUMN     "id_parent" INTEGER,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ADD CONSTRAINT "CarSpecification_pkey" PRIMARY KEY ("id_car_specification");

-- AlterTable
ALTER TABLE "CarSpecificationValue" DROP CONSTRAINT "CarSpecificationValue_pkey",
DROP COLUMN "carSpecificationId",
DROP COLUMN "carTrimId",
DROP COLUMN "carTypeId",
DROP COLUMN "dateCreate",
DROP COLUMN "dateUpdate",
DROP COLUMN "id",
ADD COLUMN     "date_create" INTEGER,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "id_car_specification" INTEGER NOT NULL,
ADD COLUMN     "id_car_specification_value" SERIAL NOT NULL,
ADD COLUMN     "id_car_trim" INTEGER NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL,
ALTER COLUMN "value" SET DATA TYPE TEXT,
ALTER COLUMN "unit" SET DATA TYPE TEXT,
ADD CONSTRAINT "CarSpecificationValue_pkey" PRIMARY KEY ("id_car_specification_value");

-- AlterTable
ALTER TABLE "CarTrim" DROP CONSTRAINT "CarTrim_pkey",
DROP COLUMN "carModelId",
DROP COLUMN "carSerieId",
DROP COLUMN "carTypeId",
DROP COLUMN "dateCreate",
DROP COLUMN "dateUpdate",
DROP COLUMN "endProductionYear",
DROP COLUMN "id",
DROP COLUMN "startProductionYear",
ADD COLUMN     "date_create" INTEGER,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "end_production_year" INTEGER,
ADD COLUMN     "id_car_model" INTEGER NOT NULL,
ADD COLUMN     "id_car_serie" INTEGER NOT NULL,
ADD COLUMN     "id_car_trim" SERIAL NOT NULL,
ADD COLUMN     "id_car_type" INTEGER NOT NULL,
ADD COLUMN     "start_production_year" INTEGER,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ADD CONSTRAINT "CarTrim_pkey" PRIMARY KEY ("id_car_trim");

-- AlterTable
ALTER TABLE "CarType" DROP CONSTRAINT "CarType_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_car_type" SERIAL NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ADD CONSTRAINT "CarType_pkey" PRIMARY KEY ("id_car_type");

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
ALTER TABLE "CarSerie" ADD CONSTRAINT "CarSerie_id_car_model_fkey" FOREIGN KEY ("id_car_model") REFERENCES "CarModel"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSerie" ADD CONSTRAINT "CarSerie_id_car_generation_fkey" FOREIGN KEY ("id_car_generation") REFERENCES "CarGeneration"("id_car_generation") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSerie" ADD CONSTRAINT "CarSerie_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarTrim" ADD CONSTRAINT "CarTrim_id_car_serie_fkey" FOREIGN KEY ("id_car_serie") REFERENCES "CarSerie"("id_car_serie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarTrim" ADD CONSTRAINT "CarTrim_id_car_model_fkey" FOREIGN KEY ("id_car_model") REFERENCES "CarModel"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarTrim" ADD CONSTRAINT "CarTrim_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarEquipment" ADD CONSTRAINT "CarEquipment_id_car_trim_fkey" FOREIGN KEY ("id_car_trim") REFERENCES "CarTrim"("id_car_trim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarEquipment" ADD CONSTRAINT "CarEquipment_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

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
