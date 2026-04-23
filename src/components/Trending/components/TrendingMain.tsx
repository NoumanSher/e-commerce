import React, { memo, lazy, Suspense } from "react";
import "./styles.css";
import ProductsCatgories from "./ProductsCatgories";
import ProductsCard from "./ProductsCard";
const AllProductBtn = lazy(() => import("../../specific/allProductBtn"));

const TrendingMain = () => {
  return (
    <>
      <div className="bg-[#faf9f8] px-4 md:px-6 mx-auto pt-7">
        <div>
            <ProductsCatgories />
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
