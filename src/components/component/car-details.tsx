import CarouselDetail from "./carouselDetail";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import CityMap from "../cityMap";
import { Separator } from "../ui/separator";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import DynamicCityMap from "../dynamicCityMap";

const item = {
  // ... autres propriétés ...
  location: "Paris", // Ajoutez cette ligne
};
const CarDetails = ({ item }: any) => {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1fr_250px] xl:grid-cols-4  lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 xl:col-span-3 lg:gap-8">
          <div className="col-span-4">
            <CarouselDetail />
          </div>

          <Card className="overflow-hidden bg-card col-span-4  ">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5 ">
                <h3 className="group flex items-center gap-2 text-2xl">
                  {item.title}
                </h3>
                <CardDescription>
                  Mise à jour :
                  {new Date(item.updatedAt).toLocaleDateString("fr-FR")}
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center text-xl bg-secondary text-secondary-foreground p-2 rounded-lg border gap-1">
                {Math.floor(Number(item.car.price))
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                €
              </div>
            </CardHeader>
            <CardContent className="p-6 text-md">
              <div className="grid gap-3">
                <div className="font-semibold">Détails</div>
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Marque</span>
                    <span>{item.car.carMake.name}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Model</span>
                    <span>{item.car.carModel.name}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Kilométrage</span>
                    <span>
                      {item.car.Kms.toString().replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        " "
                      )}{" "}
                      km
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Année</span>
                    <span>{item.car.year}</span>
                  </li>{" "}
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Boite de vitesse
                    </span>
                    <span>{item.car.gearbox}</span>
                  </li>
                </ul>
                <Separator className="my-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card rounded-lg w-full col-span-4 gap-2 mb-4">
            <CardHeader>
              <CardTitle>Équipements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4">
                <li>Climatisation automatique</li>
              </ul>
            </CardContent>
            <Separator />
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {item.description}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card className=" bg-card border border-border">
            <Link href={`/profile/${item.User.id}`}>
              <div className="group flex items-center space-x-4 py-4 px-4  ">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{item.User.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-md group-hover:underline font-medium leading-none">
                    {item.User.name}
                  </p>
                  <p className="text-sm text-muted-foreground">3 annonces</p>
                </div>
                <Button size="icon" variant="ghost">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Link>
            <DynamicCityMap city={item.location} />

            <CardFooter className="flex flex-col  gap-4 justify-center m-auto items-center border-t bg-muted/50  py-4">
              <div className="w-full sm:w-auto">
                <Button size="lg" className="w-full">
                  Contacter le vendeur
                </Button>
              </div>
              <div className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  Envoyer un message
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CarDetails;
