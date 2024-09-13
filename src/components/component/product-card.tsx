"use client";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Ad, Car } from "@prisma/client";
import { useRouter } from "next/navigation";

const ProductCard = (item: Ad) => {
  const router = useRouter();
  return (
    <Card
      onClick={() => {
        router.push(`search/${item.id}`);
      }}
      key={item.id}
      className={"relative group "}
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
        <div className={`flex-1 grid gap-2`}>
          <CardDescription>
            <div className="flex items-center py-4 justify-between">
              <CardTitle className="font-semibold text-2xl">
                {item.title}
              </CardTitle>
              <div className="text-2xl font-bold flex">
                {Math.floor(Number(item.price)).toString()} €
              </div>
            </div>
            <div className="w-full ">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{""}</span>
                  <span className="text-sm text-gray-500">{item.Kms} km</span>
                  <span className="text-sm text-gray-500">
                    {item.optionsID.length} options
                  </span>
                </div>
              </div>
            </div>
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};
export default ProductCard;
