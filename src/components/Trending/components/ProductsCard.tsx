"use client";
import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/productsService";
import { useStore } from "@/context/storeContext";
import { queryKeys } from "@/lib/queryKeys";
import { STALE_TIMES, CACHE_TIMES } from "@/lib/queryClient";
import MainCard from "../../Card/index";
import type { ApiError } from "@/lib/apiClient";

const ProductsCard = () => {
  const { selectedCategory } = useStore();

  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    // Standardized key — matches the homepage SSR prefetch in page.tsx so cache is shared.
    queryKey: queryKeys.products.trending(selectedCategory as string),
    queryFn: () =>
      productsService.fetchProducts({
        categorySlug: selectedCategory as string,
        page: 1,
        limit: 8,
        mode: "client",
      }),
    enabled: !!selectedCategory,
    staleTime: STALE_TIMES.medium,
    gcTime: CACHE_TIMES.medium,
  });

  if (error) {
    const err = error as ApiError;
    return (
      <div className="flex justify-center items-center h-96 text-center text-red-600 text-lg">
        {err.message ?? "Something went wrong."}
      </div>
    );
  }

  return (
    <div className="xl:max-w-[1440px] mx-auto xl:mt-14">
      {isLoading ? (
        // Only show skeleton on true first load — NOT on background revalidation (isFetching).
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded overflow-hidden shadow-sm">
              <div className="aspect-[3/4] w-full bg-gray-200 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[3px] sm:gap-4">
          {productsData?.data.slice(0, 8).map((item) => (
            <div key={item._id}>
              <MainCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(ProductsCard);
