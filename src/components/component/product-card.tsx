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
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Badge } from "../ui/badge";
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AuthAlertDialog from "../auth/auth-alert-dialog";
import { AdWithCar } from "@/types/car";

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

  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  console.log(item);
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (item.isLiked) {
        const likeId = item.idLike;
        if (!likeId) {
          throw new Error("ID du like manquant");
        }
        return axios.delete(`/api/ad/like/${likeId}`);
      }
      return axios.post("/api/ad/like", {
        adId: item.id,
        userId: session?.user?.id,
      });
    },
    onSuccess: (response) => {
      if (!favorite && !item.isLiked) {
        toast({
          title: "Ajouté aux favoris",
          description: "Retrouvez vos favoris dans votre espace personnel",
        });
      } else {
        toast({
          title: "Retiré des favoris",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["annonces"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 403) {
        setShowSubscriptionDialog(true);
      } else if (error?.response?.status === 409) {
        queryClient.invalidateQueries({ queryKey: ["annonces"] });
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
      } else {
        toast({
          variant: "destructive",
          title: "Une erreur est survenue",
          description: "Impossible de modifier les favoris",
        });
      }
    },
  });

  const handleLike = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!session?.user) {
        setShowAuthDialog(true);
        return;
      }

      likeMutation.mutate();
    },
    [session, likeMutation]
  );

  const formatNumber = (num: number) =>
    Math.floor(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (
    <>
      <AuthAlertDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        type="auth"
      />

      <AuthAlertDialog
        isOpen={showSubscriptionDialog}
        onClose={() => setShowSubscriptionDialog(false)}
        type="subscription"
        title="Abonnement requis"
        description="Cette fonctionnalité nécessite un abonnement premium."
      />

      <Card
        className={`relative group overflow-hidden ${
          orientation === "list"
            ? "md:grid md:grid-cols-[300px_1fr]   md:gap-6 "
            : "flex flex-col"
        }`}
      >
        <div
          className={`relative ${
            orientation === "list"
              ? "  h-[280px] sm:h-[320px] "
              : "w-full h-[280px]"
          }`}
        >
          <Link prefetch href={item?.id ? `/search/${item.id}` : "#"}>
            <Image
              src={item.car?.pictures[0]?.url}
              alt={item.car?.pictures[0]?.alt}
              quality={100}
              fill
              className={`object-cover rounded-lg `}
            />
          </Link>

          {item.garageId && (
            <Badge variant="secondary" className="absolute top-4 left-4">
              Pro
            </Badge>
          )}
          {!favorite && !me && (
            <div className="absolute top-3 right-3">
              <div className="absolute inset-0 blur-lg bg-white/30 rounded-full" />
              <Button
                size="icon"
                variant="secondary"
                className="relative rounded-full text-red"
                onClick={handleLike}
                disabled={likeMutation.isPending}
              >
                <HeartIcon
                  size={32}
                  className={
                    item.isLiked
                      ? "text-red-500 fill-current "
                      : "text-muted-foreground"
                  }
                />
              </Button>
            </div>
          )}
        </div>

        {/* Section Contenu et Footer */}
        <div
          className={`flex flex-col ${
            orientation === "list" ? "sm:gap-4" : ""
          }`}
        >
          <Link prefetch href={item?.id ? `/search/${item.id}` : "#"}>
            <CardHeader>
              <div className="grid gap-2 grid-cols-3 items-center w-full">
                <div className="flex flex-col col-span-2">
                  <CardTitle className="font-semibold text-xl">
                    {item?.title}
                  </CardTitle>
                  <span className="flex text-sm font-normal">
                    Mise à jour :{" "}
                    {new Date(item?.updatedAt || Date.now()).toLocaleString(
                      "fr-FR",
                      {
                        dateStyle: "short",
                        timeStyle: "short",
                      }
                    )}
                  </span>
                </div>
                <div className="flex justify-end col-span-1">
                  <div className="text-lg font-bold bg-secondary rounded-lg p-2 text-secondary-foreground">
                    {formatNumber(Number(item?.car?.price || 0))}€
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className={orientation === "list" ? "w-full" : ""}>
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
                  <span className="text-muted-foreground">
                    {item.address
                      ? `${item.address.city}, ${item.address.state}`
                      : "Non spécifié"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Link>
        </div>
        {/* Footer */}
        {(me || favorite) && (
          <CardFooter
            className={`bg-gray-50 p-4 flex justify-between items-center mt-auto ${
              orientation === "list" ? "sm:px-0 sm:bg-transparent" : ""
            }`}
          >
            {me && <Button variant="outline">Modifier</Button>}
            {favorite && (
              <Button
                variant="destructive"
                className="flex items-center"
                onClick={handleLike}
                disabled={likeMutation.isPending}
              >
                <Trash className="w-5 h-5 mr-1 fill-current" />
                Retirer des favoris
              </Button>
            )}
            <Link
              prefetch
              href={`/search/${item.id}`}
              className={buttonVariants({ variant: "outline" })}
            >
              Voir l&apos;annonce
            </Link>
          </CardFooter>
        )}
      </Card>
    </>
  );
};

export default ProductCard;
