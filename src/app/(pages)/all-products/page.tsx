import React, { Suspense, lazy } from "react";

const AllProductsMain = lazy(() => import("@/components/all-products"));

export default function AllProducts() {
  return (
    <>
      <Suspense fallback={<div>Loading All Products</div>}>
        <AllProductsMain />
      </Suspense>
    </>
  );
}

