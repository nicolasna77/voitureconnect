/*
  Warnings:

  - Added the required column `userId` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CarType" ALTER COLUMN "id_car_type" DROP DEFAULT;
DROP SEQUENCE "CarType_id_car_type_seq";

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
