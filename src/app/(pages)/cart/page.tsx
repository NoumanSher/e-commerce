import React, { Suspense, lazy } from "react";

const CartScreen = lazy(() => import("@/components/screen/cart"));
import Loader from "@/components/Loader";
export default function CartPage() {
  return (
    <Suspense fallback={<Loader />}>
      <CartScreen />
    </Suspense>
  );
}
