"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  SliderMainItem,
  CarouselThumbsContainer,
  SliderThumbItem,
} from "./carousel";
import { useState } from "react";
import { Fullscreen, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { cn } from "@/lib/utils";

function CarouselDetail() {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const openFullscreen = (imageSrc: string) => {
    setFullscreenImage(imageSrc);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <>
      <Carousel className="relative">
        <CarouselNext className="absolute top-1/3 right-2 h-10 w-10 -translate-y-1/3" />
        <CarouselPrevious className="absolute top-1/3 left-2 h-10 w-10 -translate-y-1/3" />
        <div className="absolute z-30 top-2 right-2 transition-opacity">
          <Button
            className="rounded-full"
            variant="outline"
            size="icon"
            onClick={() => openFullscreen("/AdobeStock_590625806_Preview.png")}
          >
            <Fullscreen className="w-6 h-6" />
          </Button>
        </div>
        <CarouselMainContainer className="max-h-[30rem]">
          {Array.from({ length: 5 }).map((_, index) => (
            <SliderMainItem
              key={index}
              className="bg-transparent relative group"
            >
              <Image
                src="/AdobeStock_590625806_Preview.png"
                alt={`Image ${index + 1}`}
                width={1920}
                height={1080}
                className="object-cover w-full h-full cursor-pointer"
                quality={85}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onClick={() =>
                  openFullscreen("/AdobeStock_590625806_Preview.png")
                }
              />
            </SliderMainItem>
          ))}
        </CarouselMainContainer>
        <CarouselThumbsContainer>
          {Array.from({ length: 5 }).map((_, index) => (
            <SliderThumbItem
              key={index}
              index={index}
              className="bg-transparent"
            >
              <div className="outline outline-1 outline-border size-full flex items-center justify-center rounded-xl bg-background">
                Slide {index + 1}
              </div>
            </SliderThumbItem>
          ))}
        </CarouselThumbsContainer>
      </Carousel>

      <Dialog open={!!fullscreenImage} onOpenChange={closeFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
          <Carousel
            className="w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <CarouselNext className="absolute top-1/2 right-2 h-10 w-10 -translate-y-1/2" />
            <CarouselPrevious className="absolute top-1/2 left-2 h-10 w-10 -translate-y-1/2" />
            <CarouselMainContainer className="max-h-[90vh]">
              {Array.from({ length: 5 }).map((_, index) => (
                <SliderMainItem
                  key={index}
                  className="bg-transparent relative group"
                >
                  <Image
                    src="/AdobeStock_590625806_Preview.png"
                    alt={`Image ${index + 1}`}
                    className="object-contain w-full h-full"
                    quality={100}
                    fill={true}
                    priority
                    sizes="100vw"
                    placeholder="blur"
                  />
                </SliderMainItem>
              ))}
            </CarouselMainContainer>
            <CarouselThumbsContainer>
              {Array.from({ length: 10 }).map((_, index) => (
                <SliderThumbItem
                  key={index}
                  index={index}
                  className="bg-transparent"
                >
                  <div className="outline outline-1 outline-border size-full flex items-center justify-center rounded-xl bg-background">
                    Slide {index + 1}
                  </div>
                </SliderThumbItem>
              ))}
            </CarouselThumbsContainer>
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CarouselDetail;
