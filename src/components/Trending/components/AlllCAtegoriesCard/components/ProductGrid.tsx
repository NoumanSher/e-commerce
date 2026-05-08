import React, { useRef, useEffect } from "react";
import { PackageSearch } from "lucide-react";
import { Product } from "@/components/productDetail/productDetailDto";
import MainCard from "../../../../Card";

interface ProductGridProps {
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isPlaceholderData: boolean;
  isLoading: boolean;
  products: Product[];
  activeParentSlug: string | null;
  selectedChildCategory: string | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export default function ProductGrid({
  isFetching,
  isFetchingNextPage,
  isPlaceholderData,
  isLoading,
  products,
  activeParentSlug,
  selectedChildCategory,
  hasNextPage,
  fetchNextPage,
}: ProductGridProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  return (
    <>
      {/* Slim shimmer bar — visible only while switching categories (no layout shift) */}
      <div className="relative h-0.5 overflow-hidden">
        {isFetching && !isFetchingNextPage && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400 to-transparent animate-shimmer" />
        )}
      </div>

      {/* Product Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[2px] sm:gap-4 xl:max-w-[1440px] mx-auto p-1 sm:p-4 transition-opacity duration-300"
        style={{ opacity: isPlaceholderData ? 0.5 : 1 }}
      >
        {/* True first-load skeleton — only when no data exists at all */}
        {isLoading && !isPlaceholderData ? (
          <>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded overflow-hidden shadow-sm mt-3 sm:mt-0">
                <div className="aspect-square w-full bg-gray-200 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </>
        ) : products.length === 0 && !isFetching && (activeParentSlug || selectedChildCategory) ? (
          <div className="col-span-full flex flex-col items-center justify-center h-60 gap-3 text-gray-400">
            <PackageSearch className="w-12 h-12 text-gray-200" />
            <p className="text-sm font-medium">No products found in this category</p>
          </div>
        ) : (
          products.map((item) => (
            <div key={item._id} className="mt-3 sm:mt-0">
              <MainCard item={item} />
            </div>
          ))
        )}

        {/* Infinite scroll loader & end message */}
        <div
          ref={loaderRef}
          className="col-span-full flex flex-col justify-center items-center py-8 gap-2"
        >
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Loading more...
            </div>
          )}
          {!hasNextPage && products.length > 0 && !isPlaceholderData && (
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">You&apos;ve seen all products</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
