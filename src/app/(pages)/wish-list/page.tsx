"use client";

import React, { Suspense, lazy } from "react";
import { useWishlist } from "@/components/hooks/useWishlist";
import Loader from "@/components/Loader";
const WishCardList = lazy(
  () => import("./WishCardList")
);

export default function WishListPage() {
  const { wishlist } = useWishlist();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <WishCardList products={wishlist} />
      </Suspense>
    </>
  );
}
