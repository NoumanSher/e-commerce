import React, { Suspense, lazy } from "react";

const AllCategoriesCardSection = lazy(() => import("@/components/Trending/components/AlllCAtegoriesCard"));

export default function AllProducts() {
  return (
    <>
      <Suspense fallback={<div>Loading All Products</div>}>
        <AllCategoriesCardSection />
      </Suspense>
    </>
  );
}

