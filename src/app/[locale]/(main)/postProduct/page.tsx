import CarDetails from "@/components/component/car-details";
import Title from "@/components/title";
import { Card, CardContent } from "@/components/ui/card";
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
    <div>
      <Title>{"Aperçu de l'annonce"}</Title>
      <CarDetails item={item} />
    </div>
  );
};
export default PagePostProduct;
