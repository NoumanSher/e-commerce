"use client";
import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/productsService";
import { useStore } from "@/Context/storeContext";
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
    queryFn: () => fetchProducts(selectedCategory as string),
    enabled: !!selectedCategory,
    staleTime: 1000 * 60 * 5, // 5 min (data is fresh)
    gcTime: 1000 * 60 * 30, // 30 min in cache
  });

  // useEffect(() => {
  //   if (selectedCategory) {
  //     refetch();
  //   }
  // }, [selectedCategory, refetch]);

  if (error) {
    const err = error as ApiError;
    return (
      <div className="flex justify-center items-center h-96 text-center text-red-600 text-lg">
        {err.response?.message ?? err.message ?? "Something went wrong."}
      </div>
    );
  }

  return (
    <div className="xl:max-w-[1440px] mx-auto xl:mt-14 px-4">
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <div className="flex flex-wrap gap-y-6">
          {productsData?.data.slice(0, 8).map((item) => (
            <div
              key={item._id}
              className="w-[50%] md:w-[33.333%] lg:w-[25%] px-2"
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
