"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import { useCategoriesQuery, useProductsQuery } from "@/hooks/useProductsQuery";
import type { Product } from "@/components/productDetail/productDetailDto";
import CategorySlider from "@/components/CategorySlider/CategorySlider";

const ITEMS_PER_PAGE = 6;

// ── Skeleton card ───────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="aquamist-loader-card aspect-[3/4] rounded-[20px] bg-white/5 border border-white/10 animate-pulse" />
  );
}

// ── Error state ─────────────────────────────────────────────────────────────
function ProductsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center border border-white/10 rounded-[20px] bg-white/3 backdrop-blur-md max-w-lg mx-auto">
      <span className="material-symbols-outlined text-6xl text-rose-400/70">
        cloud_off
      </span>
      <div>
        <p className="font-inter text-aq-on-surface font-semibold mb-1">
          Failed to load products
        </p>
        <p className="font-inter text-sm text-aq-on-surface-variant">
          Please check your connection and try again.
        </p>
      </div>
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

export default function AquaMistCollectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("parentCategorySlug") || "All";
  const [activeFilter, setActiveFilter] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const productGridRef = useRef<HTMLDivElement>(null);

  // Scroll back to product grid top whenever page changes
  useEffect(() => {
    if (productGridRef.current) {
      productGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  // Sync filter when the URL query changes (e.g. footer nav → category)
  useEffect(() => {
    const slug = searchParams.get("parentCategorySlug") || "All";
    setActiveFilter(slug);
    setPage(1);
  }, [searchParams]);

  // Fetch parent categories dynamically — only active ones
  const { data: categoriesResponse } = useCategoriesQuery();
  const categories = useMemo(
    () => (categoriesResponse?.categories || []).filter((c) => c.isActive !== false),
    [categoriesResponse]
  );

  // Dynamically generate filter tabs (kept for potential future use)
  const _FILTER_TABS = useMemo(() => {
    return [
      { label: "All", slug: "All" },
      ...categories.map((c) => ({ label: c.name, slug: c.slug })),
    ];
  }, [categories]);

  // Fetch dynamic products based on active category and page
  const {
    data: productsResponse,
    isLoading,
    isError,
    refetch,
  } = useProductsQuery({
    categorySlug: activeFilter === "All" ? undefined : activeFilter,
    page,
    limit: ITEMS_PER_PAGE,
    mode: "client",
  });

  // Real products only — no static fallback
  const displayProducts = useMemo<Product[]>(() => {
    return productsResponse?.data ?? [];
  }, [productsResponse?.data]);

  const totalProducts = productsResponse?.pagination?.totalProducts ?? 0;
  const totalPages = productsResponse?.pagination?.totalPages ?? 1;

  const handleFilterChange = (slug: string) => {
    setActiveFilter(slug);
    setPage(1);
    // Keep URL in sync so the filter is shareable and back-nav works
    if (slug === "All") {
      router.push("/collections", { scroll: false });
    } else {
      router.push(`/collections?parentCategorySlug=${slug}`, { scroll: false });
    }
  };

  // ── Render product grid content ─────────────────────────────────────────
  function renderGrid() {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {[...Array(6)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (isError) {
      return <ProductsError onRetry={() => refetch()} />;
    }

    if (displayProducts.length === 0) {
      return (
        <div className="text-center py-24 border border-white/10 rounded-[20px] bg-white/3 backdrop-blur-md max-w-lg mx-auto">
          <span className="material-symbols-outlined text-6xl text-aq-on-surface-variant mb-4 block">
            inventory_2
          </span>
          <p className="font-inter text-aq-on-surface-variant font-medium">
            {activeFilter === "All"
              ? "No products available yet. Check back soon!"
              : `No products in "${activeFilter}" yet.`}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 animate-fadeIn">
        {displayProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <main className="flex-grow pt-[120px] pb-12 px-5 md:px-20 max-w-[1280px] mx-auto w-full">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <header className="text-center mb-12">
        <span className="inline-block font-inter text-[14px] font-semibold tracking-[0.2em] text-aq-primary mb-3 uppercase">
          Explore
        </span>
        <h1 className="font-eb-garamond text-[40px] md:text-[48px] leading-[48px] md:leading-[56px] text-aq-on-surface mb-3">
          Our Collections
        </h1>
        {/* Show total product count when loaded */}
        {!isLoading && !isError && totalProducts > 0 && (
          <p className="font-inter text-sm text-aq-on-surface-variant">
            {totalProducts} product{totalProducts !== 1 ? "s" : ""} available
          </p>
        )}
      </header>

      {/* ── Category Slider Carousel ────────────────────────────────────────── */}
      <div className="mb-8">
        <CategorySlider
          theme="aquamist"
          onSelectCategory={handleFilterChange}
          title=""
        />
        {activeFilter !== "All" && (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => handleFilterChange("All")}
              className="text-xs font-semibold uppercase tracking-wider text-sky-400 hover:text-sky-300 underline underline-offset-4 transition-colors"
            >
              Clear Filter (Show All Products)
            </button>
          </div>
        )}
      </div>

      {/* ── Product Grid ─────────────────────────────────────────────────── */}
      <div ref={productGridRef} className="scroll-mt-32" />
      {renderGrid()}

      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="aq-glass-panel rounded-full px-4 py-2 flex items-center gap-4 border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-aq-on-surface/50 hover:text-aq-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center p-1"
              aria-label="Previous page"
            >
              <span className="material-symbols-outlined text-xl">
                chevron_left
              </span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={[
                  "w-8 h-8 rounded-full font-inter text-sm font-semibold flex items-center justify-center transition-all duration-300",
                  n === page
                    ? "bg-aq-primary text-aq-on-primary shadow-[0_0_10px_rgba(56,189,248,0.25)]"
                    : "text-aq-on-surface hover:text-aq-primary hover:bg-white/5",
                ].join(" ")}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-aq-on-surface/50 hover:text-aq-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center p-1"
              aria-label="Next page"
            >
              <span className="material-symbols-outlined text-xl">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
