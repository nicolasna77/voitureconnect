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
          <>
            <div className="lg:grid-cols-3 grid-cols-1 grid items-center mb-6">
              <div className="col-span-2">
                <CarouselDetail />
              </div>
              <div className="">
                <div className="  items-center mb-6">
                  <div className="text-3xl font-bold py-8">{item.title}</div>
                  <div className="py-2">
                    <Badge variant={"outline"} className="text-sm">
                      {item.Kms} km
                    </Badge>
                  </div>
                  <div className="text-3xl border-t-2 py-4 text-primary font-bold">
                    {item.price} €
                  </div>
                </div>
                {item.cars.map((car, index) => (
                  <div
                    key={index}
                    className="m-auto bg-secondary rounded-lg text-left px-12 grid grid-cols-1 max-w-2xl py-8 items-center align-middle gap-6"
                  >
                    <div className="grid grid-cols-1    gap-4">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-sm font-medium">Modèle:</span>
                        <span>{car.model}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-sm font-medium">Année</span>
                        <span>{car.yearStart}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium">Kilométrage :</span>
                      <span>78 000 km</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium">Transmission:</span>
                      <span>Manuelle</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium">Carburant:</span>
                      <span>Essence</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium">Puissance:</span>
                      <span>110 ch</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <span className="text-sm font-medium">Équipements</span>
                  <ul className="list-disc pl-4">
                    <li>Climatisation automatique</li>
                    <li>Système de navigation GPS</li>
                    <li>Jantes alliage 17pouces</li>
                    <li>Phares LED</li>
                    <li>Régulateur de vitesse</li>
                  </ul>
                </div>
                <div className="grid gap-2">
                  <span className="text-sm font-medium">État général</span>
                  <p>
                    {
                      " Le véhicule est en excellent état, entretenu régulièrement avec un historique d'entretien complet. La carrosserie est en très bon état et l'intérieur est bien préservé."
                    }
                  </p>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};
export default ProductPage;
