-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carEquipmentId_FR_fkey" TO "Car_carEquipmentId_FR_fkey_new";

-- RenameForeignKey
ALTER TABLE "base"."Car" RENAME CONSTRAINT "Car_carTrimId_FR_fkey" TO "Car_carTrimId_FR_fkey_new";
