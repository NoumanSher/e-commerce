"use client";

import { useWishlist } from "@/components/hooks/useWishlist";
import React, { Suspense, lazy, useEffect } from "react";

const ProductsCard = lazy(
  () => import("@/components/Trending/components/ProductsCard")
);

export default function WishListPage() {
  const { wishlist } = useWishlist();

  return (
    <>
      <Suspense fallback={<div>Loading Wish list .........</div>}>
        <h1 className="text-3xl text-primary text-center mt-5">Wish List</h1>
        <ProductsCard products={wishlist} />
      </Suspense>
    </>
  );
}
