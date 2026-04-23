"use client"
import React, { useCallback } from "react";
import Link from "next/link";
import { useStore } from "@/context/storeContext";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { productsService } from "@/services/productsService";
import { STALE_TIMES, CACHE_TIMES } from "@/lib/queryClient";
import { useRouter } from "next/navigation";

export default function AllProductBtn() {
  const { selectedCategory } = useStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleMouseEnter = useCallback(() => {
    // Prefetch categories (unified key — same as useCategoriesQuery)
    queryClient.prefetchQuery({
      queryKey: queryKeys.categories.all(),
      queryFn: () => productsService.fetchAllCategories(),
      staleTime: STALE_TIMES.infinite,
      gcTime: CACHE_TIMES.infinite,
    });
    
    // Prefetch products initial page
    if (selectedCategory) {
      queryClient.prefetchInfiniteQuery({
        queryKey: ["products", { parent: selectedCategory, child: null }],
        queryFn: ({ pageParam = 1 }) =>
          productsService.fetchProducts({
            categorySlug: selectedCategory,
            page: pageParam as number,
            limit: 10,
            mode: 'client'
          }),
        initialPageParam: 1,
      });
    }

    // Prefetch Next.js bundle
    router.prefetch(`/all-products?parentCategorySlug=${selectedCategory}&mode=client`);
  }, [queryClient, router, selectedCategory]);

  return (
    <div className="flex justify-center mb-6 md:mb-8 mt-5 xl:mt-9 xl:mb-15 pb-10 lg:pb-15">
      <Link
        href={`/all-products?parentCategorySlug=${selectedCategory}&mode=client`}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleMouseEnter}
        className="
          group relative inline-flex items-center gap-2
          border border-gray-900 text-gray-900
          px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.12em]
          overflow-hidden transition-colors duration-300
          hover:text-white
        "
      >
        <span className="absolute inset-0 bg-gray-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
        <span className="relative">See All Products</span>
        <svg className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}
