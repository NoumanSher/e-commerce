import Image from "next/image";
import React, { memo } from "react";
import { BannerProps } from "../types/BannerCardDto";

const Banner = ({ bannerimage,desc,title }: BannerProps) => {
  return (
    <div>
      <div className="relative">
        <Image
          className="w-full pb-6"
          src={bannerimage}
          priority={true}
              loading='eager'
          alt="bannerimg"
        />
        <div className="absolute  left-[30px] bottom-[54px] pt-[30px] pr-[30px]">
          <h1 className="text-[14px] font-normal leading-[1.7143em] uppercase">
            {title}
          </h1>
          <h1 className="text-[22px] font-medium leading-[1.2em] mb-2 capitalize">
            {desc}
          </h1>
          <button className="btn-link text-[14px] font-semibold pb-1 leading-[1.7143em]">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};
export default memo(Banner);
