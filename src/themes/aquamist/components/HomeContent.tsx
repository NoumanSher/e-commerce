"use client";

import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useCategories } from "@/hooks/useCategories";
import type { Product } from "@/components/productDetail/productDetailDto";
import CategorySlider from "@/components/CategorySlider/CategorySlider";
import AquaMistFaqSection from "./FaqSection";
import { useAppUIContext } from "@/context/AppUIContext";
import { queryKeys } from "@/lib/queryKeys";
import { productsService } from "@/services/productsService";
import { STALE_TIMES, CACHE_TIMES } from "@/lib/queryClient";
import WhatsAppFloatingButton from "@/components/common/WhatsAppFloatingButton";

const PRESS = ["Forbes", "Vogue Living", "TechCrunch"];

// ── Skeleton card ───────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="aspect-[3/4] rounded-[20px] bg-white/5 border border-white/10 animate-pulse" />
  );
}

// ── Error state ─────────────────────────────────────────────────────────────
function ProductsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="col-span-3 flex flex-col items-center justify-center py-20 gap-5 text-center">
      <span className="material-symbols-outlined text-6xl text-rose-400/70">
        cloud_off
      </span>
      <p className="font-inter text-aq-on-surface-variant font-medium">
        Couldn&apos;t load products. Please check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 bg-aq-primary-container text-aq-on-primary-container px-6 py-2.5 rounded-full font-inter text-sm font-semibold tracking-wider hover:bg-aq-primary transition-all duration-300"
      >
        <span className="material-symbols-outlined text-[18px]">refresh</span>
        Retry
      </button>
    </div>
  );
}

export default function AquaMistHomeContent() {
  const { data: categoriesData } = useCategories();
  const { selectedCategory, isHydrated } = useAppUIContext();

  // Find first active category by default
  const firstCategory = useMemo(() => {
    const all = categoriesData?.categories || [];
    const active = all
      .filter((cat) => cat.isActive !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    return active[0] || null;
  }, [categoriesData?.categories]);

  // By default, select first category if none is explicitly selected
  const activeCategory = (isHydrated && selectedCategory) ? selectedCategory : firstCategory?.slug || null;

  const activeCategoryName = useMemo(() => {
    if (!activeCategory) return null;
    const found = categoriesData?.categories?.find((c) => c.slug === activeCategory);
    return found?.name || activeCategory;
  }, [categoriesData?.categories, activeCategory]);

  const router = useRouter();
  const queryClient = useQueryClient();
  const [isNavLoading, setIsNavLoading] = useState(false);

  // Ref to the products section — used to scroll into view on category select
  const productsSectionRef = useRef<HTMLElement>(null);

  // Query live products matching selected category if set
  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useProductsQuery({
    categorySlug: activeCategory || undefined,
    page: 1,
    limit: 6,
    mode: "client",
  });

  // Real products from API only — no static fallback
  const products = useMemo<Product[]>(() => {
    if (productsData?.data && productsData.data.length > 0) {
      return productsData.data.slice(0, 6);
    }
    return [];
  }, [productsData]);

  // Scroll to products section ONLY when user explicitly clicks a category
  const handleCategorySelect = useCallback((_slug: string) => {
    setTimeout(() => {
      productsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  // Build the collections URL: forward selected category if present
  const collectionsHref = activeCategory
    ? `/collections?parentCategorySlug=${activeCategory}`
    : "/collections";

  // Prefetch on hover — same pattern as AllProductBtn
  const handleCollectionsPrefetch = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.categories.all(),
      queryFn: () => productsService.fetchAllCategories(),
      staleTime: STALE_TIMES.infinite,
      gcTime: CACHE_TIMES.infinite,
    });
    if (activeCategory) {
      queryClient.prefetchInfiniteQuery({
        queryKey: ["products", { parent: activeCategory, child: null }],
        queryFn: ({ pageParam = 1 }) =>
          productsService.fetchProducts({
            categorySlug: activeCategory,
            page: pageParam as number,
            limit: 12,
            mode: "client",
          }),
        initialPageParam: 1,
      });
    }
    router.prefetch(collectionsHref);
  }, [queryClient, router, activeCategory, collectionsHref]);

  const handleCollectionsClick = useCallback(() => {
    setIsNavLoading(true);
    router.push(collectionsHref);
  }, [router, collectionsHref]);

  // ── Render product grid content ─────────────────────────────────────────
  function renderProducts() {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(3)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="grid grid-cols-1">
          <ProductsError onRetry={() => refetch()} />
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <span className="material-symbols-outlined text-5xl text-aq-on-surface-variant/50">
            inventory_2
          </span>
          <p className="font-inter text-aq-on-surface-variant font-medium">
            {activeCategory
              ? `No products found in "${activeCategory}" yet.`
              : "No products available right now. Check back soon!"}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 animate-fadeIn">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* ── Category Slider Carousel ────────────────────────────────────────── */}
      <section className="pt-12 pb-4">
        <CategorySlider
          theme="aquamist"
          title="Shop by Category"
          navigateOnClick={false}
          onSelectCategory={handleCategorySelect}
        />
      </section>

      {/* ── Best Sellers / Featured Grid ─────────────────────────────────── */}
      <section ref={productsSectionRef} className="py-20 px-5 md:px-20 max-w-[1280px] mx-auto scroll-mt-24">
        <div className="text-center mb-14">
          <span
            className="text-aq-primary-container font-inter text-[14px] tracking-[0.2em] font-semibold block mb-3 uppercase"
            suppressHydrationWarning
          >
            {activeCategoryName ? `Category: ${activeCategoryName}` : "FEATURED PRODUCTS"}
          </span>
          <h2
            className="font-eb-garamond text-[40px] md:text-[48px] leading-[48px] md:leading-[56px] text-aq-on-surface"
            suppressHydrationWarning
          >
            {"Explore Featured Products"}
          </h2>
        </div>

        {renderProducts()}

        {/* ── See All Collections Button ───────────────────────────────── */}
        {!isError && (
          <div className="flex justify-center mt-14">
            <button
              onClick={handleCollectionsClick}
              onMouseEnter={handleCollectionsPrefetch}
              onTouchStart={handleCollectionsPrefetch}
              disabled={isNavLoading || isLoading}
              className="inline-flex items-center gap-2.5 bg-aq-primary-container text-aq-on-primary-container px-8 py-3.5 rounded-full font-inter text-sm font-semibold tracking-widest hover:bg-aq-primary transition-all duration-300 shadow-[0_0_20px_rgba(125,232,216,0.25)] hover:shadow-[0_0_30px_rgba(125,232,216,0.45)] hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isNavLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Loading…</span>
                </>
              ) : (
                <>
                  <span>{activeCategoryName ? `See All in ${activeCategoryName}` : "See All Collections"}</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </section>

      {/* ── Press Strip ──────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-white/10 bg-aq-surface-container-lowest/50">
        <div className="max-w-[1280px] mx-auto px-5 md:px-20 text-center">
          <p className="text-aq-on-surface-variant font-inter text-sm mb-8 tracking-widest font-semibold">
            AS SEEN IN
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {PRESS.map((name) => (
              <span
                key={name}
                className="font-eb-garamond text-2xl font-bold text-aq-on-surface"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ────────────────────────────────────────────────── */}
      <AquaMistFaqSection />

      {/* ── WhatsApp Floating Action Button ────────────────────────────── */}
      <WhatsAppFloatingButton />
    </>
  );
}
