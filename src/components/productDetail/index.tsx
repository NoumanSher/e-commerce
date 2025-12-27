"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { useGetProductDetailBySlug } from "./productDetailQuery";
import ProductDetailSkeleton from "./components/ProductDetailSkeleton";
import { useInView } from "react-intersection-observer";

// Above-the-fold components
// Critical components loaded immediately
import ProductImageGallery from "@/components/gallery";
import ProductInfo from "@/components/productDetail/ProductDetails";
import { useStore } from "@/Context/storeContext";

// Below-the-fold component (loaded after initial render)
const Tabs = lazy(() => import("./components/Tabs"));

interface ProductDetailProps {
  slug: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ slug }) => {
  const { data, isLoading } = useGetProductDetailBySlug(slug);
  const [showBelowFold, setShowBelowFold] = useState(false);
  const { updateSelectedCategory } = useStore();

  const { ref: belowFoldRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (data?.parentCategoryID) {

      updateSelectedCategory(data?.parentCategoryID);
    }
  }, [data, updateSelectedCategory]);

  useEffect(() => {
    if (inView) {
      setShowBelowFold(true);
    }
  }, [inView]);
  if (isLoading || !data) {
    return <ProductDetailSkeleton />;
  }

  return (
    <div className="lg:p-8 p-4 container mx-auto">
      {/* Above-the-fold content */}
      {/* <Suspense fallback={<ProductDetailSkeleton />}> */}
      <div className="flex flex-col lg:flex-row">
        <ProductImageGallery productName={data.productName} images={data.images ?? []} />
        <ProductInfo product={data} />
      </div>
      {/* </Suspense> */}

      {/* Below-the-fold trigger */}
      <div ref={belowFoldRef} className="h-1" />

      {/* Below-the-fold content */}
      {showBelowFold && (
        <Suspense
          fallback={<div className="h-40">Loading related products...</div>}
        >
          <Tabs productId={slug} />
        </Suspense>
      )}
    </div>
  );
};

export default ProductDetail;
