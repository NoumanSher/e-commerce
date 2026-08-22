"use client";

import React, { Suspense, lazy } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import Loader from "@/components/Loader";
import { AuthModal } from "@/components/AuthModal";

const WishCardList = lazy(() => import("./WishCardList"));

export default function WishListClient() {
  const { wishlist } = useWishlist();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <WishCardList products={wishlist} />
      </Suspense>
      <AuthModal />
    </>
  );
}
