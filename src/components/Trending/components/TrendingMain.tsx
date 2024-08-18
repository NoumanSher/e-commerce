"use client";
import React, { memo, useCallback, useMemo, useState } from "react";
import "./styles.css";
import Image from "next/image";
import banner1 from "../../../assets/img/grid-banner-1.jpg";
import banner2 from "../../../assets/img/grid-banner-2.jpg";
import banner3 from "../../../assets/img/grid-banner-3.jpg";
import banner4 from "../../../assets/img/grid-banner-4.jpg";
import product1 from "../../../assets/img/product-2-1.jpg";
import product2 from "../../../assets/img/product-2-2.jpg";
import product3 from "../../../assets/img/pexels-wdnet-291759.jpg";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye, FiHeart } from "react-icons/fi";

const TrendingMain = () => {
  const [isHovered, setIsHovered] = useState(false);

  const currentImage = useMemo(
    () => (isHovered ? product2 : product1),
    [isHovered]
  );

  // Memoize the event handlers to prevent re-creation on each render
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  return (
    <>
      <div className="bg-[#faf9f8] px-4 md:px-6 mx-auto pt-7">
        <div className="">
          <div>
            <h1 className="text-[26px] !font-normal leading-[1.2em] !mb-1 text-center">
              Trending
            </h1>
          </div>
          <div className="xl:mt-8">
            <ul className="flex flex-wrap justify-center mb-[1rem] mt-2">
              <li>
                <a
                  href="#"
                  className="nav-link mx-[25px]  mt-[11px] pb-[9px] active leading-[1.375em] text-[14px] !font-medium uppercase"
                >
                  All
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="nav-link mx-[25px] mt-[11px] pb-[9px] leading-[1.375em] text-[14px] !font-medium uppercase"
                >
                  Women
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="nav-link mx-[25px] mt-[11px] pb-[9px] leading-[1.375em] text-[14px] !font-medium uppercase"
                >
                  Men
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="nav-link mx-[25px] mt-[11px] pb-[9px] leading-[1.375em] text-[14px] !font-medium uppercase"
                >
                  Kids
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-wrap xl:max-w-[1350px] mx-auto xl:mt-14 ">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
              <div key={index} className="w-[50%] md:w-[33.333%] mb-6 xl:mb-12   px-2 lg:w-[25%] md:px-4">
                <div className="">
                  <div
                    className="relative xl:h-[404px]"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Image
                      src={currentImage}
                      
                      alt="Product BAnner Img"
                      className="object-cover w-full h-full transition-transform duration-700 ease-in-out transform-gpu "
                    />
                    <div className="bg-white absolute top-0 mx-[8px] mt-[8px] py-[7px] px-[10px] ">
                      <h1 className="uppercase text-black text-[12px] leading-[1.25em] font-normal ">
                        New
                      </h1>
                    </div>
                    <div className="bg-black absolute top-0 mx-[8px] mt-[8px] py-[7px] px-[10px] ">
                      <h1 className="uppercase text-white text-[12px] leading-[1.25em] font-normal ">
                        sale
                      </h1>
                    </div>
                    <div className="bg-[#c32929] absolute left-auto !right-0 top-0 flex flex-col  mx-[8px] mt-[8px] py-[7px] px-[10px] ">
                      <h1 className="uppercase text-white text-[12px] leading-[1.25em] font-normal ">
                        -67%
                      </h1>
                    </div>
                    <div
                      className={`absolute bottom-[10px] mb-4 flex justify-center w-full gap-2 transition-all duration-300 ease-in-out transform ${
                        isHovered
                          ? "opacity-100 visible translate-y-[-10px]"
                          : "opacity-0 invisible translate-y-5"
                      }`}
                    >
                      <div className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center ">
                        <MdOutlineShoppingBag  />
                      </div>
                      <div className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center ">
                        <FiEye />
                      </div>
                      <div className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center ">
                        <FiHeart />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h1 className="mb-[4px] font-normal leading-[1.7143rem] text-[#767676] text-[14px]">
                      Dresses
                    </h1>
                    <p className="font-normal leading-[1.2em] text-[16px]">
                      Dropped Fox Leather Jacket
                    </p>
                    <p className="font-normal leading-[1.7143rem]  text-[16px]">
                      $25
                    </p>
                    <div className="mt-[4px] flex items-center gap-2 ">
                      <div className="w-[10px] h-[10px] rounded-[50%] bg-black" />
                      <div className="w-[20px] rounded-[50%] border-2 flex justify-center items-center border-black h-[20px]">
                        <div className="w-[10px] h-[10px] rounded-[50%] bg-[#b9a16b]" />
                      </div>
                      <div className="w-[10px] h-[10px] rounded-[50%] bg-[#f5e6e0]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center  mb-6 md:mb-8 md:mt-3 xl:mt-9 xl:mb-24  ">
            <button className="uppercase text-[14px] font-semibold btn-link1 pb-1 leading-[1.2rem] text-center mt-2">See All Products</button>
          </div>
        </div>

        <div className="pb-6 md:flex  xl:mx-auto xl:max-w-[1440px]">
          <div className="md:w-[50%] md:px-4">
            <div className="relative">
              <Image
                className="w-full pb-6"
                src={banner1}
                alt="bannerimg"
                layout="responsive"
              />
              <div className="absolute  left-[30px] bottom-[54px] pt-[30px] pr-[30px]">
                <h1 className="text-[14px] font-normal leading-[1.7143em] uppercase">
                  basic Collection
                </h1>
                <h1 className="text-[22px] font-medium leading-[1.2em] mb-2 capitalize">
                  New Arrivals
                </h1>
                <button className="btn-link text-[14px] font-semibold pb-1 leading-[1.7143em]">
                  Shop Now
                </button>
              </div>
            </div>
            <div className="relative">
              <Image className="!w-[100%] pb-6" src={banner2} alt="bannerimg" />
              <div className="absolute  left-[30px] bottom-[54px] pt-[30px] pr-[30px]">
                <h1 className="text-[14px] font-normal leading-[1.7143em] uppercase">
                  shop casual
                </h1>
                <h1 className="text-[22px] font-medium leading-[1.2em] mb-2 capitalize">
                  Free Shipping
                </h1>
                <button className="btn-link text-[14px] font-semibold pb-1 leading-[1.7143em]">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
          <div className="md:w-[50%] md:px-4">
            <div className="relative">
              <Image className="!w-[100%] pb-6" src={banner3} alt="bannerimg" />
              <div className="absolute  left-[30px] bottom-[54px] pt-[30px] pr-[30px]">
                <h1 className="text-[14px] font-normal leading-[1.7143em] uppercase">
                  want and need
                </h1>
                <h1 className="text-[22px] font-medium leading-[1.2em] mb-2 capitalize">
                  the eyegirl wears{" "}
                </h1>
                <button className="btn-link text-[14px] font-semibold pb-1 leading-[1.7143em]">
                  Shop Now
                </button>
              </div>
            </div>
            <div className="relative">
              <Image className="!w-[100%] pb-6" src={banner4} alt="bannerimg" />
              <div className="absolute  left-[30px] bottom-[54px] pt-[30px] pr-[30px]">
                <h1 className="text-[14px] font-normal leading-[1.7143em] uppercase">
                  sales of the week
                </h1>
                <h1 className="text-[22px] font-medium leading-[1.2em] mb-2 capitalize">
                  running shoes
                </h1>
                <button className="btn-link text-[14px] font-semibold pb-1 leading-[1.7143em]">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(TrendingMain);
