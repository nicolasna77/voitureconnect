import CarDetails from "@/components/component/car-details";
import Image from "next/image";
import React from "react";

const PagePostProduct = () => {
  const item = {
    id: "1",
    carId: "1",
    cars: [
      {
        id: "1",
        model: "Tesla Model S",
        yearStart: 2023,
        yearEnd: 2024,
        Kms: 15000,
        price: 79999.99,
        title: "Tesla Model S",
        description:
          "Une voiture électrique performante avec une autonomie impressionnante.",
        vin: "5YJSA1E26MF1XXXXX",
        createdAt: "2023-10-01T00:00:00.000Z",
        updatedAt: "2023-10-01T00:00:00.000Z",
        userId: "1",
        garageId: "1",
      },
    ],
    garageId: null,
    Kms: 15000,
    price: 79999.99,
    title: "Tesla Model S",
    description:
      "Une voiture électrique performante avec une autonomie impressionnante.",
    vin: "5YJSA1E26MF1XXXXX",
    createdAt: "2023-10-01T00:00:00.000Z",
    updatedAt: "2023-10-01T00:00:00.000Z",
    userId: "1",
  };

  return (
    <div className="bg-background rounded-lg  overflow-hidden">
      <div className="p-6 sm:p-8 ">
        <h1 className="text-2xl font-bold mb-4">{"Aperçu de l'annonce"}</h1>
        <div className="space-y-4">
          <CarDetails item={item} />
        </div>
      </div>
    </div>
  );
};
export default PagePostProduct;
