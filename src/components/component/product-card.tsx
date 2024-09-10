"use client";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Ad, Car } from "@prisma/client";
import { useRouter } from "next/navigation";

const ProductCard = (item: Ad) => {
  const router = useRouter();
  console.log(item);
  return (
    <Card
      onClick={() => {
        router.push(`view/product/${item.id}`);
      }}
      key={item.id}
      className={"relative group grid gap-4"}
    >
      <Image
        src="/placeholder.svg"
        alt="car"
        width={300}
        height={200}
        className={`rounded-lg object-cover ${"aspect-square w-full"} group-hover:opacity-50 transition-opacity`}
        style={{ aspectRatio: "300/200", objectFit: "cover" }}
      />
      <CardContent>
        <CardTitle className="font-semibold">{item.title}</CardTitle>
        <div className={`flex-1 grid gap-2`}>
          <CardDescription>
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">
                {item.car.model} - {item.car.generation}
              </h4>
            </div>
            <div className="w-full ">
              <h4 className="font-semibold float-end">{item.price} €</h4>
            </div>
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};
export default ProductCard;
