/*
  Warnings:

  - Added the required column `color` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuelType` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gearbox` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Ad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "fuelType" TEXT NOT NULL,
ADD COLUMN     "gearbox" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
