"use client";

import ProductCard from "../component/product-card";
import LoaderComponant from "../component/loader";
import { AdWithCar } from "@/types/car";

const ListProduct = ({
  data,
  orientation,
  isPending,
  isError,
  error,
  filters,
}: {
  data: AdWithCar[] | undefined;
  orientation: "grid" | "list";
  isPending: boolean;
  isError: boolean;
  error: any;
  filters: boolean;
}) => {
  if (isPending) return <LoaderComponant />;
  if (isError) return <div>Une erreur est survenue: {error.message}</div>;
  if (!data || data.length === 0) return <div>Aucune annonce trouvée</div>;

  return (
    <div>
      <div className="py-4">Total résultat: {data?.length}</div>

      <div
        className={`grid gap-8 m-auto ${
          orientation === "grid" && !filters
            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 "
            : "max-w-4xl grid-cols-1 "
        } ${
          filters && orientation === "grid"
            ? " grid-cols-1 md:grid-cols-2 lg:grid-cols-2  "
            : ""
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
    </div>
  );
};

export default ListProduct;
