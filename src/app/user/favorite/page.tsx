"use client";
import LoaderComponant from "@/components/component/loader";
import ProductCard from "@/components/component/product-card";
import { Ad, Car, Like } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

type AdWithCar = Ad & { car: Car; likes: Like[]; ad: Ad };

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
            data.map((favorite: AdWithCar) => (
              <ProductCard
                key={favorite.ad.id}
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
