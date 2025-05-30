import React, { memo, lazy, Suspense } from "react";
import "./styles.css";
// const BannerProducts = lazy(() => import("./BannerProducts"));
const ProductsCatgories = lazy(() => import("./ProductsCatgories"));
const ProductsCard = lazy(() => import("./ProductsCard"));
const AllProductBtn = lazy(() => import("../../specific/allProductBtn"));

const TrendingMain = () => {
  return (
    <>
      <div className="bg-[#faf9f8] px-4 md:px-6 mx-auto pt-7">
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <ProductsCatgories />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <ProductsCard />
            <AllProductBtn />
          </Suspense>
        </div>
        {/* <Suspense fallback={<div>Loading...</div>}>
          <BannerProducts />
        </Suspense> */}
      </div>
    </>
  );
};

export default memo(TrendingMain);
