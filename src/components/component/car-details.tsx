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
import { Separator } from "../ui/separator";
import DynamicCityMap from "../dynamicCityMap";
import { useTranslations } from "next-intl";
import GarageInfo from "./garage-info";
import UserInfo from "./user-info";
import {
  Ad,
  Address,
  Car,
  Garage,
  CarMakeFR,
  CarModelFR,
  User,
} from "@prisma/client";

const CarDetails = ({
  item,
}: {
  item: Ad & {
    car: Car & { carMake: CarMakeFR; carModel: CarModelFR };
  } & {
    User: User;
  } & {
    garage: Garage & { Adresse: Address };
  };
}) => {
  const t = useTranslations();

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1fr_250px] xl:grid-cols-4  lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 xl:col-span-3 lg:gap-8">
          <div className="col-span-4">
            <CarouselDetail item={item} />
          </div>

          <Card className="overflow-hidden bg-card col-span-4  ">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5 ">
                <h3 className="group flex items-center gap-2 text-2xl">
                  {item.title}
                </h3>
                <CardDescription>
                  {t("CardDetails.lastUpdate")}:{" "}
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
                <div className="font-semibold">{t("CardDetails.details")}</div>
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("CardDetails.brand")}
                    </span>
                    <span>{item.car.carMake.name}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("CardDetails.model")}
                    </span>
                    <span>{item.car.carModel.name}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("CardDetails.mileage")}
                    </span>
                    <span>
                      {item.car.Kms.toString().replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        " "
                      )}{" "}
                      km
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("CardDetails.year")}
                    </span>
                    <span>{item.car.year}</span>
                  </li>{" "}
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("CardDetails.gearbox")}
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
          <Card className="w-full  mx-auto">
            <CardContent className="">
              {item.garage ? (
                <GarageInfo garage={item.garage} />
              ) : item.User ? (
                <UserInfo item={item} />
              ) : null}

              <DynamicCityMap city={item.garage?.Adresse.city || "paris"} />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center items-center border-t bg-muted/50 p-6">
              <Button size="lg" className="w-full sm:w-auto">
                {t("CardDetails.contactSeller")}
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                {t("CardDetails.sendMessage")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CarDetails;
