"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CarMakeEN, CarModelEN, Picture } from "@prisma/client";
import {
  CalendarIcon,
  Cog,
  FuelIcon,
  GaugeIcon,
  HeartIcon,
  MapPin,
  Trash,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Badge } from "../ui/badge";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

type AdWithCar = {
  id: string;
  title: string;
  updatedAt: string;
  garageId?: string | null;
  car: {
    pictures: Picture[];
    price: string | number;
    Kms: number;
    year: number;
    gearbox: string;
    fuelType: string;
    carMake: {
      id_car_make: number;
      name: string;
      date_create: number;
      date_update: string | null;
      id_car_type: number;
    } | null;
    carModel: {
      id_car_model: number;
      name: string;
      date_create: number;
      date_update: string | null;
      id_car_make: number;
      id_car_type: number;
    } | null;
  };
  isLiked?: boolean;
  idLike?: string | null;
};

const ProductCard = ({
  item,
  favorite,
  me,
  orientation = "grid",
}: {
  item: AdWithCar;
  favorite?: boolean;
  me?: boolean;
  orientation?: "grid" | "list";
}) => {
  const { toast } = useToast();

  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const method = item.isLiked || favorite ? "delete" : "post";
  const path =
    item.isLiked || favorite
      ? `/api/ad/like?userId=${session?.user?.id}&adId=${item.id}`
      : "/api/ad/like";
  const likeMutation = useMutation({
    mutationFn: () =>
      axios[method](path, {
        adId: item.id,
        userId: session?.user?.id,
      }),

    onSuccess: () => {
      if (method === "post") {
        toast({
          title: "Vous avez ajouté cet article à vos favoris",
          description:
            "Vous pouvez retrouver vos favoris dans l'espace favoris",
        });
      } else {
        toast({
          title: "Vous avez retiré cet article de vos favoris",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["annonces"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Une erreur est survenue lors de l'action sur le favori",
      });
    },
  });

  const handleLike = useCallback(() => {
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Vous devez être connecté pour ajouter aux favoris",
      });
      return;
    }
    likeMutation.mutate();
  }, [likeMutation, session?.user?.id, toast]);

  const formatNumber = (num: number) =>
    Math.floor(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (
    <Card
      key={item?.id}
      className={`relative group w-full ${
        orientation === "list" ? "sm:flex" : " "
      }`}
    >
      <Link
        href={item?.id ? `/search/${item.id}` : "#"}
        className={orientation === "list" ? "sm:w-[45%]" : "w-full"}
      >
        <div className={`h-[230px] `}>
          <Image
            src={item.car?.pictures[0]?.url}
            alt={item.car?.pictures[0]?.alt}
            width={150}
            sizes="100vw"
            height={150}
            quality={100}
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
      </Link>
      {!favorite && !me && (
        <Button
          size="icon"
          variant="ghost"
          className={`absolute ${
            orientation === "list"
              ? "top-4 right-4  sm:top-4 sm:left-1/3"
              : "top-4 right-4"
          } rounded-full text-red`}
          onClick={handleLike}
          disabled={likeMutation.isPending}
        >
          <HeartIcon
            className={
              item.isLiked
                ? "text-red-500 fill-current"
                : "text-muted-foreground"
            }
          />
        </Button>
      )}

      {item.garageId && (
        <Badge variant={"secondary"} className="absolute top-4 left-4">
          Pro
        </Badge>
      )}

      <div className={orientation === "list" ? "sm:w-2/3" : "w-full"}>
        <Link href={item?.id ? `/search/${item.id}` : "#"}>
          <CardHeader>
            <div className="grid gap-2 grid-cols-3 items-center w-full  justify-between">
              <div className="flex flex-col col-span-2 ">
                <CardTitle className="font-semibold text-xl">
                  {item?.title}
                </CardTitle>
                <span className="flex text-sm font-normal">
                  Mise à jour :{" "}
                  {new Date(item?.updatedAt || Date.now()).toLocaleString(
                    "fr-FR",
                    { dateStyle: "short", timeStyle: "short" }
                  )}
                </span>
              </div>
              <div className="flex justify-end col-span-1 w-full ">
                <div className="text-lg font-bold flex bg-secondary rounded-lg p-2 text-secondary-foreground">
                  {formatNumber(Number(item?.car?.price || 0))}€
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    Icon: GaugeIcon,
                    text: `${formatNumber(Number(item?.car?.Kms || 0))} km`,
                  },
                  { Icon: CalendarIcon, text: item?.car?.year },
                  { Icon: Cog, text: item?.car?.gearbox },
                  { Icon: FuelIcon, text: item?.car?.fuelType },
                ].map(({ Icon, text }, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center bottom-0 gap-2 mt-4">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Paris</span>
              </div>
            </div>
          </CardContent>
        </Link>
      </div>
      {me && (
        <CardFooter className="bg-gray-50 p-4 flex justify-between items-center">
          <Button variant="outline">Modifier</Button>
          <Button variant="destructive" className="flex items-center">
            <Trash className="w-5 h-5 mr-1 fill-current" />
            Supprimer
          </Button>
          <Button>Voir l&apos;annonce</Button>
        </CardFooter>
      )}
      {favorite && (
        <CardFooter className="bg-gray-50 p-4 flex justify-between items-center">
          <Button
            variant="destructive"
            className="flex items-center"
            onClick={handleLike}
            disabled={likeMutation.isPending}
          >
            <Trash className="w-5 h-5 mr-1 fill-current" />
            Retirer des favoris
          </Button>
          <Button variant={"secondary"}>Voir l&apos;annonce</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
