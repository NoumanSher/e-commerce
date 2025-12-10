"use client";
import React, { memo } from "react";
import MainCard from "@/components/Card";
import { Product } from "@/components/productDetail/productDetailDto";

interface WishCardListProps {
  products: Product[];
}
const WishCardList = ({ products }: WishCardListProps) => {
  return (

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 xl:max-w-[1440px] py-5 px-4 lg:px-6  mx-auto xl:my-14">
      {products.length > 0 ? (
        products?.map((item) => (
          <div key={item._id} className="">
            <MainCard item={item} />
          </div>
        ))
      ) : (
        <div className="col-span-full flex justify-center items-center w-full mt-5 sm:mt-0">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <svg
              className="w-16 h-16 mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>

            <p className="text-lg font-medium">No wish list item yet</p>
            <p className="text-sm mt-1">Your wish list history will appear here</p>
          </div>
        </div>
      )}
    </div>

  );
};

export default memo(WishCardList);
