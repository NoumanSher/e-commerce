
import React, { lazy, Suspense } from "react";
const ProductDetailComponet = lazy(() => import("@/components/productDetail"));

export default function ProductDetail() {
  return (
    <Suspense fallback={".....loading detail"}>
      <ProductDetailComponet />
   </Suspense>
  );
}
