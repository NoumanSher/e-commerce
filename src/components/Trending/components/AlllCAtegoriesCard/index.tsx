"use client";
import React, { memo, useEffect, useState } from "react";
import MainCard from "../../../Card/index";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchAllCategories } from "@/services/productsService";
import { Product } from "@/components/productDetail/productDetailDto";
import { useStore } from "@/Context/storeContext";
import { useRouter, useSearchParams } from "next/navigation";

const AllCAtegoriesCardSection = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const childCategoryID = searchParams.get("childCategoryID");
  const parentCategoryId = searchParams.get("parentCategoryID");
  const { selectedCategory, updateSelectedCategory } = useStore();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [childCategory, setChildCategory] = useState<any>([]);
  const [selectedChildCategory, setSelectedChildCategory] = useState<
    string | null
  >(null);

  // Initialize selectedChildCategory from URL params
  useEffect(() => {
    if (childCategoryID) {
      setSelectedChildCategory(childCategoryID);
    }
  }, [childCategoryID]);

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["products", selectedCategory, selectedChildCategory, page],
    queryFn: () =>
      fetchProducts(
        selectedCategory || (parentCategoryId as string),
        selectedChildCategory || (childCategoryID as string),
        page,
        10
      ),
    enabled:
      !!selectedCategory || !!parentCategoryId || !!selectedChildCategory,
    staleTime: 1000 * 60 * 5, // 5 min (data is fresh)
    gcTime: 1000 * 60 * 30, // 30 min in cache
  });

  const {
    data: allCategories,
    isLoading: allCategoriesLoading,
    error: allCategoriesError,
  } = useQuery({
    queryKey: ["allCategories"],
    queryFn: fetchAllCategories,
    staleTime: 1000 * 60 * 5, // 5 min (data is fresh)
    gcTime: 1000 * 60 * 30, // 30 min in cache
  });

  // Update product list when new data arrives
  useEffect(() => {
    if (productsData?.data) {
      if (page === 1) {
        setProducts(productsData.data);
      } else {
        setProducts((prev) => [...prev, ...productsData.data]);
      }
    }
  }, [productsData, page]);

  // Reset pagination on category change
  useEffect(() => {
    setPage(1);
    refetch();
  }, [selectedCategory, selectedChildCategory, refetch]);

  // Update child categories when parent category changes
  useEffect(() => {
    if (parentCategoryId || selectedCategory) {
      const categoryId = selectedCategory || parentCategoryId;
      const foundCategory = allCategories?.categories.find(
        (cat) => cat._id === categoryId
      );
      const children = foundCategory?.children || [];
      setChildCategory(children);

      // Reset selected child category when parent changes
      if (selectedCategory && selectedCategory !== parentCategoryId) {
        setSelectedChildCategory(null);
      }
    }
  }, [allCategories?.categories, parentCategoryId, selectedCategory]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
  };

  const handleParentCategoryClick = (categoryId: string) => {
    updateSelectedCategory(categoryId);
    router.push(`/pages/all-products?parentCategoryID=${categoryId}`);
  };

  const handleChildCategoryClick = (categoryId: string) => {
    setSelectedChildCategory(categoryId);
    router.push(`/pages/all-products?childCategoryID=${categoryId}`);
  };

  if (productsError) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="lg:mx-20 mx-4">
      <div className=" border-2 border-gray-300 p-2 mt-5">
        <div className="bg-gray-300 p-4">
          <h1
            className="text-3xl md:text-6xl font-bold text-start my-4 lg:my-8 text-gray-800 
           font-serif tracking-wide transition-all duration-300 
            hover:text-gray-600 
           hover:drop-shadow-lg"
          >
            SHOP
          </h1>
          <div className=" flex gap-2">
            {allCategories?.categories.toReversed().map((category) => (
              <div
                key={category._id}
                onClick={() => handleParentCategoryClick(category._id)}
                className={`cursor-pointer ${
                  (selectedCategory || parentCategoryId) === category._id
                    ? "font-bold"
                    : ""
                }`}
              >
                {category.name}
              </div>
            ))}
          </div>

          {childCategory.length > 0 && (
            <div className=" flex gap-2">
              {childCategory.map((category: any) => (
                <div
                  key={category._id}
                  onClick={() => handleChildCategoryClick(category._id)}
                  className={`cursor-pointer ${
                    (selectedChildCategory || childCategoryID) === category._id
                      ? "font-bold underline"
                      : ""
                  }`}
                >
                  {category.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap xl:max-w-[1440px] mx-auto xl:mt-14 relative">
        {(productsLoading || isFetching || loadingMore) && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-10">
            <div className="text-white text-xl">Loading Products...</div>
          </div>
        )}

        {products.map((item) => (
          <div key={item._id} className="w-[50%] md:!w-[33.333%] lg:!w-[25%] lg:mt-0 mt-5">
            <MainCard item={item} />
          </div>
        ))}
      </div>

      {(productsData?.pagination?.totalProducts ?? 0) > products.length && (
        <div className="flex justify-center items-center mb-5">
          <button
            onClick={handleLoadMore}
            disabled={isFetching}
            className="flex justify-center items-center bg-blue-500 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
          >
            {isFetching ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(AllCAtegoriesCardSection);
