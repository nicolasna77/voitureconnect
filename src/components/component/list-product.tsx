"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useMemo } from "react";
import { useState } from "react";
import { LayoutGridIcon, ListIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const ListProduct = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    brand: [],
    type: [],
  });
  const cars = [
    {
      id: 1,
      name: "Toyota Camry",
      brand: "Toyota",
      type: "Sedan",
      price: 25000,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Honda Civic",
      brand: "Honda",
      type: "Sedan",
      price: 22000,
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Ford F-150",
      brand: "Ford",
      type: "Truck",
      price: 35000,
      image: "/placeholder.svg",
    },
    {
      id: 4,
      name: "Jeep Wrangler",
      brand: "Jeep",
      type: "SUV",
      price: 30000,
      image: "/placeholder.svg",
    },
    {
      id: 5,
      name: "Tesla Model S",
      brand: "Tesla",
      type: "Electric",
      price: 80000,
      image: "/placeholder.svg",
    },
    {
      id: 6,
      name: "Subaru Outback",
      brand: "Subaru",
      type: "SUV",
      price: 28000,
      image: "/placeholder.svg",
    },
  ];
  const handleFilterChange = (type, value) => {
    if (type === "brand") {
      setSelectedFilters({
        ...selectedFilters,
        brand: selectedFilters.brand.includes(value)
          ? selectedFilters.brand.filter((item) => item !== value)
          : [...selectedFilters.brand, value],
      });
    } else if (type === "type") {
      setSelectedFilters({
        ...selectedFilters,
        type: selectedFilters.type.includes(value)
          ? selectedFilters.type.filter((item) => item !== value)
          : [...selectedFilters.type, value],
      });
    }
  };
  const [cardFormat, setCardFormat] = useState("grid");
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (
        selectedFilters.brand.length > 0 &&
        !selectedFilters.brand.includes(car.brand)
      ) {
        return false;
      }
      if (
        selectedFilters.type.length > 0 &&
        !selectedFilters.type.includes(car.type)
      ) {
        return false;
      }
      return true;
    });
  }, [selectedFilters]);
  return (
    <section className="w-full py-12">
      <div className="container m-auto grid gap-6 md:gap-8 px-4 md:px-6">
        <div className="flex justify-between flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Discover Our Car Collection
            </h1>
            <p className="text-muted-foreground">
              Browse through our selection of high-quality vehicles.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={cardFormat === "grid" ? "default" : "outline"}
              onClick={() => setCardFormat("grid")}
            >
              <LayoutGridIcon className="w-5 h-5" />
              <span className="sr-only">Grid View</span>
            </Button>
            <Button
              variant={cardFormat === "list" ? "default" : "outline"}
              onClick={() => setCardFormat("list")}
            >
              <ListIcon className="w-5 h-5" />
              <span className="sr-only">List View</span>
            </Button>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={
                selectedFilters.brand.includes("Toyota") ? "default" : "outline"
              }
              onClick={() => handleFilterChange("brand", "Toyota")}
            >
              Toyota
            </Button>
          </div>
        </div>
        <ul
          className={`grid gap-8 ${
            cardFormat === "grid"
              ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "flex flex-col"
          }`}
        >
          {filteredCars.map((car) => (
            <Card
              key={car.id}
              className={`relative group ${
                cardFormat === "list" ? "flex items-center gap-6" : "grid gap-4"
              }`}
            >
              <Image
                src="/placeholder.svg"
                alt={car.name}
                width={300}
                height={200}
                className={`rounded-lg object-cover ${
                  cardFormat === "list"
                    ? "aspect-video"
                    : "aspect-square  w-full"
                } group-hover:opacity-50 transition-opacity`}
                style={{ aspectRatio: "300/200", objectFit: "cover" }}
              />
              <CardContent>
                <CardTitle className="font-semibold">{car.name}</CardTitle>
                <div
                  className={`flex-1 grid gap-2 ${
                    cardFormat === "list" ? "ml-4" : ""
                  }`}
                >
                  <CardDescription>
                    <p className="text-sm leading-none text-muted-foreground">
                      {car.brand} - {car.type}
                    </p>{" "}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      ${car.price.toLocaleString()}
                    </h4>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </ul>
      </div>
    </section>
  );
};
export default ListProduct;
