"use client";
import React, { memo, useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useAppUIContext } from "@/context/AppUIContext";

const ProductsCategories = () => {
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { updateSelectedCategory, selectedCategory, isHydrated } = useAppUIContext();

  useEffect(() => {
    // Only set a default category if the store is hydrated 
    // AND we have categories data available
    if (isHydrated && categoriesData?.categories && categoriesData.categories.length > 0) {
      // Check if current selectedCategory exists in the fetched list
      const categoryExists = categoriesData.categories.some(
        (cat) => cat.slug === selectedCategory
      );

      // If no category is selected, OR the selected category doesn't exist anymore (Sync sync)
      if (!selectedCategory || !categoryExists) {
        updateSelectedCategory(categoriesData.categories[0].slug);
      }
    }
  }, [isHydrated, categoriesData, selectedCategory, updateSelectedCategory]);
  if (categoriesError) return (
    <div className="flex justify-center items-center py-4 text-sm text-red-500 gap-2">
      <span>⚠</span> <span>Could not load categories. Please refresh.</span>
    </div>
  );

  return (
    <div>
      <div>
        <h2 className="text-[26px] xl:text-[32px] font-light leading-[1.2em] xl:leading-[1.5em] mb-1 text-center tracking-wide">
          Trending
        </h2>
        <div className="flex justify-center mb-1">
          <span className="block w-10 h-[2px] bg-black rounded-full" />
        </div>
      </div>
      <div className="xl:mt-8">
        {categoriesLoading ? (
          <div className="flex flex-wrap justify-center gap-3 mb-4 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 w-24 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 mt-4">
            {categoriesData?.categories?.slice(0, 4).map((item) => (
              <li key={item._id}>
                <button
                  onClick={() => updateSelectedCategory(item.slug)}
                  className={`
                    px-5 py-2 rounded-full text-[13px] sm:text-[14px] font-semibold uppercase tracking-wide
                    border transition-all duration-200
                    ${selectedCategory === item.slug
                      ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-700 hover:text-gray-900"
                    }
                  `}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default memo(ProductsCategories);
