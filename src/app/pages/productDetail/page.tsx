
import React from "react";
import ProductDetailComponet from '@/components/productDetail'
// const ProductDetailComponet = lazy(() => import("@/components/productDetail"));

export default function ProductDetail() {
  return (
    // <Suspense fallback={".....loading detail"}>
      <ProductDetailComponet />
    // </Suspense>
  );
}
