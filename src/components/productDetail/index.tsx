"use client";

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useGetProductDetailBySlug } from "./productDetailQuery";
import ProductDetailSkeleton from "./components/ProductDetailSkeleton";
import { useInView } from "react-intersection-observer";
import { AuthModal } from "../AuthModal";
import type { Product } from "./productDetailDto";
// Above-the-fold components
// Critical components loaded immediately
import ProductImageGallery from "@/components/Gallery";
import ProductInfo from "@/components/productDetail/ProductDetails";
import { useAppUIContext } from "@/context/AppUIContext";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// Below-the-fold component (loaded after initial render)
const Tabs = lazy(() => import("./components/Tabs"));

interface ProductDetailProps {
  slug: string;
  initialData?: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ slug, initialData }) => {
  const { data, isLoading } = useGetProductDetailBySlug(slug, initialData);
  const [showBelowFold, setShowBelowFold] = useState(false);
  const [activeTab, setActiveTab] = useState("related products");
  const tabsSectionRef = useRef<HTMLDivElement>(null);
  const { updateSelectedCategory } = useAppUIContext();
  const [galleryHandlers, setGalleryHandlers] = useState<{
    handleAddToCart: () => void;
    handleCheckout: () => void;
    availableStock: number;
  } | null>(null);

  const { ref: belowFoldRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (data?.parentCategorySlug) {
      updateSelectedCategory(data?.parentCategorySlug);
    }
  }, [data, updateSelectedCategory]);

  useEffect(() => {
    if (inView) {
      setShowBelowFold(true);
    }
  }, [inView]);

  const handleReviewClick = useCallback(() => {
    // 1. Force the below-fold section to render
    setShowBelowFold(true);
    // 2. Switch to the reviews tab
    setActiveTab("reviews");
    // 3. Scroll to the tabs section after a short delay to allow rendering
    setTimeout(() => {
      tabsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);
  if (isLoading || !data) {
    return <ProductDetailSkeleton />;
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto">
        {/* Above-the-fold content */}
        {/* <Suspense fallback={<ProductDetailSkeleton />}> */}
        <div className="flex flex-col lg:flex-row lg:p-8 p-0">
          <ProductImageGallery
            productName={data.productName}
            images={data.images ?? []}
            onAddToCart={galleryHandlers?.handleAddToCart}
            onBuyNow={galleryHandlers?.handleCheckout}
            availableStock={galleryHandlers?.availableStock}
          />
          <ProductInfo
            product={data}
            onGalleryHandlersReady={setGalleryHandlers}
            onReviewClick={handleReviewClick}
          />
        </div>
        {/* </Suspense> */}

        {/* Below-the-fold trigger */}
        <div ref={belowFoldRef} className="h-1" />

        {/* Below-the-fold content */}
        <div ref={tabsSectionRef}>
          {showBelowFold && (
            <Suspense
              fallback={<div className="h-40 justify-center items-center flex">Loading related products...</div>}
            >
              <Tabs
                productSlug={slug}
                productId={data._id}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </Suspense>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProductDetail;
