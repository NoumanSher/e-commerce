import Image from "next/image";
import React, { memo } from "react";
import { BannerProductsData } from "@/data/data";

const BannerProducts = () => {
  return (
    <div>
      <div className="pb-6 md:flex  xl:mx-auto xl:max-w-[1440px]">
        {BannerProductsData.map((item) => (
          <div key={item._id} className="md:w-[50%] md:px-4">
            <div className="relative">
              <Image
                className="w-full pb-6"
                src={item.bannerimage}
                alt="bannerimg"
                layout="responsive"
              />
              <div className="absolute  left-[30px] bottom-[54px] pt-[30px] pr-[30px]">
                <h1 className="text-[14px] font-normal leading-[1.7143em] uppercase">
                  {item.title}
                </h1>
                <h1 className="text-[22px] font-medium leading-[1.2em] mb-2 capitalize">
                  {item.desc}
                </h1>
                <button className="btn-link text-[14px] font-semibold pb-1 leading-[1.7143em]">
                  Shop Now
                </button>
              </div>
            </div>
            <div className="relative">
              <Image
                className="!w-[100%] pb-6"
                src={item.bannerimage1}
                alt="bannerimg"
              />
              <div className="absolute  left-[30px] bottom-[54px] pt-[30px] pr-[30px]">
                <h1 className="text-[14px] font-normal leading-[1.7143em] uppercase">
                  {item.title1}
                </h1>
                <h1 className="text-[22px] font-medium leading-[1.2em] mb-2 capitalize">
                  {item.desc1}
                </h1>
                <button className="btn-link text-[14px] font-semibold pb-1 leading-[1.7143em]">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(BannerProducts);
