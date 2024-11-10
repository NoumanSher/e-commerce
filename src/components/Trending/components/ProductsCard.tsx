import React, { memo } from "react";
import MainCard from "../../Card/index";
import { ProductCardData } from "@/data/data";
const ProductsCard = () => {
  return (
    <div>
      <div className="flex flex-wrap xl:max-w-[1440px] mx-auto xl:mt-14 ">
        {ProductCardData.map((item) => {
          return (
            <div key={item._id} className="w-[50%] md:!w-[33.333%] lg:!w-[25%]">
              <MainCard item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default memo(ProductsCard);
