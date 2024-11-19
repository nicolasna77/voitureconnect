"use client";
import LoaderComponant from "@/components/component/loader";
import ProductCard from "@/components/component/product-card";
import ListFavorite from "@/components/list/list-favorite";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

type Like = {
  id: string;
  ad: {
    id: string;
    title: string;
    updatedAt: string;
    garageId?: string | null;
    car: {
      price: string | number;
      Kms: number;
      year: number;
      gearbox: string;
      fuelType: string;
      pictures: {
        id: string;
        url: string;
        alt: string;
      }[];
      carMake: {
        id_car_make: number;
        name: string;
        date_create: number;
        date_update: string | null;
        id_car_type: number;
      } | null;
      carModel: {
        id_car_model: number;
        name: string;
        date_create: number;
        date_update: string | null;
        id_car_make: number;
        id_car_type: number;
      } | null;
    };
  };
};

const FavoritePage = () => {
  return (
    <div>
      <ListFavorite />
    </div>
  );
};

export default FavoritePage;
