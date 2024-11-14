"use client";
import axios from "axios";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Car, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Ad,
  Car as CarType,
  CarMakeFR,
  CarModelFR,
  Like,
  Option,
  Picture,
} from "@prisma/client";
import ProductCard from "@/components/component/product-card";
import Link from "next/link";

const DetailGarage = ({ params }: { params: { uid: string } }) => {
  const {
    data: garage,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["garage", params.uid],
    queryFn: async () => {
      const { data } = await axios.get(`/api/garages/${params.uid}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">
          Une erreur est survenue lors du chargement du garage
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen rounded-lg bg-gradient-to-b from-background to-secondary/10">
      <header className="relative bg-background/20 rounded-lg text-primary-foreground py-12 px-8 shadow-lg">
        <div className="absolute inset-0 z-0">
          <Image
            src={
              garage.owner.background || "/data/illustration/banner/banner.jpg"
            }
            alt="Garage Banner"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Image
                src={garage.owner.picture || "/placeholder.svg"}
                alt="Garage Logo"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full border-4 border-primary-foreground"
                style={{ aspectRatio: "80/80", objectFit: "cover" }}
              />
              <h1 className="text-2xl font-bold text-secondary-foreground">
                {garage.name}
              </h1>
            </div>
            <div className="flex flex-col items-end gap-3">
              <p className="text-base text-secondary-foreground flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                {garage.Adresse.street}, {garage.Adresse.city},{" "}
                {garage.Adresse.zip}
              </p>
              <Link
                href={`tel:${garage.phone}`}
                className="text-base flex hover:underline items-center gap-3 text-secondary-foreground hover:text-primary-foreground/90"
              >
                <Phone className="w-5 h-5" />{" "}
                {garage.phone.replace(
                  /(\d{3})(\d{3})(\d{4})(.*)/,
                  "$1.$2.$3$4"
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Nos Véhicules</h2>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {garage.adID.length} disponibles
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {garage.adID.map((ad: any) => (
              <ProductCard key={ad.id} item={ad} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailGarage;
