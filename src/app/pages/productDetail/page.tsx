import React, { Suspense, lazy } from "react";
const ProductDetailComponet = lazy(() => import("@/components/productDetail"));

export default function ProductDetail() {
  return (
    <Suspense fallback={".....loading detail"}>
      <ProductDetailComponet />
    </Suspense>
  );
}
