"use client";
import React, { memo } from "react";
import MainCard from "@/components/Card";
import { Product } from "@/components/productDetail/productDetailDto";

interface WishCardListProps {
  products: Product[];
}
const WishCardList = ({ products }: WishCardListProps) => {
  return (
    <div className="w-full xl:max-w-[1440px] px-4 md:px-6 lg:px-8 py-8 md:py-12 mx-auto min-h-[50vh]">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Wishlist</h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          {products.length} {products.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.length > 0 ? (
          products?.map((item) => (
            <div key={item._id}>
              <MainCard item={item} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center py-16 md:py-24">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</p>
              <p className="text-gray-500 max-w-sm mb-8">
                Explore our collections and add some items to your wishlist to find them here later!
              </p>
              <a href="/all-products?parentCategorySlug=all-categories&mode=client" className="inline-block bg-black text-white hover:bg-gray-800 transition-colors font-medium py-3 px-8 rounded-full">
                Continue Shopping
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(WishCardList);
