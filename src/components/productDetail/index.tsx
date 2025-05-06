"use client";

import { lazy, Suspense } from "react";
import { useGetProductDetailById } from "./productDetailQuery";
import ProductDetailSkeleton from "./components/ProductDetailSkeleton";

const ProductImageGallery = lazy(() => import("@/components/gallery"));

const ProductInfo = lazy(
  () => import("@/components/productDetail/ProductDetails")
);

interface ProductDetailProps {
  productId: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const { data, isLoading } = useGetProductDetailById(productId);

  if (isLoading || !data) {
    return <ProductDetailSkeleton />;
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <div className="flex flex-col lg:flex-row lg:p-8 p-4 container mx-auto">
        <ProductImageGallery images={data.data.images ?? []} />
        <ProductInfo product={data.data} />
      </div>
    </Suspense>
  );
};

export default ProductDetail;
