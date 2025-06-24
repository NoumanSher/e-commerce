"use client";
import React, { memo } from "react";
import MainCard from "@/components/Card";
import { Product } from "@/components/productDetail/productDetailDto";
interface WishCardListProps {
  products: Product[];
}
const WishCardList = ({ products }: WishCardListProps) => {
  return (
    <div>
      <div className="flex flex-wrap xl:max-w-[1440px] mx-auto xl:mt-14">
        {products?.map((item) => (
          <div key={item._id} className="w-[50%] md:!w-[33.333%] lg:!w-[25%]">
            <MainCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(WishCardList);
