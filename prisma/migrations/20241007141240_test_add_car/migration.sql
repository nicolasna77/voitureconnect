/*
  Warnings:

  - You are about to drop the column `description` on the `CarEquipment` table. All the data in the column will be lost.
  - You are about to drop the column `equipment_name` on the `CarEquipment` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `CarTrim` table. All the data in the column will be lost.
  - You are about to drop the `CarGeneration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarMake` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CarModelToCarTrim` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `date_update` on table `CarModel` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `end_production_year` to the `CarTrim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_car_model` to the `CarTrim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `CarTrim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_production_year` to the `CarTrim` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CarEquipment" DROP CONSTRAINT "CarEquipment_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "CarGeneration" DROP CONSTRAINT "CarGeneration_id_car_model_fkey";

-- DropForeignKey
ALTER TABLE "CarGeneration" DROP CONSTRAINT "CarGeneration_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "CarMake" DROP CONSTRAINT "CarMake_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "CarModel" DROP CONSTRAINT "CarModel_id_car_make_fkey";

-- DropForeignKey
ALTER TABLE "CarOption" DROP CONSTRAINT "CarOption_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "CarOptionValue" DROP CONSTRAINT "CarOptionValue_id_car_equipment_fkey";

-- DropForeignKey
ALTER TABLE "CarOptionValue" DROP CONSTRAINT "CarOptionValue_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "CarSerie" DROP CONSTRAINT "CarSerie_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "CarSpecification" DROP CONSTRAINT "CarSpecification_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "CarSpecificationValue" DROP CONSTRAINT "CarSpecificationValue_id_car_trim_fkey";

-- DropForeignKey
ALTER TABLE "CarSpecificationValue" DROP CONSTRAINT "CarSpecificationValue_id_car_type_fkey";

-- DropForeignKey
ALTER TABLE "_CarModelToCarTrim" DROP CONSTRAINT "_CarModelToCarTrim_A_fkey";

-- DropForeignKey
ALTER TABLE "_CarModelToCarTrim" DROP CONSTRAINT "_CarModelToCarTrim_B_fkey";

-- AlterTable
ALTER TABLE "CarEquipment" DROP COLUMN "description",
DROP COLUMN "equipment_name",
ALTER COLUMN "id_car_equipment" DROP DEFAULT;
DROP SEQUENCE "CarEquipment_id_car_equipment_seq";

-- AlterTable
ALTER TABLE "CarModel" ALTER COLUMN "id_car_model" DROP DEFAULT,
ALTER COLUMN "date_update" SET NOT NULL;
DROP SEQUENCE "CarModel_id_car_model_seq";

-- AlterTable
ALTER TABLE "CarOption" ALTER COLUMN "id_car_option" DROP DEFAULT;
DROP SEQUENCE "CarOption_id_car_option_seq";

-- AlterTable
ALTER TABLE "CarOptionValue" ADD COLUMN     "carEquipmentId_car_equipment" INTEGER,
ALTER COLUMN "id_car_option_value" DROP DEFAULT;
DROP SEQUENCE "CarOptionValue_id_car_option_value_seq";

-- AlterTable
ALTER TABLE "CarSerie" ALTER COLUMN "id_car_serie" DROP DEFAULT;
DROP SEQUENCE "CarSerie_id_car_serie_seq";

-- AlterTable
ALTER TABLE "CarSpecification" ALTER COLUMN "id_car_specification" DROP DEFAULT;
DROP SEQUENCE "CarSpecification_id_car_specification_seq";

-- AlterTable
ALTER TABLE "CarSpecificationValue" ALTER COLUMN "id_car_specification_value" DROP DEFAULT;
DROP SEQUENCE "CarSpecificationValue_id_car_specification_value_seq";

-- AlterTable
ALTER TABLE "CarTrim" DROP COLUMN "year",
ADD COLUMN     "end_production_year" INTEGER NOT NULL,
ADD COLUMN     "id_car_model" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "start_production_year" INTEGER NOT NULL,
ALTER COLUMN "id_car_trim" DROP DEFAULT;
DROP SEQUENCE "CarTrim_id_car_trim_seq";

-- DropTable
DROP TABLE "CarGeneration";

-- DropTable
DROP TABLE "CarMake";

-- DropTable
DROP TABLE "_CarModelToCarTrim";

-- AddForeignKey
ALTER TABLE "CarOptionValue" ADD CONSTRAINT "CarOptionValue_carEquipmentId_car_equipment_fkey" FOREIGN KEY ("carEquipmentId_car_equipment") REFERENCES "CarEquipment"("id_car_equipment") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarTrim" ADD CONSTRAINT "CarTrim_id_car_model_fkey" FOREIGN KEY ("id_car_model") REFERENCES "CarModel"("id_car_model") ON DELETE RESTRICT ON UPDATE CASCADE;
