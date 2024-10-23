/*
  Warnings:

  - A unique constraint covering the columns `[id_car_equipment]` on the table `CarEquipment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CarEquipment_id_car_equipment_key" ON "CarEquipment"("id_car_equipment");
