"use client";
import React, { memo, useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useStore } from "@/Context/storeContext";

const ProductsCategories = () => {
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { updateSelectedCategory, selectedCategory } = useStore();
  useEffect(() => {
    
    if (categoriesData?.categories && categoriesData.categories.length > 0) {
      updateSelectedCategory(categoriesData.categories[categoriesData.categories.length - 1]._id);
    }
  }, [categoriesData, updateSelectedCategory]);
  if (categoriesError) return <div>Error loading categories</div>;

  return (
    <div>
      <div>
        <h1 className="text-[26px] xl:text-[32px] !font-normal leading-[1.2em] xl:leading-[1.5em] !mb-1 text-center">
          Trending
        </h1>
      </div>
      <div className="xl:mt-8">
        {categoriesLoading ? (
          <div className="flex justify-center">Loading Categories...</div>
        ) : (
          <ul className="flex flex-wrap justify-center mb-[1rem] mt-2">
            {categoriesData?.categories?.slice(0, 4).reverse().map((item) => (
              <li key={item._id}>
                <span
                  onClick={() => updateSelectedCategory(item._id)}
                  className={`relative mx-[25px] text-[#767676] hover:text-black cursor-pointer mt-[11px] pb-[9px] ${
                    selectedCategory === item._id ? "text-black font-bold" : ""
                  } leading-[1.375em] text-[14px] xl:text-[16px] font-medium uppercase group`}
                >
                  {item.name}
                  <span
                    className={`absolute left-0 bottom-0 sm:h-[2.5px] bg-[#222222] transition-all duration-500 ease-in-out origin-bottom-left ${
                      selectedCategory === item._id
                        ? "w-full scale-x-100"
                        : "w-0 group-hover:w-full group-hover:scale-x-100 scale-x-0"
                    }`}
                  ></span>{" "}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default memo(ProductsCategories);
