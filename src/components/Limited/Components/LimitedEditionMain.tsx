"use client";
import React from "react";
const Carousel = dynamic(() => import("react-multi-carousel"), { ssr: false });
import "react-multi-carousel/lib/styles.css";
import dynamic from "next/dynamic";
import LimitedEditionCard from "./LimitedEditionCard";
import { CustomDot } from "./CustomDots";
export default function LimitedEditionMain() {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1280 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 1280, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1023, min: 720 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 720, min: 0 },
      items: 2,
    },
  };

  return (
    <div className="bg-[#222222]">
      <div className="px-5 mx-auto py-9  xl:py-24  md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1440px]  ">
        <div className="">
          <h1 className="text-[26px] xl:text-[32px] !font-normal pb-2 xl:pb-4 text-white !leading-[1.2rem] !text-center">
            Limited Edition
          </h1>
        </div>

        <div className="relative mt-2 md:mt-4 lg:mt-6 xl:mt-10 pb-16 lg:pb-20 xl:pb-24 w-full">
          <Carousel
            ssr={false}
            infinite={true}
            renderDotsOutside={true}
            slidesToSlide={2}
            showDots={true}
            customDot={<CustomDot />}
            containerClass="carousel-container"
            itemClass="carousel-item-padding-40-px"
            responsive={responsive}
          >
            {Array(12)
              .fill(0)
              .map((item, index) => {
                return (
                  
                    <div key={index}>
                      <LimitedEditionCard index={index}  />
                    </div>
                
                );
              })}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
