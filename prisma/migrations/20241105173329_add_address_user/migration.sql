-- AlterTable
ALTER TABLE "base"."Ad" ADD COLUMN     "addressId" TEXT;

-- AddForeignKey
ALTER TABLE "base"."Ad" ADD CONSTRAINT "Ad_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "base"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
