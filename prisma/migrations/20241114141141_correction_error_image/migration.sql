-- DropForeignKey
ALTER TABLE "base"."Picture" DROP CONSTRAINT "Picture_carId_fkey";

-- AlterTable
ALTER TABLE "base"."Picture" ALTER COLUMN "carId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "base"."Picture" ADD CONSTRAINT "Picture_carId_fkey" FOREIGN KEY ("carId") REFERENCES "base"."Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;
