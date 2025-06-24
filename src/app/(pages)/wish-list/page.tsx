"use client";

import React, { Suspense, lazy } from "react";
import { useWishlist } from "@/components/hooks/useWishlist";
// import WishCardList from "./WishCardList";
const WishCardList = lazy(
  () => import("./WishCardList")
);

export default function WishListPage() {
  const { wishlist } = useWishlist();

  return (
    <>
      <Suspense fallback={<div>Loading Wish list .........</div>}>
        <h1 className="text-3xl text-primary text-center mt-5">Wish List</h1>
        <WishCardList products={wishlist} />
      </Suspense>
    </>
  );
}
