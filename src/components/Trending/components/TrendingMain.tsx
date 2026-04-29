import React, { memo, lazy, Suspense } from "react";
import "./styles.css";
import ProductsCategories from "./ProductsCategories";
import ProductsCard from "./ProductsCard";
const AllProductBtn = lazy(() => import("../../specific/allProductBtn"));

const TrendingMain = () => {
  return (
    <>
      <div className="bg-[#faf9f8] px-1 md:px-6 mx-auto pt-4 md:pt-7">
        <div>
          <ProductsCategories />
          <ProductsCard />
          <Suspense fallback={<div className="h-10 w-40 bg-gray-200 rounded animate-pulse mx-auto mt-4" />}>
            <AllProductBtn />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default memo(TrendingMain);
