"use client";

import { useQuery } from "@tanstack/react-query";
import Axios from "axios";
import ProductCard from "./product-card";
import { Ad } from "@prisma/client";
import LoaderComponant from "./loader";

const ListProduct = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => await Axios.get("/api/ad"),
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
          {Array.isArray(data?.data.cars) &&
            data.data.cars.map((car: Ad) => (
              <ProductCard key={car.id} item={car} />
            ))}
        </div>
      </div>
    </section>
  );
};
export default ListProduct;
