import { FunctionComponent } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Like } from "@prisma/client";
import ProductCard from "../component/product-card";
import LoaderComponant from "../component/loader";
import { AdWithCar } from "@/types/car";

interface ListFavoriteProps {}

const ListFavorite: FunctionComponent<ListFavoriteProps> = () => {
  const { data: session } = useSession();

  const {
    data: likesData,
    isLoading,
    error,
  } = useQuery<{ success: boolean; data: (Like & { ad: AdWithCar })[] }>({
    queryKey: ["favorites", session?.user?.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/ad/like?userId=${session?.user?.id}`
      );
      return response.data;
    },
    enabled: !!session?.user?.id,
  });

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        Une erreur est survenue : {(error as Error).message}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">❤️ Mes Annonces Favorites</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <LoaderComponant />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likesData?.data && likesData.data.length > 0 ? (
            likesData.data.map((favorite: Like & { ad: AdWithCar }) => (
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

export default ListFavorite;
