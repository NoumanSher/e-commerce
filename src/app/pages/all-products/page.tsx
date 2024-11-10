import React, { Suspense, lazy } from "react";
const ProductsCard = lazy(
  () => import("@/components/Trending/components/ProductsCard")
);

export default function AllProducts() {
  return (
    <>
      <Suspense fallback={<div>Loading All Products</div>}>
        <h1 className="text-primary text-2xl text-center mt-5">All produts here</h1>
        <ProductsCard />
      </Suspense>
    </>
  );
}
