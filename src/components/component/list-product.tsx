"use client";

import ProductCard from "./product-card";
import { Ad, Car } from "@prisma/client";
import LoaderComponant from "./loader";

type AdWithCar = Ad & {
  car: Car;
  isLiked: boolean;
  idLike: string | null;
};

const ListProduct = ({
  data,
  isPending,
  isError,
  error,
  orientation,
}: {
  data: AdWithCar[] | undefined;
  isPending: boolean;
  orientation: "grid" | "list";
  isError: boolean;
  error: any;
}) => {
  return (
    <section className="w-full ">
      {isPending ? (
        <div className="text-center w-full py-32">
          <LoaderComponant />
        </div>
      ) : isError ? (
        <div className="text-center w-full py-32">Erreur: {error.message}</div>
      ) : !data || data.length === 0 ? (
        <div className="text-center w-full py-32">Aucun résultat trouvé</div>
      ) : (
        <div
          className={`grid w-full gap-4 ${
            orientation === "grid"
              ? "  sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
              : "grid-cols-1 max-w-4xl m-auto"
          } `}
        >
          {data.map((item) => (
            <ProductCard
              key={item.id}
              orientation={orientation}
              item={item}
              favorite={false}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ListProduct;
