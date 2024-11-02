"use client";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { CarouselNext, CarouselPrevious } from "./ui/carousel";
import Title from "./title";
const CategoriSection = () => {
  const carCategories = [
    { id: 1, name: "SUV", icon: "suv" },
    { id: 2, name: "Berline", icon: "sedan" },
    { id: 3, name: "Coupé", icon: "coupe" },
    { id: 4, name: "Cabriolet", icon: "cabriolet" },
    { id: 5, name: "Citadine", icon: "micro" },
    { id: 6, name: "Break", icon: "station" },
  ];
  return (
    <div className="py-12 md:py-24 lg:py-32 max-w-7xl  px-14  m-auto  ">
      <div className="flex flex-col items-center pb-8 justify-center space-y-4 text-center">
        <div className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Categories de voiture
        </div>
        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Trouvez la catégorie de voiture qui vous convient parmi nos catégories
          de voitures.
        </p>
      </div>
      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
      >
        <CarouselContent className="-ml-2  md:-ml-4">
          {carCategories.map((category) => (
            <CarouselItem
              className="md:basis-1/4 text-center  group basis-2/5  pl-2 md:pl-4 lg:basis-1/5"
              key={category.id}
            >
              <Card className="transition-colors bg-card duration-300 ">
                <Link href={"/search"}>
                  <CardContent>
                    <div className="relative w-[100px] h-[100px] m-auto">
                      <Image
                        src={`/data/category/${category.icon}.svg`}
                        alt={category.name}
                        width={100}
                        height={100}
                        quality={90}
                        className=" transition-all duration-300"
                      />
                    </div>
                    <span className="text-md font-bold text-secondary-foreground group-hover:underline group-hover:text-secondary-foreground">
                      {category.name}
                    </span>
                  </CardContent>
                </Link>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>
    </div>
  );
};
export default CategoriSection;
