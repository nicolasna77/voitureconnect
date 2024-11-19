"use client";
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
import { useLocale, useTranslations } from "next-intl";
import GarageInfo from "./garage-info";
import UserInfo from "./user-info";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoaderComponant from "./loader";

const CarDetails = ({ id }: { id: string }) => {
  const locale = useLocale();
  const t = useTranslations();
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["details", id, locale],
    queryFn: async () => {
      const response = await axios.get<any>(`/api/ad?id=${id}&lang=${locale}`);
      return response.data;
    },
  });

  if (isLoading) return <LoaderComponant />;
  if (isError) return <div>Une erreur est survenue</div>;
  if (!data) return null;

  const carDetails = data.car || {};

  // Fonction utilitaire pour accéder aux bonnes propriétés selon la langue
  const getCarProperty = (property: string) => {
    if (locale === "fr") {
      return carDetails[property]?.name || "-";
    }
    return carDetails[`${property}EN`]?.name || "-";
  };

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1fr_250px] xl:grid-cols-4 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 xl:col-span-3 lg:gap-8">
          <div className="col-span-4">
            <CarouselDetail item={data} />
          </div>

          <Card className="overflow-hidden bg-card col-span-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <h3 className="group flex items-center gap-2 text-2xl">
                  {data.title}
                </h3>
                <CardDescription>
                  {t("CardDetails.lastUpdate")}:
                  {new Date(data.updatedAt).toLocaleDateString(locale)}
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center text-xl bg-secondary text-secondary-foreground p-2 rounded-lg border gap-1">
                {Number(carDetails.price)
                  .toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                €
              </div>
            </CardHeader>
            <CardContent className="p-6 text-md">
              <div className="grid gap-6">
                {/* Informations principales */}
                <div>
                  <div className="font-semibold mb-3">
                    {t("CardDetails.details")}
                  </div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("CardDetails.brand")}
                      </span>
                      <span>{getCarProperty("carMake")}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("CardDetails.model")}
                      </span>
                      <span>{getCarProperty("carModel")}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("CardDetails.mileage")}
                      </span>
                      <span>
                        {carDetails.Kms.toString().replace(
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
                      <span>{carDetails.year}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("CardDetails.gearbox")}
                      </span>
                      <span>{carDetails.gearbox}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("CardDetails.fuelType")}
                      </span>
                      <span>{carDetails.fuelType}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("CardDetails.color")}
                      </span>
                      <span>{carDetails.color}</span>
                    </li>
                  </ul>
                </div>

                {/* Caractéristiques techniques */}
                <div>
                  <div className="font-semibold mb-3">
                    {t("CardDetails.specifications")}
                  </div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("CardDetails.generation")}
                      </span>
                      <span>{getCarProperty("carGeneration")}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("CardDetails.serie")}
                      </span>
                      <span>{getCarProperty("carSerie")}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("CardDetails.trim")}
                      </span>
                      <span>{getCarProperty("carTrim")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card rounded-lg w-full col-span-4 gap-2 mb-4">
            <Separator />
            <CardHeader>
              <CardTitle>{t("CardDetails.description")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-md text-muted-foreground">
                {data.description}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card className="w-full mx-auto">
            <CardContent>
              {data.garage ? (
                <GarageInfo garage={data.garage} />
              ) : data.User ? (
                <UserInfo item={data} />
              ) : null}

              <DynamicCityMap
                city={data.garage?.Adresse.city || data.address?.city}
              />
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
