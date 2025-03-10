"use client";
import React, { memo, useEffect } from "react";

import MainCard from "../../Card/index";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/productsService";
import { useStore } from "@/Context/storeContext";

const ProductsCard = () => {
  const { selectedCategory } = useStore();

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () => fetchProducts(selectedCategory as string),
    enabled: !!selectedCategory, // Ensures query doesn't run if there's no selected category
    staleTime: Infinity,
  });
  useEffect(() => {
    if (selectedCategory) {
      refetch();
    }
  }, [selectedCategory, refetch]);

  if (productsError) {
    return <div>Error loading products</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap xl:max-w-[1440px] mx-auto xl:mt-14">
        {isFetching ? (
          <div>Loading Products...</div>
        ) : (
          productsData?.data.slice(0, 8).map((item) => (
            <div key={item.id} className="w-[50%] md:!w-[33.333%] lg:!w-[25%]">
              <MainCard item={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default memo(ProductsCard);
