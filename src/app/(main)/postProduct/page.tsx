import CarDetails from "@/components/component/car-details";
import Title from "@/components/title";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const PagePostProduct = () => {
  const item = {
    id: "1",
    title: "Tesla Model S",
    description:
      "Une voiture électrique performante avec une autonomie impressionnante.",
    updatedAt: "2023-10-01T00:00:00.000Z",
    User: {
      id: "1",
      name: "AlexNoah7",
    },
    car: {
      carMake: {
        id: "1",
        name: "Tesla",
      },
      carModel: {
        id: "1",
        name: "Model S",
      },
      Kms: 15000,
      price: 79999.99,
      year: 2023,
      gearbox: "Automatique",
    },
  };

  return (
    <div className="bg-background rounded-lg  overflow-hidden">
      <Card className="p-6 sm:p-8 ">
        <Title>{"Aperçu de l'annonce"}</Title>
        <div className="space-y-4">
          <CarDetails item={item} />
        </div>
      </Card>
    </div>
  );
};
export default PagePostProduct;
