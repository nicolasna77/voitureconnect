import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductPage = () => {
  return (
    <div className=" container bg-primary-foreground ">
      <div className="  ">
        <Carousel
          className="w-full m-auto max-w-xl"
          // onMouseEnter={plugin.current.stop}
          // onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        {index + 1}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className={"m-auto py-12"}>
        {" "}
        <div className="flex justify-between items-center mb-6">
          <div className="text-3xl font-bold">Volkswagen Golf 2019</div>
          <span className="text-3xl font-bold">15 990 €</span>
        </div>
        <div className="m-auto grid grid-cols-1 max-w-2xl py-8 items-center align-middle gap-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2   gap-4">
              <div className="grid gap-2">
                <span className="text-sm font-medium">Modèle</span>
                <span>Volkswagen Golf</span>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Année</span>
                <span>2019</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <span className="text-sm font-medium">Kilométrage</span>
                <span>78 000 km</span>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Transmission</span>
                <span>Manuelle</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <span className="text-sm font-medium">Carburant</span>
                <span>Essence</span>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Puissance</span>
                <span>110 ch</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <span className="text-sm font-medium">Équipements</span>
              <ul className="list-disc pl-4">
                <li>Climatisation automatique</li>
                <li>Système de navigation GPS</li>
                <li>Jantes alliage 17"</li>
                <li>Phares LED</li>
                <li>Régulateur de vitesse</li>
              </ul>
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium">État général</span>
              <p>
                Le véhicule est en excellent état, entretenu régulièrement avec
                un historique d'entretien complet. La carrosserie est en très
                bon état et l'intérieur est bien préservé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
