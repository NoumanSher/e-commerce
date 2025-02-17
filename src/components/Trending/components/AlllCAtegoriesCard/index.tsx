"use client";
import React, { memo, useEffect, useState } from "react";
import MainCard from "../../../Card/index";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, Product } from "@/services/productsService";
import { useStore } from "@/Context/storeContext";

const AllCAtegoriesCardSection = () => {
  const { selectedCategory } = useStore();
  const [page, setPage] = useState(1); // Track current page
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingMore, setLoadingMore] = useState(false); // State to track loading more

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["products", selectedCategory, page],
    queryFn: () => fetchProducts(selectedCategory as string, page, 10,), // Fetch 3 products each time
    enabled: !!selectedCategory, // Ensures query doesn't run if there's no selected category
    staleTime: 0,
  });

  // Update product list when new data arrives
  useEffect(() => {
    if (productsData?.data) {
      if (page === 1) {
        setProducts(productsData.data); // Replace when first loading
      } else {
        setProducts((prev) => [...prev, ...productsData.data]); // Append new data
      }
    }
  }, [productsData, page]);

  // Reset pagination on category change
  useEffect(() => {
    setPage(1);
    refetch();
  }, [selectedCategory, refetch]);

  const handleLoadMore = () => {
    setLoadingMore(true); // Start loading more
    setPage((prevPage) => prevPage + 1); // Increment page for next batch
  };

  // Handle when more data is fetched
  useEffect(() => {
    if (productsData && !isFetching) {
      setLoadingMore(false); // Stop loading when data is fetched
    }
  }, [productsData, isFetching]);

  if (productsError) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="">
      <div className="flex flex-wrap xl:max-w-[1440px] mx-auto xl:mt-14 relative">
        {(productsLoading || isFetching || loadingMore) && (
          // Loader overlay
          <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-10">
            <div className="text-white text-xl">Loading Products...</div>
          </div>
        )}

        {products.map((item) => (
          <div key={item.id} className="w-[50%] md:!w-[33.333%] lg:!w-[25%]">
            <MainCard item={item} />
          </div>
        ))}
      </div>

      {/* Load More Button (Fixed) */}
      {(productsData?.pagination?.totalProducts ?? 0) > products.length && (
        <>
          <div className="flex justify-center items-center mb-5">
            <button
              onClick={handleLoadMore}
              className="flex justify-center items-center  bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              {isFetching ? "Loading..." : "Load More"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(AllCAtegoriesCardSection);
