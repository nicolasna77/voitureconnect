-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_garageId_fkey";

-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "garageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
