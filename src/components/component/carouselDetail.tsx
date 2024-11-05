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
import { useState, useCallback } from "react";
import { Fullscreen } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

function CarouselDetail({ item }: any) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const openFullscreen = useCallback((imageSrc: string) => {
    setFullscreenImage(imageSrc);
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenImage(null);
  }, []);

  const renderMainImage = useCallback(
    (index: number) => (
      <SliderMainItem key={index} className="bg-transparent relative group">
        <Image
          src={item.car?.pictures[index]?.url}
          alt={item.car?.pictures[index]?.alt}
          width={600}
          height={400}
          className="object-cover rounded-xl w-full"
          quality={75}
          loading={index === 0 ? "eager" : "lazy"}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j..."
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          onClick={() => openFullscreen(item.car?.pictures[index]?.url)}
        />
      </SliderMainItem>
    ),
    [openFullscreen, item.car?.pictures]
  );

  const renderThumbnail = useCallback(
    (index: number) => (
      <SliderThumbItem key={index} index={index} className="bg-transparent ">
        <Image
          src={item.car?.pictures[index]?.url}
          alt={item.car?.pictures[index]?.alt}
          loading={index === 0 ? "eager" : "lazy"}
          className="object-cover border h-32 bg-white border-border rounded-xl w-full"
          width={100}
          sizes="100vw"
          height={20}
          quality={100}
        />
      </SliderThumbItem>
    ),
    [item.car?.pictures]
  );

  const renderFullscreenImage = useCallback(
    (index: number) => (
      <SliderMainItem key={index} className="bg-transparent relative group">
        <Image
          src={item.car?.pictures[index]?.url}
          alt={item.car?.pictures[index]?.alt}
          className="object-contain w-full h-full"
          quality={100}
          width={800}
          height={400}
          priority
          sizes="90vw"
        />
      </SliderMainItem>
    ),
    [item.car?.pictures]
  );

  const totalImages = item.car?.pictures?.length || 0;

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
            onClick={() => openFullscreen(item.car?.pictures[0]?.url)}
          >
            <Fullscreen className="w-6 h-6" />
          </Button>
        </div>
        <CarouselMainContainer>
          {Array.from({ length: totalImages }).map((_, index) =>
            renderMainImage(index)
          )}
        </CarouselMainContainer>
        <CarouselThumbsContainer className="h-36 ">
          {Array.from({ length: totalImages }).map((_, index) =>
            renderThumbnail(index)
          )}
        </CarouselThumbsContainer>
      </Carousel>

      <Dialog open={!!fullscreenImage} onOpenChange={closeFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] bg-white border-border">
          <Carousel
            className="max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <CarouselNext className="absolute top-1/2 right-2 h-10 w-10 -translate-y-1/2" />
            <CarouselPrevious className="absolute top-1/2 left-2 h-10 w-10 -translate-y-1/2" />
            <CarouselMainContainer className="max-h-[90vh]">
              {Array.from({ length: totalImages }).map((_, index) =>
                renderFullscreenImage(index)
              )}
            </CarouselMainContainer>
            <CarouselThumbsContainer>
              {Array.from({ length: totalImages }).map((_, index) => (
                <SliderThumbItem key={index} index={index} className="bg-white">
                  <Image
                    src={item.car?.pictures[index]?.url}
                    alt={item.car?.pictures[index]?.alt}
                    width={100}
                    height={100}
                    className="object-cover rounded-xl"
                  />
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
