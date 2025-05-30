"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { useGetProductDetailById } from "./productDetailQuery";
import ProductDetailSkeleton from "./components/ProductDetailSkeleton";

// Above-the-fold components
const ProductImageGallery = lazy(() => import("@/components/gallery"));
const ProductInfo = lazy(() => import("@/components/productDetail/ProductDetails"));

// Below-the-fold component (loaded after initial render)
const RelatedProducts = lazy(() => import("./components/Tabs"));

interface ProductDetailProps {
  productId: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const { data, isLoading } = useGetProductDetailById(productId);
  const [showRelatedProducts, setShowRelatedProducts] = useState(false);

  useEffect(() => {
    // Load related products after main content is rendered
    const timer = setTimeout(() => {
      setShowRelatedProducts(true);
    }, 0); // Using 0ms to leverage browser's idle time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !data) {
    return <ProductDetailSkeleton />;
  }

  return (
    <div className="lg:p-8 p-4 container mx-auto">
      {/* Above-the-fold content */}
      <Suspense fallback={<ProductDetailSkeleton />}>
        <div className="flex flex-col lg:flex-row">
          <ProductImageGallery images={data.data.images ?? []} />
          <ProductInfo product={data.data} />
        </div>
      </Suspense>

      {/* Below-the-fold content (lazy loaded) */}
      {showRelatedProducts && (
        <Suspense fallback={<div className="h-40">Loading related products...</div>}>
          <RelatedProducts productId={productId} />
        </Suspense>
      )}
    </div>
  );
};

export default ProductDetail;