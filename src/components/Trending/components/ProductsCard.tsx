import React, { memo} from "react";
import MainCard from "../../Card/index";
import { ProductCardData } from "@/data/data";
const ProductsCard = () => {
  return (
    <div>
      <div className="flex flex-wrap xl:max-w-[1440px] mx-auto xl:mt-14 ">
        {ProductCardData.map((item, index) => {
          return (
            <>
            <div key={index} className="w-[50%] md:!w-[33.333%] lg:!w-[25%]">

              <MainCard  item={item} />
            </div>
            </>
          );
        })}
      </div>
      <div className="flex justify-center  mb-6 md:mb-8 md:mt-3 xl:mt-9 xl:mb-24  ">
        <button className="uppercase text-[14px] font-semibold btn-link1 pb-1 leading-[1.2rem] text-center mt-2">
          See All Products
        </button>
      </div>
    </div>
  );
};
export default memo(ProductsCard);
