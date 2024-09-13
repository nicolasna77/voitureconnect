import { Key } from "react";
import { Badge } from "../ui/badge";
import CarouselDetail from "./carouselDetail";
import { Car } from "@prisma/client";

const CarDetails = ({ item }: any) => {
  return (
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
          {item.cars.map((car: Car, index: Key) => (
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
  );
};

export default CarDetails;
