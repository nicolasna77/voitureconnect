import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import CarouselDetail from "@/components/component/carouselDetail";
import CarDetails from "@/components/component/car-details";

const ProductPage = () => {
  const item = [
    {
      id: "1",
      carId: "1",
      cars: [
        {
          id: "1",
          model: "Model S",
          generation: "2021",
          yearStart: 2021,
          yearEnd: null,
          series: "Series 1",
          version: "Version A",
          bodyType: "Sedan",
          seats: 5,
          length: 4970,
          width: 1960,
          height: 1440,
          wheelbase: 2960,
          frontTrack: 1660,
          rearTrack: 1650,
          frontLoad: 500,
          rearLoad: 500,
          loadHeight: 700,
          cargoDims: "100x50x50",
          cargoVolume: 793.5,
          curbWeight: 2100,
          groundClearance: 140,
          maxCargoVolume: 793,
          minCargoVolume: 793,
          payload: 500,
          grossWeight: 2600,
          maxTowingWeight: 2000,
          engineType: "Electric",
          displacement: 0,
          horsepower: 1020,
          maxPowerRpm: 18000,
          maxTorque: 1050,
          induction: "Electric",
          cylinderLayout: "N/A",
          cylinders: 0,
          forcedInduction: "N/A",
          bore: 0,
          stroke: 0,
          valvesPerCylinder: 0,
          maxTorqueRpm: 0,
          intercooler: false,
          transmissionType: "Automatic",
          actuator: "Electric",
          turningDiameter: 11.4,
          gears: 1,
          fuelType: "Electric",
          maxSpeed: 322,
          urbanConsumption: 0,
          combinedConsumption: 0,
          acceleration: 2.1,
          range: 652,
          emissionStandard: "Zero Emissions",
          fuelTank: 0,
          highwayConsumption: 0,
          frontBrakes: "Disc",
          rearBrakes: "Disc",
          frontSuspension: "Independent",
          rearSuspension: "Independent",
          createdAt: "2023-10-01T00:00:00.000Z",
          updatedAt: "2023-10-01T00:00:00.000Z",
          garageId: null,
        },
      ],
      garageId: null,
      Kms: 15000,
      price: 79999.99,
      title: "Tesla Model ",
      description:
        "Une voiture électrique performante avec une autonomie impressionnante.",
      vin: "5YJSA1E26MF1XXXXX",
      createdAt: "2023-10-01T00:00:00.000Z",
      updatedAt: "2023-10-01T00:00:00.000Z",
      userId: null,
    },
  ];

  return (
    <div className=" container bg-primary-foreground ">
      <div className={"m-auto py-12"}>
        {item.map((item) => (
          <CarDetails key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
export default ProductPage;
