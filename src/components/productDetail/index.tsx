"use client";

import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import MobileSectionNav, {
  type SectionItem,
} from "./components/MobileSectionNav";

// Below-the-fold component (loaded after initial render)
const Tabs = lazy(() => import("./components/Tabs"));
const MobileSectionsContainer = lazy(
  () => import("./components/MobileSectionsContainer")
);

const MOBILE_SECTIONS: SectionItem[] = [
  { id: "mobile-section-overview", label: "Overview" },
  { id: "mobile-section-reviews", label: "Reviews" },
  { id: "mobile-section-description", label: "Description" },
  { id: "mobile-section-related", label: "Related" },
  { id: "mobile-section-recommended", label: "For You" },
];

interface ProductDetailProps {
  slug: string;
  initialData?: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ slug, initialData }) => {
  const { data, isLoading } = useGetProductDetailBySlug(slug, initialData);
  const [showBelowFold, setShowBelowFold] = useState(false);
  const [activeTab, setActiveTab] = useState("more to love");
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
    // On mobile: scroll to the reviews section
    const reviewsEl = document.getElementById("mobile-section-reviews");
    if (reviewsEl && window.innerWidth < 1024) {
      reviewsEl.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // On desktop: use tabs as before
    setShowBelowFold(true);
    setActiveTab("reviews");
    setTimeout(() => {
      tabsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  if (isLoading || !data) {
    return <ProductDetailSkeleton />;
  }

  return (
    <ErrorBoundary>
      {/* Mobile: Sticky Section Navigation */}
      <MobileSectionNav
        sections={MOBILE_SECTIONS}
        triggerElementId="mobile-section-overview"
      />

      <div className="container mx-auto">
        {/* Above-the-fold content — the "Overview" section */}
        <div
          id="mobile-section-overview"
          className="flex flex-col lg:flex-row lg:p-8 p-0"
        >
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

        {/* Below-the-fold trigger */}
        <div ref={belowFoldRef} className="h-1" />

        {/* ── DESKTOP: Original Tabs (hidden on mobile) ── */}
        <div ref={tabsSectionRef} className="hidden lg:block">
          {showBelowFold && (
            <Suspense
              fallback={<div className="h-40 justify-center items-center flex">Loading more to love...</div>}
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

      {/* ── MOBILE: AliExpress-style long-scroll sections ── */}
      {showBelowFold && (
        <Suspense
          fallback={
            <div className="lg:hidden flex justify-center items-center py-10">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
          }
        >
          <MobileSectionsContainer
            productSlug={slug}
            productId={data._id}
            description={data.description}
            productImages={data.images}
          />
        </Suspense>
      )}
    </ErrorBoundary>
  );
};

export default ProductDetail;
