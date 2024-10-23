/*
  Warnings:

  - You are about to drop the `car2db_car_equipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car2db_car_generation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car2db_car_make` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car2db_car_model` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car2db_car_option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car2db_car_option_value` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car2db_car_serie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car2db_car_specification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car2db_car_specification_value` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car2db_car_trim` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car2db_car_type` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ad" DROP CONSTRAINT "Ad_carTrimId_car_trim_fkey";

-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_carTrimId_fkey";

-- DropForeignKey
ALTER TABLE "_CarModelToCarTrim" DROP CONSTRAINT "_CarModelToCarTrim_A_fkey";

-- DropForeignKey
ALTER TABLE "_CarModelToCarTrim" DROP CONSTRAINT "_CarModelToCarTrim_B_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_equipment" DROP CONSTRAINT "car2db_car_equipment_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_generation" DROP CONSTRAINT "car2db_car_generation_carModelId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_generation" DROP CONSTRAINT "car2db_car_generation_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_make" DROP CONSTRAINT "car2db_car_make_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_model" DROP CONSTRAINT "car2db_car_model_carMakeId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_model" DROP CONSTRAINT "car2db_car_model_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_option" DROP CONSTRAINT "car2db_car_option_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_option_value" DROP CONSTRAINT "car2db_car_option_value_carEquipmentId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_option_value" DROP CONSTRAINT "car2db_car_option_value_carOptionId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_option_value" DROP CONSTRAINT "car2db_car_option_value_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_serie" DROP CONSTRAINT "car2db_car_serie_carModelId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_serie" DROP CONSTRAINT "car2db_car_serie_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_specification" DROP CONSTRAINT "car2db_car_specification_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_specification_value" DROP CONSTRAINT "car2db_car_specification_value_carSpecificationId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_specification_value" DROP CONSTRAINT "car2db_car_specification_value_carTrimId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_specification_value" DROP CONSTRAINT "car2db_car_specification_value_carTypeId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_trim" DROP CONSTRAINT "car2db_car_trim_carSerieId_fkey";

-- DropForeignKey
ALTER TABLE "car2db_car_trim" DROP CONSTRAINT "car2db_car_trim_carTypeId_fkey";

-- DropTable
DROP TABLE "car2db_car_equipment";

-- DropTable
DROP TABLE "car2db_car_generation";

-- DropTable
DROP TABLE "car2db_car_make";

-- DropTable
DROP TABLE "car2db_car_model";

-- DropTable
DROP TABLE "car2db_car_option";

-- DropTable
DROP TABLE "car2db_car_option_value";

-- DropTable
DROP TABLE "car2db_car_serie";

-- DropTable
DROP TABLE "car2db_car_specification";

-- DropTable
DROP TABLE "car2db_car_specification_value";

-- DropTable
DROP TABLE "car2db_car_trim";

-- DropTable
DROP TABLE "car2db_car_type";

-- CreateTable
CREATE TABLE "CarMake" (
    "id_car_make" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date_create" INTEGER NOT NULL,
    "date_update" INTEGER NOT NULL,
    "carTypeId" INTEGER NOT NULL,

    CONSTRAINT "CarMake_pkey" PRIMARY KEY ("id_car_make")
);

-- CreateTable
CREATE TABLE "CarModel" (
    "id_car_model" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date_create" INTEGER NOT NULL,
    "date_update" INTEGER NOT NULL,
    "carMakeId" INTEGER NOT NULL,
    "carTypeId" INTEGER NOT NULL,

    CONSTRAINT "CarModel_pkey" PRIMARY KEY ("id_car_model")
);

-- CreateTable
CREATE TABLE "CarGeneration" (
    "id_car_generation" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "year_begin" TEXT NOT NULL,
    "year_end" TEXT,
    "date_create" INTEGER NOT NULL,
    "date_update" INTEGER NOT NULL,
    "carModelId" INTEGER NOT NULL,
    "carTypeId" INTEGER NOT NULL,

    CONSTRAINT "CarGeneration_pkey" PRIMARY KEY ("id_car_generation")
);

-- CreateTable
CREATE TABLE "CarOption" (
    "id_car_option" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    "date_create" INTEGER NOT NULL,
    "date_update" INTEGER NOT NULL,
    "carTypeId" INTEGER NOT NULL,

    CONSTRAINT "CarOption_pkey" PRIMARY KEY ("id_car_option")
);

-- CreateTable
CREATE TABLE "CarOptionValue" (
    "id_car_option_value" SERIAL NOT NULL,
    "carOptionId" INTEGER NOT NULL,
    "carEquipmentId" INTEGER NOT NULL,
    "is_base" BOOLEAN NOT NULL,
    "date_create" INTEGER NOT NULL,
    "date_update" INTEGER NOT NULL,
    "carTypeId" INTEGER NOT NULL,

    CONSTRAINT "CarOptionValue_pkey" PRIMARY KEY ("id_car_option_value")
);

-- CreateTable
CREATE TABLE "CarType" (
    "id_car_type" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CarType_pkey" PRIMARY KEY ("id_car_type")
);

-- CreateTable
CREATE TABLE "CarSpecification" (
    "id_car_specification" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    "date_create" INTEGER NOT NULL,
    "date_update" INTEGER NOT NULL,
    "carTypeId" INTEGER NOT NULL,

    CONSTRAINT "CarSpecification_pkey" PRIMARY KEY ("id_car_specification")
);

-- CreateTable
CREATE TABLE "CarSpecificationValue" (
    "id_car_specification_value" SERIAL NOT NULL,
    "carTrimId" INTEGER NOT NULL,
    "carSpecificationId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "date_create" INTEGER NOT NULL,
    "date_update" INTEGER NOT NULL,
    "carTypeId" INTEGER NOT NULL,

    CONSTRAINT "CarSpecificationValue_pkey" PRIMARY KEY ("id_car_specification_value")
);

-- CreateTable
CREATE TABLE "CarTrim" (
    "id_car_trim" SERIAL NOT NULL,
    "carSerieId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "date_create" INTEGER NOT NULL,
    "date_update" INTEGER NOT NULL,
    "carTypeId" INTEGER NOT NULL,

    CONSTRAINT "CarTrim_pkey" PRIMARY KEY ("id_car_trim")
);

-- CreateTable
CREATE TABLE "CarSerie" (
    "id_car_serie" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date_create" INTEGER NOT NULL,
    "date_update" INTEGER NOT NULL,
    "carModelId" INTEGER NOT NULL,
    "carTypeId" INTEGER NOT NULL,

    CONSTRAINT "CarSerie_pkey" PRIMARY KEY ("id_car_serie")
);

-- CreateTable
CREATE TABLE "CarEquipment" (
    "id_car_equipment" SERIAL NOT NULL,
    "id_car_trim" INTEGER NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "year" INTEGER,
    "date_create" INTEGER NOT NULL,
    "date_update" INTEGER NOT NULL,
    "id_car_type" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "CarEquipment_pkey" PRIMARY KEY ("id_car_equipment")
);

-- AddForeignKey
ALTER TABLE "CarMake" ADD CONSTRAINT "CarMake_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarModel" ADD CONSTRAINT "CarModel_carMakeId_fkey" FOREIGN KEY ("carMakeId") REFERENCES "CarMake"("id_car_make") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarModel" ADD CONSTRAINT "CarModel_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarGeneration" ADD CONSTRAINT "CarGeneration_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarGeneration" ADD CONSTRAINT "CarGeneration_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOption" ADD CONSTRAINT "CarOption_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOptionValue" ADD CONSTRAINT "CarOptionValue_carOptionId_fkey" FOREIGN KEY ("carOptionId") REFERENCES "CarOption"("id_car_option") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOptionValue" ADD CONSTRAINT "CarOptionValue_carEquipmentId_fkey" FOREIGN KEY ("carEquipmentId") REFERENCES "CarEquipment"("id_car_equipment") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOptionValue" ADD CONSTRAINT "CarOptionValue_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecification" ADD CONSTRAINT "CarSpecification_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecificationValue" ADD CONSTRAINT "CarSpecificationValue_carTrimId_fkey" FOREIGN KEY ("carTrimId") REFERENCES "CarTrim"("id_car_trim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecificationValue" ADD CONSTRAINT "CarSpecificationValue_carSpecificationId_fkey" FOREIGN KEY ("carSpecificationId") REFERENCES "CarSpecification"("id_car_specification") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecificationValue" ADD CONSTRAINT "CarSpecificationValue_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarTrim" ADD CONSTRAINT "CarTrim_carSerieId_fkey" FOREIGN KEY ("carSerieId") REFERENCES "CarSerie"("id_car_serie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarTrim" ADD CONSTRAINT "CarTrim_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSerie" ADD CONSTRAINT "CarSerie_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSerie" ADD CONSTRAINT "CarSerie_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarEquipment" ADD CONSTRAINT "CarEquipment_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carTrimId_fkey" FOREIGN KEY ("carTrimId") REFERENCES "CarTrim"("id_car_trim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_carTrimId_car_trim_fkey" FOREIGN KEY ("carTrimId_car_trim") REFERENCES "CarTrim"("id_car_trim") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarModelToCarTrim" ADD CONSTRAINT "_CarModelToCarTrim_A_fkey" FOREIGN KEY ("A") REFERENCES "CarModel"("id_car_model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarModelToCarTrim" ADD CONSTRAINT "_CarModelToCarTrim_B_fkey" FOREIGN KEY ("B") REFERENCES "CarTrim"("id_car_trim") ON DELETE CASCADE ON UPDATE CASCADE;
