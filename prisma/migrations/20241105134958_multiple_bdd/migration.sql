/*
  Warnings:

  - You are about to drop the column `carTrimId` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `carOptionId` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `carOptionValueId` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `carSpecificationId` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `carSpecificationValueId` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `carId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Transaction` table. All the data in the column will be lost.
  - The primary key for the `VerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `CarEquipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarGeneration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarMake` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarOptionValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarSerie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarSpecification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarSpecificationValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarTrim` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarType` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,adId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[offerId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier,token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Made the column `carEquipmentId` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `carGenerationId` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `carSerieId` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offerId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "dataCarEN";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "dataCarFR";

-- DropForeignKey
ALTER TABLE "base"."Ad" DROP CONSTRAINT "Ad_carTrimId_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carEquipmentId_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carGenerationId_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carMakeId_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carModelId_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carOptionId_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carOptionValueId_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carSerieId_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carSpecificationId_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carSpecificationValueId_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carTrimId_fkey";

-- DropForeignKey
ALTER TABLE "base"."Car" DROP CONSTRAINT "Car_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarEquipment" DROP CONSTRAINT "CarEquipment_id_car_trim_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarEquipment" DROP CONSTRAINT "CarEquipment_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarGeneration" DROP CONSTRAINT "CarGeneration_id_car_model_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarGeneration" DROP CONSTRAINT "CarGeneration_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarMake" DROP CONSTRAINT "CarMake_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarModel" DROP CONSTRAINT "CarModel_id_car_make_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarModel" DROP CONSTRAINT "CarModel_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarOption" DROP CONSTRAINT "CarOption_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarOptionValue" DROP CONSTRAINT "CarOptionValue_id_car_equipment_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarOptionValue" DROP CONSTRAINT "CarOptionValue_id_car_option_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarOptionValue" DROP CONSTRAINT "CarOptionValue_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarSerie" DROP CONSTRAINT "CarSerie_id_car_generation_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarSerie" DROP CONSTRAINT "CarSerie_id_car_model_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarSerie" DROP CONSTRAINT "CarSerie_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarSpecification" DROP CONSTRAINT "CarSpecification_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarSpecificationValue" DROP CONSTRAINT "CarSpecificationValue_id_car_specification_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarSpecificationValue" DROP CONSTRAINT "CarSpecificationValue_id_car_trim_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarSpecificationValue" DROP CONSTRAINT "CarSpecificationValue_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarTrim" DROP CONSTRAINT "CarTrim_id_car_model_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarTrim" DROP CONSTRAINT "CarTrim_id_car_serie_fkey";

-- DropForeignKey
ALTER TABLE "base"."CarTrim" DROP CONSTRAINT "CarTrim_id_car_type_fkey";

-- AlterTable
ALTER TABLE "base"."Ad" DROP COLUMN "carTrimId";

-- AlterTable
ALTER TABLE "base"."Car" DROP COLUMN "carOptionId",
DROP COLUMN "carOptionValueId",
DROP COLUMN "carSpecificationId",
DROP COLUMN "carSpecificationValueId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "pictureId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "carEquipmentId" SET NOT NULL,
ALTER COLUMN "carGenerationId" SET NOT NULL,
ALTER COLUMN "carSerieId" SET NOT NULL;

-- AlterTable
ALTER TABLE "base"."Like" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "base"."Transaction" DROP COLUMN "carId",
DROP COLUMN "price",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "offerId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "base"."User" ADD COLUMN     "picture" TEXT NOT NULL DEFAULT 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png';

-- AlterTable
ALTER TABLE "base"."VerificationToken" DROP CONSTRAINT "VerificationToken_pkey";

-- DropTable
DROP TABLE "base"."CarEquipment";

-- DropTable
DROP TABLE "base"."CarGeneration";

-- DropTable
DROP TABLE "base"."CarMake";

-- DropTable
DROP TABLE "base"."CarModel";

-- DropTable
DROP TABLE "base"."CarOption";

-- DropTable
DROP TABLE "base"."CarOptionValue";

-- DropTable
DROP TABLE "base"."CarSerie";

-- DropTable
DROP TABLE "base"."CarSpecification";

-- DropTable
DROP TABLE "base"."CarSpecificationValue";

-- DropTable
DROP TABLE "base"."CarTrim";

-- DropTable
DROP TABLE "base"."CarType";

-- CreateTable
CREATE TABLE "base"."Picture" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "isShown" BOOLEAN NOT NULL DEFAULT true,
    "carId" TEXT NOT NULL,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dataCarFR"."car_type" (
    "id_car_type" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',

    CONSTRAINT "car_type_pkey" PRIMARY KEY ("id_car_type")
);

-- CreateTable
CREATE TABLE "dataCarFR"."car_make" (
    "id_car_make" SERIAL NOT NULL,
    "id_car_type" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',

    CONSTRAINT "car_make_pkey" PRIMARY KEY ("id_car_make")
);

-- CreateTable
CREATE TABLE "dataCarFR"."car_model" (
    "id_car_model" SERIAL NOT NULL,
    "id_car_make" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',
    "id_car_type" INTEGER NOT NULL,

    CONSTRAINT "car_model_pkey" PRIMARY KEY ("id_car_model")
);

-- CreateTable
CREATE TABLE "dataCarFR"."car_generation" (
    "id_car_generation" SERIAL NOT NULL,
    "id_car_model" INTEGER NOT NULL,
    "id_car_type" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "year_begin" TEXT DEFAULT 'NULL',
    "year_end" TEXT DEFAULT 'NULL',
    "date_update" TEXT DEFAULT 'NULL',
    "date_create" INTEGER NOT NULL,

    CONSTRAINT "car_generation_pkey" PRIMARY KEY ("id_car_generation")
);

-- CreateTable
CREATE TABLE "dataCarFR"."car_serie" (
    "id_car_serie" SERIAL NOT NULL,
    "id_car_model" INTEGER NOT NULL,
    "id_car_generation" INTEGER,
    "id_car_type" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',

    CONSTRAINT "car_serie_pkey" PRIMARY KEY ("id_car_serie")
);

-- CreateTable
CREATE TABLE "dataCarFR"."car_trim" (
    "id_car_trim" SERIAL NOT NULL,
    "id_car_serie" INTEGER,
    "id_car_model" INTEGER NOT NULL,
    "id_car_type" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "start_production_year" TEXT DEFAULT 'NULL',
    "end_production_year" TEXT DEFAULT 'NULL',
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',

    CONSTRAINT "car_trim_pkey" PRIMARY KEY ("id_car_trim")
);

-- CreateTable
CREATE TABLE "dataCarFR"."car_equipment" (
    "id_car_equipment" SERIAL NOT NULL,
    "id_car_trim" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER,
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',
    "id_car_type" INTEGER NOT NULL,

    CONSTRAINT "car_equipment_pkey" PRIMARY KEY ("id_car_equipment")
);

-- CreateTable
CREATE TABLE "dataCarFR"."car_specification" (
    "id_car_specification" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "id_parent" TEXT DEFAULT 'NULL',
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',
    "id_car_type" INTEGER NOT NULL,

    CONSTRAINT "car_specification_pkey" PRIMARY KEY ("id_car_specification")
);

-- CreateTable
CREATE TABLE "dataCarFR"."car_specification_value" (
    "id_car_specification_value" SERIAL NOT NULL,
    "id_car_specification" INTEGER NOT NULL,
    "id_car_trim" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT DEFAULT 'NULL',
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',
    "id_car_type" INTEGER NOT NULL,

    CONSTRAINT "car_specification_value_pkey" PRIMARY KEY ("id_car_specification_value")
);

-- CreateTable
CREATE TABLE "dataCarFR"."car_option" (
    "id_car_option" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "id_parent" TEXT DEFAULT 'NULL',
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',
    "id_car_type" INTEGER NOT NULL,

    CONSTRAINT "car_option_pkey" PRIMARY KEY ("id_car_option")
);

-- CreateTable
CREATE TABLE "dataCarFR"."car_option_value" (
    "id_car_option_value" SERIAL NOT NULL,
    "id_car_option" INTEGER NOT NULL,
    "id_car_equipment" INTEGER NOT NULL,
    "is_base" TEXT DEFAULT 'NULL',
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',
    "id_car_type" INTEGER NOT NULL,

    CONSTRAINT "car_option_value_pkey" PRIMARY KEY ("id_car_option_value")
);

-- CreateTable
CREATE TABLE "dataCarEN"."car_type" (
    "id_car_type" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',

    CONSTRAINT "car_type_pkey" PRIMARY KEY ("id_car_type")
);

-- CreateTable
CREATE TABLE "dataCarEN"."car_make" (
    "id_car_make" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',
    "id_car_type" INTEGER NOT NULL,

    CONSTRAINT "car_make_pkey" PRIMARY KEY ("id_car_make")
);

-- CreateTable
CREATE TABLE "dataCarEN"."car_model" (
    "id_car_model" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',
    "id_car_make" INTEGER NOT NULL,
    "id_car_type" INTEGER NOT NULL,

    CONSTRAINT "car_model_pkey" PRIMARY KEY ("id_car_model")
);

-- CreateTable
CREATE TABLE "dataCarEN"."car_generation" (
    "id_car_generation" SERIAL NOT NULL,
    "id_car_model" INTEGER NOT NULL,
    "id_car_type" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "year_begin" TEXT DEFAULT 'NULL',
    "year_end" TEXT DEFAULT 'NULL',
    "date_update" TEXT DEFAULT 'NULL',
    "date_create" INTEGER NOT NULL,

    CONSTRAINT "car_generation_pkey" PRIMARY KEY ("id_car_generation")
);

-- CreateTable
CREATE TABLE "dataCarEN"."car_serie" (
    "id_car_serie" SERIAL NOT NULL,
    "id_car_model" INTEGER NOT NULL,
    "id_car_generation" INTEGER,
    "id_car_type" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',

    CONSTRAINT "car_serie_pkey" PRIMARY KEY ("id_car_serie")
);

-- CreateTable
CREATE TABLE "dataCarEN"."car_trim" (
    "id_car_trim" SERIAL NOT NULL,
    "id_car_serie" INTEGER,
    "id_car_model" INTEGER NOT NULL,
    "id_car_type" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "start_production_year" TEXT DEFAULT 'NULL',
    "end_production_year" TEXT DEFAULT 'NULL',
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',

    CONSTRAINT "car_trim_pkey" PRIMARY KEY ("id_car_trim")
);

-- CreateTable
CREATE TABLE "dataCarEN"."car_equipment" (
    "id_car_equipment" SERIAL NOT NULL,
    "id_car_trim" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER,
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',
    "id_car_type" INTEGER NOT NULL,

    CONSTRAINT "car_equipment_pkey" PRIMARY KEY ("id_car_equipment")
);

-- CreateTable
CREATE TABLE "dataCarEN"."car_specification" (
    "id_car_specification" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "id_parent" TEXT DEFAULT 'NULL',
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',
    "id_car_type" INTEGER NOT NULL,

    CONSTRAINT "car_specification_pkey" PRIMARY KEY ("id_car_specification")
);

-- CreateTable
CREATE TABLE "dataCarEN"."car_specification_value" (
    "id_car_specification_value" SERIAL NOT NULL,
    "id_car_specification" INTEGER NOT NULL,
    "id_car_trim" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT DEFAULT 'NULL',
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',
    "id_car_type" INTEGER NOT NULL,

    CONSTRAINT "car_specification_value_pkey" PRIMARY KEY ("id_car_specification_value")
);

-- CreateTable
CREATE TABLE "dataCarEN"."car_option" (
    "id_car_option" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "id_parent" TEXT DEFAULT 'NULL',
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',
    "id_car_type" INTEGER NOT NULL,

    CONSTRAINT "car_option_pkey" PRIMARY KEY ("id_car_option")
);

-- CreateTable
CREATE TABLE "dataCarEN"."car_option_value" (
    "id_car_option_value" SERIAL NOT NULL,
    "id_car_option" INTEGER NOT NULL,
    "id_car_equipment" INTEGER NOT NULL,
    "is_base" TEXT DEFAULT 'NULL',
    "date_create" INTEGER NOT NULL,
    "date_update" TEXT DEFAULT 'NULL',
    "id_car_type" INTEGER NOT NULL,

    CONSTRAINT "car_option_value_pkey" PRIMARY KEY ("id_car_option_value")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_adId_key" ON "base"."Like"("userId", "adId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_offerId_key" ON "base"."Transaction"("offerId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "base"."VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "base"."Transaction" ADD CONSTRAINT "Transaction_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "base"."Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "dataCarFR"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carMakeId_fkey" FOREIGN KEY ("carMakeId") REFERENCES "dataCarFR"."car_make"("id_car_make") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "dataCarFR"."car_model"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carGenerationId_fkey" FOREIGN KEY ("carGenerationId") REFERENCES "dataCarFR"."car_generation"("id_car_generation") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carSerieId_fkey" FOREIGN KEY ("carSerieId") REFERENCES "dataCarFR"."car_serie"("id_car_serie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carTrimId_fkey" FOREIGN KEY ("carTrimId") REFERENCES "dataCarFR"."car_trim"("id_car_trim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Car" ADD CONSTRAINT "Car_carEquipmentId_fkey" FOREIGN KEY ("carEquipmentId") REFERENCES "dataCarFR"."car_equipment"("id_car_equipment") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Picture" ADD CONSTRAINT "Picture_carId_fkey" FOREIGN KEY ("carId") REFERENCES "base"."Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_make" ADD CONSTRAINT "car_make_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarFR"."car_type"("id_car_type") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_model" ADD CONSTRAINT "car_model_id_car_make_fkey" FOREIGN KEY ("id_car_make") REFERENCES "dataCarFR"."car_make"("id_car_make") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_model" ADD CONSTRAINT "car_model_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarFR"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_generation" ADD CONSTRAINT "car_generation_id_car_model_fkey" FOREIGN KEY ("id_car_model") REFERENCES "dataCarFR"."car_model"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_generation" ADD CONSTRAINT "car_generation_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarFR"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_serie" ADD CONSTRAINT "car_serie_id_car_model_fkey" FOREIGN KEY ("id_car_model") REFERENCES "dataCarFR"."car_model"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_serie" ADD CONSTRAINT "car_serie_id_car_generation_fkey" FOREIGN KEY ("id_car_generation") REFERENCES "dataCarFR"."car_generation"("id_car_generation") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_serie" ADD CONSTRAINT "car_serie_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarFR"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_trim" ADD CONSTRAINT "car_trim_id_car_model_fkey" FOREIGN KEY ("id_car_model") REFERENCES "dataCarFR"."car_model"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_trim" ADD CONSTRAINT "car_trim_id_car_serie_fkey" FOREIGN KEY ("id_car_serie") REFERENCES "dataCarFR"."car_serie"("id_car_serie") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_trim" ADD CONSTRAINT "car_trim_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarFR"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_equipment" ADD CONSTRAINT "car_equipment_id_car_trim_fkey" FOREIGN KEY ("id_car_trim") REFERENCES "dataCarFR"."car_trim"("id_car_trim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_equipment" ADD CONSTRAINT "car_equipment_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarFR"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_specification" ADD CONSTRAINT "car_specification_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarFR"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_specification_value" ADD CONSTRAINT "car_specification_value_id_car_specification_fkey" FOREIGN KEY ("id_car_specification") REFERENCES "dataCarFR"."car_specification"("id_car_specification") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_specification_value" ADD CONSTRAINT "car_specification_value_id_car_trim_fkey" FOREIGN KEY ("id_car_trim") REFERENCES "dataCarFR"."car_trim"("id_car_trim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_specification_value" ADD CONSTRAINT "car_specification_value_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarFR"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_option" ADD CONSTRAINT "car_option_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarFR"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_option_value" ADD CONSTRAINT "car_option_value_id_car_option_fkey" FOREIGN KEY ("id_car_option") REFERENCES "dataCarFR"."car_option"("id_car_option") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_option_value" ADD CONSTRAINT "car_option_value_id_car_equipment_fkey" FOREIGN KEY ("id_car_equipment") REFERENCES "dataCarFR"."car_equipment"("id_car_equipment") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarFR"."car_option_value" ADD CONSTRAINT "car_option_value_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarFR"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_make" ADD CONSTRAINT "car_make_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarEN"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_model" ADD CONSTRAINT "car_model_id_car_make_fkey" FOREIGN KEY ("id_car_make") REFERENCES "dataCarEN"."car_make"("id_car_make") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_model" ADD CONSTRAINT "car_model_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarEN"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_generation" ADD CONSTRAINT "car_generation_id_car_model_fkey" FOREIGN KEY ("id_car_model") REFERENCES "dataCarEN"."car_model"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_generation" ADD CONSTRAINT "car_generation_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarEN"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_serie" ADD CONSTRAINT "car_serie_id_car_model_fkey" FOREIGN KEY ("id_car_model") REFERENCES "dataCarEN"."car_model"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_serie" ADD CONSTRAINT "car_serie_id_car_generation_fkey" FOREIGN KEY ("id_car_generation") REFERENCES "dataCarEN"."car_generation"("id_car_generation") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_serie" ADD CONSTRAINT "car_serie_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarEN"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_trim" ADD CONSTRAINT "car_trim_id_car_model_fkey" FOREIGN KEY ("id_car_model") REFERENCES "dataCarEN"."car_model"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_trim" ADD CONSTRAINT "car_trim_id_car_serie_fkey" FOREIGN KEY ("id_car_serie") REFERENCES "dataCarEN"."car_serie"("id_car_serie") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_trim" ADD CONSTRAINT "car_trim_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarEN"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_equipment" ADD CONSTRAINT "car_equipment_id_car_trim_fkey" FOREIGN KEY ("id_car_trim") REFERENCES "dataCarEN"."car_trim"("id_car_trim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_equipment" ADD CONSTRAINT "car_equipment_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarEN"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_specification" ADD CONSTRAINT "car_specification_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarEN"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_specification_value" ADD CONSTRAINT "car_specification_value_id_car_specification_fkey" FOREIGN KEY ("id_car_specification") REFERENCES "dataCarEN"."car_specification"("id_car_specification") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_specification_value" ADD CONSTRAINT "car_specification_value_id_car_trim_fkey" FOREIGN KEY ("id_car_trim") REFERENCES "dataCarEN"."car_trim"("id_car_trim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_specification_value" ADD CONSTRAINT "car_specification_value_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarEN"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_option" ADD CONSTRAINT "car_option_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarEN"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_option_value" ADD CONSTRAINT "car_option_value_id_car_option_fkey" FOREIGN KEY ("id_car_option") REFERENCES "dataCarEN"."car_option"("id_car_option") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_option_value" ADD CONSTRAINT "car_option_value_id_car_equipment_fkey" FOREIGN KEY ("id_car_equipment") REFERENCES "dataCarEN"."car_equipment"("id_car_equipment") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataCarEN"."car_option_value" ADD CONSTRAINT "car_option_value_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "dataCarEN"."car_type"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;
