/*
  Warnings:

  - You are about to drop the column `year` on the `Car` table. All the data in the column will be lost.
  - Added the required column `title` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `generation` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearStart` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "year",
ADD COLUMN     "acceleration" DOUBLE PRECISION,
ADD COLUMN     "actuator" TEXT,
ADD COLUMN     "bodyType" TEXT,
ADD COLUMN     "bore" DOUBLE PRECISION,
ADD COLUMN     "cargoDims" TEXT,
ADD COLUMN     "cargoVolume" DOUBLE PRECISION,
ADD COLUMN     "combinedConsumption" DOUBLE PRECISION,
ADD COLUMN     "curbWeight" INTEGER,
ADD COLUMN     "cylinderLayout" TEXT,
ADD COLUMN     "cylinders" INTEGER,
ADD COLUMN     "displacement" INTEGER,
ADD COLUMN     "emissionStandard" TEXT,
ADD COLUMN     "engineType" TEXT,
ADD COLUMN     "forcedInduction" TEXT,
ADD COLUMN     "frontBrakes" TEXT,
ADD COLUMN     "frontLoad" INTEGER,
ADD COLUMN     "frontSuspension" TEXT,
ADD COLUMN     "frontTrack" INTEGER,
ADD COLUMN     "fuelTank" INTEGER,
ADD COLUMN     "fuelType" TEXT,
ADD COLUMN     "gears" INTEGER,
ADD COLUMN     "generation" TEXT NOT NULL,
ADD COLUMN     "grossWeight" INTEGER,
ADD COLUMN     "groundClearance" INTEGER,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "highwayConsumption" DOUBLE PRECISION,
ADD COLUMN     "horsepower" INTEGER,
ADD COLUMN     "induction" TEXT,
ADD COLUMN     "intercooler" BOOLEAN,
ADD COLUMN     "length" INTEGER,
ADD COLUMN     "loadHeight" INTEGER,
ADD COLUMN     "maxCargoVolume" INTEGER,
ADD COLUMN     "maxPowerRpm" INTEGER,
ADD COLUMN     "maxSpeed" INTEGER,
ADD COLUMN     "maxTorque" INTEGER,
ADD COLUMN     "maxTorqueRpm" INTEGER,
ADD COLUMN     "maxTowingWeight" INTEGER,
ADD COLUMN     "minCargoVolume" INTEGER,
ADD COLUMN     "payload" INTEGER,
ADD COLUMN     "range" INTEGER,
ADD COLUMN     "rearBrakes" TEXT,
ADD COLUMN     "rearLoad" INTEGER,
ADD COLUMN     "rearSuspension" TEXT,
ADD COLUMN     "rearTrack" INTEGER,
ADD COLUMN     "seats" INTEGER,
ADD COLUMN     "series" TEXT,
ADD COLUMN     "stroke" DOUBLE PRECISION,
ADD COLUMN     "transmissionType" TEXT,
ADD COLUMN     "turningDiameter" DOUBLE PRECISION,
ADD COLUMN     "urbanConsumption" DOUBLE PRECISION,
ADD COLUMN     "valvesPerCylinder" INTEGER,
ADD COLUMN     "version" TEXT,
ADD COLUMN     "wheelbase" INTEGER,
ADD COLUMN     "width" INTEGER,
ADD COLUMN     "yearEnd" INTEGER,
ADD COLUMN     "yearStart" INTEGER NOT NULL;
