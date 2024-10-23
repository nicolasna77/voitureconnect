/*
  Warnings:

  - The `dateUpdate` column on the `CarModel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `name` on table `CarModel` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CarModel" DROP CONSTRAINT "CarModel_carMakeId_fkey";

-- DropForeignKey
ALTER TABLE "CarModel" DROP CONSTRAINT "CarModel_carTypeId_fkey";

-- AlterTable
ALTER TABLE "CarModel" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "carMakeId" SET DATA TYPE INTEGER,
ALTER COLUMN "carTypeId" SET DATA TYPE INTEGER,
ALTER COLUMN "dateCreate" DROP NOT NULL,
DROP COLUMN "dateUpdate",
ADD COLUMN     "dateUpdate" BIGINT;

-- AddForeignKey
ALTER TABLE "CarModel" ADD CONSTRAINT "CarModel_carMakeId_fkey" FOREIGN KEY ("carMakeId") REFERENCES "CarMake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarModel" ADD CONSTRAINT "CarModel_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
