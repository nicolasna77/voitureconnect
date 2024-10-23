-- AlterTable
CREATE SEQUENCE carequipment_id_car_equipment_seq;
ALTER TABLE "CarEquipment" ALTER COLUMN "id_car_equipment" SET DEFAULT nextval('carequipment_id_car_equipment_seq');
ALTER SEQUENCE carequipment_id_car_equipment_seq OWNED BY "CarEquipment"."id_car_equipment";

-- AlterTable
CREATE SEQUENCE carspecification_id_car_specification_seq;
ALTER TABLE "CarSpecification" ALTER COLUMN "id_car_specification" SET DEFAULT nextval('carspecification_id_car_specification_seq'),
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "date_create" DROP NOT NULL,
ALTER COLUMN "date_update" DROP NOT NULL;
ALTER SEQUENCE carspecification_id_car_specification_seq OWNED BY "CarSpecification"."id_car_specification";

-- AlterTable
CREATE SEQUENCE carspecificationvalue_id_car_specification_value_seq;
ALTER TABLE "CarSpecificationValue" ALTER COLUMN "id_car_specification_value" SET DEFAULT nextval('carspecificationvalue_id_car_specification_value_seq'),
ALTER COLUMN "value" DROP NOT NULL,
ALTER COLUMN "date_create" DROP NOT NULL,
ALTER COLUMN "date_update" DROP NOT NULL;
ALTER SEQUENCE carspecificationvalue_id_car_specification_value_seq OWNED BY "CarSpecificationValue"."id_car_specification_value";

-- AlterTable
CREATE SEQUENCE cartrim_id_car_trim_seq;
ALTER TABLE "CarTrim" ALTER COLUMN "id_car_trim" SET DEFAULT nextval('cartrim_id_car_trim_seq'),
ALTER COLUMN "date_create" DROP NOT NULL,
ALTER COLUMN "date_update" DROP NOT NULL,
ALTER COLUMN "end_production_year" DROP NOT NULL,
ALTER COLUMN "start_production_year" DROP NOT NULL;
ALTER SEQUENCE cartrim_id_car_trim_seq OWNED BY "CarTrim"."id_car_trim";

-- AlterTable
CREATE SEQUENCE cartype_id_car_type_seq;
ALTER TABLE "CarType" ALTER COLUMN "id_car_type" SET DEFAULT nextval('cartype_id_car_type_seq');
ALTER SEQUENCE cartype_id_car_type_seq OWNED BY "CarType"."id_car_type";

-- AddForeignKey
ALTER TABLE "CarEquipment" ADD CONSTRAINT "CarEquipment_id_car_trim_fkey" FOREIGN KEY ("id_car_trim") REFERENCES "CarTrim"("id_car_trim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarEquipment" ADD CONSTRAINT "CarEquipment_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecification" ADD CONSTRAINT "CarSpecification_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecificationValue" ADD CONSTRAINT "CarSpecificationValue_id_car_trim_fkey" FOREIGN KEY ("id_car_trim") REFERENCES "CarTrim"("id_car_trim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpecificationValue" ADD CONSTRAINT "CarSpecificationValue_id_car_type_fkey" FOREIGN KEY ("id_car_type") REFERENCES "CarType"("id_car_type") ON DELETE RESTRICT ON UPDATE CASCADE;
