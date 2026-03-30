"use client";
import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/productsService";
import { useStore } from "@/context/storeContext";
import MainCard from "../../Card/index";
import type { ApiError } from "@/services/productsService";
import Loader from "@/components/Loader";

const ProductsCard = () => {
  const { selectedCategory } = useStore();

  const {
    data: productsData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () => productsService.fetchProducts(selectedCategory as string, undefined, 1, 8, 'client'),
    enabled: !!selectedCategory,
    staleTime: 1000 * 60 * 5, // 5 min (data is fresh)
    gcTime: 1000 * 60 * 30, // 30 min in cache
  });

  if (error) {
    const err = error as ApiError;
    return (
      <div className="flex justify-center items-center h-96 text-center text-red-600 text-lg">
        {err.response?.message ?? err.message ?? "Something went wrong."}
      </div>
    );
  }

  return (
    <div className="xl:max-w-[1440px] mx-auto xl:mt-14">
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {productsData?.data.slice(0, 8).map((item) => (
            <div
              key={item._id}
              className=""
            >
              <MainCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(ProductsCard);
