import React, { Suspense, lazy } from "react";

const CartScreen = lazy(() => import("@/components/screen/cart"));

export default function CartPage() {
  return (
    <Suspense fallback={".....loading detail"}>
      <CartScreen />
    </Suspense>
  );
}
