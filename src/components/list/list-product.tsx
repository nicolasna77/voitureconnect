"use client";

import ProductCard from "../component/product-card";
import { Ad, Car, CarModelEN, CarMakeEN } from "@prisma/client";
import LoaderComponant from "../component/loader";
import { AdWithCar } from "@/types/car";

const ListProduct = ({
  data,
  orientation,
  isPending,
  isError,
  error,
}: {
  data: AdWithCar[] | undefined;
  orientation: "grid" | "list";
  isPending: boolean;
  isError: boolean;
  error: any;
}) => {
  if (isPending) return <LoaderComponant />;
  if (isError) return <div>Une erreur est survenue: {error.message}</div>;
  if (!data || data.length === 0) return <div>Aucune annonce trouvée</div>;

  return (
    <div
      className={`grid gap-4 ${
        orientation === "grid"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1"
      }`}
    >
      {data.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
          favorite={false}
          orientation={orientation}
          me={false}
        />
      ))}
    </div>
  );
};

export default ListProduct;
