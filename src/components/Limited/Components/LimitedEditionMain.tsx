"use client";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import Imag from "../../../assets/img/product-10.jpg";
const Carousel = dynamic(() => import("react-multi-carousel"), { ssr: false });
import "react-multi-carousel/lib/styles.css";
import dynamic from "next/dynamic";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye, FiHeart } from "react-icons/fi";
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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>("gray");
  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);
  // Memoize the event handlers to prevent re-creation on each render
  const handleMouseEnter = useCallback((id: number) => {
    setHoveredCard(id);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setHoveredCard(null); // Reset the hovered state
  }, []);
  return (
    <div className="bg-[#222222]">
      <div className="px-5 mx-auto py-9  xl:py-24  md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1350px]  ">
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
            containerClass="carousel-container"
            itemClass="carousel-item-padding-40-px"
            responsive={responsive}
          >
            {Array(12)
              .fill(0)
              .map((item, index) => {
                const isHovered = hoveredCard === index;

                return (
                  <div
                    key={index}
                    className="flex w-full justify-between items-center"
                  >
                    <div key={index} className="w-[100%] pr-[6px] md:!pr-3   lg:!pr-[18px] xl:pr-6 flex-shrink-0">
                      <div
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <Image
                          src={Imag} // Use currentImage instead of Imag
                          alt="Product Image"
                          className="aspect-[260/315] w-full"
                        />
                        <div
                          className={`absolute bottom-[10px] mb-2 flex justify-center w-full gap-2 transition-all duration-300 ease-in-out transform ${
                            isHovered
                              ? "opacity-100 visible translate-y-[-10px]"
                              : "opacity-0 invisible translate-y-5"
                          }`}
                        >
                          <div className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center">
                            <MdOutlineShoppingBag />
                          </div>
                          <div className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center">
                            <FiEye />
                          </div>
                          <div className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center">
                            <FiHeart />
                          </div>
                        </div>
                      </div>
                      <div className="p-6 bg-[#e9e7e8]">
                        <h1 className="text-base font-normal leading-[1.2rem]">
                          Calvin Shorts
                        </h1>
                        <p className="text-base font-normal leading-[1.2rem]">
                          $29
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
