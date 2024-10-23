/*
  Warnings:

  - You are about to drop the column `id_car_trim` on the `Car` table. All the data in the column will be lost.
  - The primary key for the `CarEquipment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_create` on the `CarEquipment` table. All the data in the column will be lost.
  - You are about to drop the column `date_update` on the `CarEquipment` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_equipment` on the `CarEquipment` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_trim` on the `CarEquipment` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_type` on the `CarEquipment` table. All the data in the column will be lost.
  - You are about to alter the column `year` on the `CarEquipment` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(4)`.
  - You are about to alter the column `name` on the `CarEquipment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - The primary key for the `CarModel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_create` on the `CarModel` table. All the data in the column will be lost.
  - You are about to drop the column `date_update` on the `CarModel` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_make` on the `CarModel` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_model` on the `CarModel` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_type` on the `CarModel` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `CarModel` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(13)`.
  - The primary key for the `CarOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_create` on the `CarOption` table. All the data in the column will be lost.
  - You are about to drop the column `date_update` on the `CarOption` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_option` on the `CarOption` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_type` on the `CarOption` table. All the data in the column will be lost.
  - You are about to drop the column `id_parent` on the `CarOption` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `CarOption` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(139)`.
  - The primary key for the `CarOptionValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carEquipmentId_car_equipment` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `date_create` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `date_update` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_equipment` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_option` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_option_value` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_type` on the `CarOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `is_base` on the `CarOptionValue` table. All the data in the column will be lost.
  - The primary key for the `CarSerie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_create` on the `CarSerie` table. All the data in the column will be lost.
  - You are about to drop the column `date_update` on the `CarSerie` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_generation` on the `CarSerie` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_model` on the `CarSerie` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_serie` on the `CarSerie` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_type` on the `CarSerie` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `CarSerie` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.
  - The primary key for the `CarSpecification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_create` on the `CarSpecification` table. All the data in the column will be lost.
  - You are about to drop the column `date_update` on the `CarSpecification` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_specification` on the `CarSpecification` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_type` on the `CarSpecification` table. All the data in the column will be lost.
  - You are about to drop the column `id_parent` on the `CarSpecification` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `CarSpecification` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(43)`.
  - The primary key for the `CarSpecificationValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_create` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to drop the column `date_update` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_specification` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_specification_value` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_trim` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_type` on the `CarSpecificationValue` table. All the data in the column will be lost.
  - You are about to alter the column `value` on the `CarSpecificationValue` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(72)`.
  - You are about to alter the column `unit` on the `CarSpecificationValue` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(6)`.
  - The primary key for the `CarTrim` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_create` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `date_update` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `end_production_year` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_model` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_serie` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_trim` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `id_car_type` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the column `start_production_year` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `CarTrim` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(35)`.
  - The primary key for the `CarType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_car_type` on the `CarType` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `CarType` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(3)`.
  - Added the required column `carTrimId` to the `CarEquipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carTypeId` to the `CarEquipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateCreate` to the `CarEquipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateUpdate` to the `CarEquipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carMakeId` to the `CarModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carTypeId` to the `CarModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateCreate` to the `CarModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carTypeId` to the `CarOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateCreate` to the `CarOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateUpdate` to the `CarOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carEquipmentId` to the `CarOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carOptionId` to the `CarOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carTypeId` to the `CarOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateCreate` to the `CarOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateUpdate` to the `CarOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isBase` to the `CarOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carGenerationId` to the `CarSerie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carModelId` to the `CarSerie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carTypeId` to the `CarSerie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateCreate` to the `CarSerie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carTypeId` to the `CarSpecification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateCreate` to the `CarSpecification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carSpecificationId` to the `CarSpecificationValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carTrimId` to the `CarSpecificationValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carTypeId` to the `CarSpecificationValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateCreate` to the `CarSpecificationValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carModelId` to the `CarTrim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carSerieId` to the `CarTrim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carTypeId` to the `CarTrim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateCreate` to the `CarTrim` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ad" DROP CONSTRAINT "Ad_carTrimId_car_trim_fkey";

-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_id_car_trim_fkey";

-- DropForeignKey
ALTER TABLE "CarEquipment" DROP CONSTRAINT "CarEquipment_id_car_trim_fkey";

-- DropForeignKey
ALTER TABLE "CarEquipment" DROP CONSTRAINT "CarEquipment_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "CarModel" DROP CONSTRAINT "CarModel_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "CarOptionValue" DROP CONSTRAINT "CarOptionValue_carEquipmentId_car_equipment_fkey";

-- DropForeignKey
ALTER TABLE "CarOptionValue" DROP CONSTRAINT "CarOptionValue_id_car_option_fkey";

-- DropForeignKey
ALTER TABLE "CarSerie" DROP CONSTRAINT "CarSerie_id_car_model_fkey";

-- DropForeignKey
ALTER TABLE "CarSpecification" DROP CONSTRAINT "CarSpecification_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "CarSpecificationValue" DROP CONSTRAINT "CarSpecificationValue_id_car_specification_fkey";

-- DropForeignKey
ALTER TABLE "CarSpecificationValue" DROP CONSTRAINT "CarSpecificationValue_id_car_trim_fkey";

-- DropForeignKey
ALTER TABLE "CarSpecificationValue" DROP CONSTRAINT "CarSpecificationValue_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "CarTrim" DROP CONSTRAINT "CarTrim_id_car_model_fkey";

-- DropForeignKey
ALTER TABLE "CarTrim" DROP CONSTRAINT "CarTrim_id_car_serie_fkey";

-- DropForeignKey
ALTER TABLE "CarTrim" DROP CONSTRAINT "CarTrim_id_car_type_fkey";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "id_car_trim";

-- AlterTable
ALTER TABLE "CarEquipment" DROP CONSTRAINT "CarEquipment_pkey",
DROP COLUMN "date_create",
DROP COLUMN "date_update",
DROP COLUMN "id_car_equipment",
DROP COLUMN "id_car_trim",
DROP COLUMN "id_car_type",
ADD COLUMN     "carTrimId" INTEGER NOT NULL,
ADD COLUMN     "carTypeId" SMALLINT NOT NULL,
ADD COLUMN     "dateCreate" BIGINT NOT NULL,
ADD COLUMN     "dateUpdate" BIGINT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "year" SET DATA TYPE VARCHAR(4),
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(30),
ADD CONSTRAINT "CarEquipment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CarModel" DROP CONSTRAINT "CarModel_pkey",
DROP COLUMN "date_create",
DROP COLUMN "date_update",
DROP COLUMN "id_car_make",
DROP COLUMN "id_car_model",
DROP COLUMN "id_car_type",
ADD COLUMN     "carMakeId" SMALLINT NOT NULL,
ADD COLUMN     "carTypeId" SMALLINT NOT NULL,
ADD COLUMN     "dateCreate" BIGINT NOT NULL,
ADD COLUMN     "dateUpdate" VARCHAR(10),
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(13),
ADD CONSTRAINT "CarModel_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CarOption" DROP CONSTRAINT "CarOption_pkey",
DROP COLUMN "date_create",
DROP COLUMN "date_update",
DROP COLUMN "id_car_option",
DROP COLUMN "id_car_type",
DROP COLUMN "id_parent",
ADD COLUMN     "carTypeId" SMALLINT NOT NULL,
ADD COLUMN     "dateCreate" BIGINT NOT NULL,
ADD COLUMN     "dateUpdate" BIGINT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "parentId" SMALLINT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(139),
ADD CONSTRAINT "CarOption_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CarOptionValue" DROP CONSTRAINT "CarOptionValue_pkey",
DROP COLUMN "carEquipmentId_car_equipment",
DROP COLUMN "date_create",
DROP COLUMN "date_update",
DROP COLUMN "id_car_equipment",
DROP COLUMN "id_car_option",
DROP COLUMN "id_car_option_value",
DROP COLUMN "id_car_type",
DROP COLUMN "is_base",
ADD COLUMN     "carEquipmentId" INTEGER NOT NULL,
ADD COLUMN     "carOptionId" INTEGER NOT NULL,
ADD COLUMN     "carTypeId" SMALLINT NOT NULL,
ADD COLUMN     "dateCreate" BIGINT NOT NULL,
ADD COLUMN     "dateUpdate" BIGINT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "isBase" SMALLINT NOT NULL,
ADD CONSTRAINT "CarOptionValue_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CarSerie" DROP CONSTRAINT "CarSerie_pkey",
DROP COLUMN "date_create",
DROP COLUMN "date_update",
DROP COLUMN "id_car_generation",
DROP COLUMN "id_car_model",
DROP COLUMN "id_car_serie",
DROP COLUMN "id_car_type",
ADD COLUMN     "carGenerationId" INTEGER NOT NULL,
ADD COLUMN     "carModelId" INTEGER NOT NULL,
ADD COLUMN     "carTypeId" SMALLINT NOT NULL,
ADD COLUMN     "dateCreate" BIGINT NOT NULL,
ADD COLUMN     "dateUpdate" VARCHAR(10),
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(40),
ADD CONSTRAINT "CarSerie_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CarSpecification" DROP CONSTRAINT "CarSpecification_pkey",
DROP COLUMN "date_create",
DROP COLUMN "date_update",
DROP COLUMN "id_car_specification",
DROP COLUMN "id_car_type",
DROP COLUMN "id_parent",
ADD COLUMN     "carTypeId" SMALLINT NOT NULL,
ADD COLUMN     "dateCreate" BIGINT NOT NULL,
ADD COLUMN     "dateUpdate" VARCHAR(10),
ADD COLUMN     "id" SMALLSERIAL NOT NULL,
ADD COLUMN     "parentId" VARCHAR(2),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(43),
ADD CONSTRAINT "CarSpecification_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CarSpecificationValue" DROP CONSTRAINT "CarSpecificationValue_pkey",
DROP COLUMN "date_create",
DROP COLUMN "date_update",
DROP COLUMN "id_car_specification",
DROP COLUMN "id_car_specification_value",
DROP COLUMN "id_car_trim",
DROP COLUMN "id_car_type",
ADD COLUMN     "carSpecificationId" SMALLINT NOT NULL,
ADD COLUMN     "carTrimId" INTEGER NOT NULL,
ADD COLUMN     "carTypeId" SMALLINT NOT NULL,
ADD COLUMN     "dateCreate" BIGINT NOT NULL,
ADD COLUMN     "dateUpdate" VARCHAR(10),
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "value" SET DATA TYPE VARCHAR(72),
ALTER COLUMN "unit" SET DATA TYPE VARCHAR(6),
ADD CONSTRAINT "CarSpecificationValue_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CarTrim" DROP CONSTRAINT "CarTrim_pkey",
DROP COLUMN "date_create",
DROP COLUMN "date_update",
DROP COLUMN "end_production_year",
DROP COLUMN "id_car_model",
DROP COLUMN "id_car_serie",
DROP COLUMN "id_car_trim",
DROP COLUMN "id_car_type",
DROP COLUMN "start_production_year",
ADD COLUMN     "carModelId" INTEGER NOT NULL,
ADD COLUMN     "carSerieId" INTEGER NOT NULL,
ADD COLUMN     "carTypeId" SMALLINT NOT NULL,
ADD COLUMN     "dateCreate" BIGINT NOT NULL,
ADD COLUMN     "dateUpdate" VARCHAR(10),
ADD COLUMN     "endProductionYear" VARCHAR(4),
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "startProductionYear" VARCHAR(4),
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(35),
ADD CONSTRAINT "CarTrim_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CarType" DROP CONSTRAINT "CarType_pkey",
DROP COLUMN "id_car_type",
ADD COLUMN     "id" SMALLSERIAL NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(3),
ADD CONSTRAINT "CarType_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "CarGeneration" (
    "id" SERIAL NOT NULL,
    "carModelId" INTEGER NOT NULL,
    "name" VARCHAR(26),
    "yearBegin" VARCHAR(4),
    "yearEnd" VARCHAR(4),
    "dateCreate" BIGINT NOT NULL,
    "dateUpdate" VARCHAR(10),
    "carTypeId" SMALLINT NOT NULL,

    CONSTRAINT "CarGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarMake" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(8),
    "dateCreate" BIGINT NOT NULL,
    "dateUpdate" BIGINT NOT NULL,
    "carTypeId" SMALLINT NOT NULL,

    CONSTRAINT "CarMake_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarEquipment" ADD CONSTRAINT "CarEquipment_carTrimId_fkey" FOREIGN KEY ("carTrimId") REFERENCES "CarTrim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarEquipment" ADD CONSTRAINT "CarEquipment_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarGeneration" ADD CONSTRAINT "CarGeneration_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarGeneration" ADD CONSTRAINT "CarGeneration_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarMake" ADD CONSTRAINT "CarMake_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarModel" ADD CONSTRAINT "CarModel_carMakeId_fkey" FOREIGN KEY ("carMakeId") REFERENCES "CarMake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarModel" ADD CONSTRAINT "CarModel_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOption" ADD CONSTRAINT "CarOption_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CarOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOption" ADD CONSTRAINT "CarOption_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOptionValue" ADD CONSTRAINT "CarOptionValue_carOptionId_fkey" FOREIGN KEY ("carOptionId") REFERENCES "CarOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOptionValue" ADD CONSTRAINT "CarOptionValue_carEquipmentId_fkey" FOREIGN KEY ("carEquipmentId") REFERENCES "CarEquipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOptionValue" ADD CONSTRAINT "CarOptionValue_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSerie" ADD CONSTRAINT "CarSerie_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSerie" ADD CONSTRAINT "CarSerie_carGenerationId_fkey" FOREIGN KEY ("carGenerationId") REFERENCES "CarGeneration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSerie" ADD CONSTRAINT "CarSerie_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecification" ADD CONSTRAINT "CarSpecification_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecificationValue" ADD CONSTRAINT "CarSpecificationValue_carTrimId_fkey" FOREIGN KEY ("carTrimId") REFERENCES "CarTrim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecificationValue" ADD CONSTRAINT "CarSpecificationValue_carSpecificationId_fkey" FOREIGN KEY ("carSpecificationId") REFERENCES "CarSpecification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecificationValue" ADD CONSTRAINT "CarSpecificationValue_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarTrim" ADD CONSTRAINT "CarTrim_carSerieId_fkey" FOREIGN KEY ("carSerieId") REFERENCES "CarSerie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarTrim" ADD CONSTRAINT "CarTrim_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarTrim" ADD CONSTRAINT "CarTrim_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
