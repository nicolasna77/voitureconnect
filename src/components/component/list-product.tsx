"use client";

import { useQuery } from "@tanstack/react-query";
import Axios from "axios";
import ProductCard from "./product-card";
import { Ad, Car } from "@prisma/client";
import LoaderComponant from "./loader";

type AdWithCar = Ad & {
  car: Car;
};
type AdResponse = {
  data: {
    data: AdWithCar[];
  };
};
const ListProduct = () => {
  const { isPending, isError, data, error } = useQuery<AdResponse>({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await Axios.get<AdResponse>("/api/ad");
      return response.data;
    },
  });

  if (isError) {
    return <span>erreur: {error.message}</span>;
  }

  return (
    <section className="w-full py-12">
      <div className="container m-auto grid gap-6 md:gap-8 px-4 md:px-6">
        {isPending && <LoaderComponant />}
        <div
          className={`grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
        >
          {Array.isArray(data?.data) &&
            data.data.map((car: AdWithCar) => (
              <ProductCard
                key={car.id}
                id={car.id}
                carId={car.carId}
                garageId={car.garageId}
                Kms={car.Kms}
                price={car.price}
                title={car.title}
                optionsID={car.optionsID}
                description={car.description}
                vin={car.vin}
                createdAt={car.createdAt}
                updatedAt={car.updatedAt}
                userId={car.userId}
              />
            ))}
        </div>
      </div>
    </section>
  );
};
export default ListProduct;
