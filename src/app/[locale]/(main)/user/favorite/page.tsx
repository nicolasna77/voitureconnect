"use client";
import LoaderComponant from "@/components/component/loader";
import ProductCard from "@/components/component/product-card";
import { Ad, Car } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

type Like = {
  id: string;
  ad: {
    id: string;
    title: string;
    updatedAt: string;
    garageId?: string | null;
    car: {
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
      };
      carModel: {
        id_car_model: number;
        name: string;
        date_create: number;
        date_update: string | null;
        id_car_make: number;
        id_car_type: number;
      };
    };
  };
  isLiked?: boolean;
  idLike?: string | null;
};

const FavoritePage = () => {
  const { data: session } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["favorites", session?.user?.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/ad/like?userId=${session?.user?.id}`
      );
      return response.data.data;
    },
    enabled: !!session?.user?.id,
  });

  if (error)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        Une erreur est survenue : {(error as Error).message}
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 ">❤️ Mes Annonces Favorites</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <LoaderComponant />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data && data.length > 0 ? (
            data.map((favorite: Like) => (
              <ProductCard
                key={favorite.id}
                item={favorite.ad}
                favorite={true}
                me={false}
              />
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-[calc(100vh-300px)]">
              <p>Vous n&apos;avez pas d&apos;annonce favorite</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
