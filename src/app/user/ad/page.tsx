"use client";
import LoaderComponant from "@/components/component/loader";
import ProductCard from "@/components/component/product-card";
import { Ad, Car } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

type AdWithCar = Ad & {
  car: Car;
};

const AdPage = () => {
  const { data: session } = useSession();
  const { data: ads, isLoading } = useQuery({
    queryKey: ["ads", session?.user?.id],
    queryFn: async () => {
      const res = await axios.get(`/api/user/ad?idUser=${session?.user?.id}`);
      return res.data;
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mes annonces</h1>

      {ads == 0 && (
        <div className="w-full text-center py-32 ">
          Vous n&apos;avez pas d&apos;annonce
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 w-full lg:grid-cols-3  gap-4">
        {isLoading ? (
          <LoaderComponant />
        ) : (
          ads &&
          ads.map((ad: AdWithCar) => (
            <ProductCard key={ad.id} item={ad} favorite={false} me={true} />
          ))
        )}
      </div>
    </div>
  );
};

export default AdPage;
