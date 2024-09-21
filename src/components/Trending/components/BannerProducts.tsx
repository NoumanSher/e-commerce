import React, { memo } from "react";
import { BannerProductsData } from "@/data/data";
import BannerCard from "@/components/bannerCard";

const BannerProducts = () => {
  return (
    <div>
      <div className="pb-6 md:flex w-full   xl:mx-auto xl:max-w-[1440px]">
        {BannerProductsData.map((item, index) => (
          <div key={index} className="md:w-[50%] md:px-4">
            <BannerCard item={item} key={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(BannerProducts);
