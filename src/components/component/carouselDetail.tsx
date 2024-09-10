"use client";
import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import imagepng from "@/../public/data/product/99c824fcbee66d7f3554135f2c9b3421a4025897.webp";
function CarouselDetail() {
  const settings = {
    customPaging: function (i: any) {
      return (
        <a>
          <Image width={34} height={400} alt="" src={imagepng} />
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="slider-container p-14">
      <Slider {...settings}>
        <div>
          <Image
            width={900}
            height={400}
            className="rounded-md "
            alt=""
            src={imagepng}
          />
        </div>
        <div>
          <Image
            width={900}
            className="rounded-md "
            height={400}
            alt=""
            src={imagepng}
          />
        </div>
        <div>
          <Image
            width={900}
            className="rounded-md "
            height={400}
            alt=""
            src={imagepng}
          />
        </div>
        <div>
          <Image
            width={900}
            className="rounded-md "
            height={800}
            alt=""
            src={imagepng}
          />
        </div>
      </Slider>
    </div>
  );
}

export default CarouselDetail;
