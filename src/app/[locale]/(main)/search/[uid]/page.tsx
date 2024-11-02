"use client";
import * as React from "react";
import CarDetails from "@/components/component/car-details";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoaderComponant from "@/components/component/loader";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

const ProductPage = ({ params }: { params: { uid: string } }) => {
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["details"],
    queryFn: async () => {
      const response = await axios.get<any>("/api/ad?id=" + params.uid);
      return response.data;
    },
  });
  return (
    <div className={"m-auto "}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => window.history.back()}
        className="absolute cursor-pointer z-30 md:hidden rounded-full top-20 left-8"
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </Button>
      {isLoading && <LoaderComponant />}
      {isError && <div>Une erreur est survenue</div>}
      {data && data.data && <CarDetails key={data.data.id} item={data.data} />}
    </div>
  );
};
export default ProductPage;
