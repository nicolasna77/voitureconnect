-- AlterTable
ALTER TABLE "base"."Garage" ADD COLUMN     "backgroundId" TEXT,
ADD COLUMN     "image" TEXT;

-- AddForeignKey
ALTER TABLE "base"."Garage" ADD CONSTRAINT "Garage_backgroundId_fkey" FOREIGN KEY ("backgroundId") REFERENCES "base"."Picture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
