import * as React from "react";
import CarDetails from "@/components/component/car-details";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details | Auto-Moto",
};

const ProductPage = ({ params }: { params: { uid: string } }) => {
  return (
    <div className={"m-auto "}>
      <CarDetails id={params.uid} />
    </div>
  );
};

export default ProductPage;
