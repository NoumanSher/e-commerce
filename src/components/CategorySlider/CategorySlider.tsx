"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Folder } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useAppUIContext } from "@/context/AppUIContext";

interface CategorySliderProps {
  theme?: "default" | "aquamist";
  onSelectCategory?: (slug: string) => void;
  navigateOnClick?: boolean;
  title?: string;
  subtitle?: string;
}

function CategorySliderContent({
  theme = "default",
  onSelectCategory,
  navigateOnClick = false,
  title = "Shop by Category",
  subtitle,
}: CategorySliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categoriesData, isLoading, error } = useCategories();
  const { selectedCategory, updateSelectedCategory } = useAppUIContext();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Filter active categories and sort by sortOrder
  const activeCategories = useMemo(() => {
    const all = categoriesData?.categories || [];
    return all
      .filter((cat) => cat.isActive !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [categoriesData?.categories]);

  // Active category from URL query or Context state, defaulting to first category
  const defaultFirstSlug = activeCategories[0]?.slug;
  const currentCategorySlug = searchParams.get("parentCategorySlug") || selectedCategory || defaultFirstSlug;

  // Check scroll position to show/hide scroll arrow buttons
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, activeCategories]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleCategoryClick = (slug: string) => {
    updateSelectedCategory(slug);
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else if (navigateOnClick) {
      router.push(`/collections?parentCategorySlug=${slug}`);
    }
  };

  const isAqua = theme === "aquamist";

  if (error || (!isLoading && activeCategories.length === 0)) {
    return null; // Hide if error or no active categories
  }

  return (
    <div className={`w-full py-6 px-4 sm:px-8 relative ${isAqua ? "text-white" : "text-gray-900"}`}>
      
      {/* ── Title Header ─────────────────────────────────────────────── */}
      {title && (
        <div className="text-center mb-6">
          <h2 className={`font-eb-garamond text-2xl sm:text-3xl md:text-4xl font-light tracking-wide ${
            isAqua ? "text-white" : "text-gray-900"
          }`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-xs sm:text-sm font-inter mt-1 ${isAqua ? "text-white/60" : "text-gray-500"}`}>
              {subtitle}
            </p>
          )}
          <div className="flex justify-center mt-2">
            <span className={`block w-12 h-[2px] rounded-full ${isAqua ? "bg-sky-400/60" : "bg-black/60"}`} />
          </div>
        </div>
      )}

      {/* ── Slider Container + Navigation Arrows ────────────────────── */}
      <div className="relative max-w-6xl mx-auto group">

        {/* Left Arrow Indicator (Desktop / Tablet) */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll Left"
          className={`hidden sm:flex items-center justify-center absolute -left-3 md:-left-5 top-[44px] sm:top-[48px] md:top-[56px] -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full shadow-lg transition-all duration-300 ${
            canScrollLeft
              ? isAqua
                ? "bg-[#0a0f1e]/90 border border-white/20 text-white hover:bg-sky-400 hover:text-slate-950 hover:border-sky-400 hover:scale-110 backdrop-blur-md"
                : "bg-white/95 border border-gray-200 text-gray-800 hover:bg-gray-900 hover:text-white hover:scale-110 shadow-md"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Right Arrow Indicator (Desktop / Tablet) */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          aria-label="Scroll Right"
          className={`hidden sm:flex items-center justify-center absolute -right-3 md:-right-5 top-[44px] sm:top-[48px] md:top-[56px] -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full shadow-lg transition-all duration-300 ${
            canScrollRight
              ? isAqua
                ? "bg-[#0a0f1e]/90 border border-white/20 text-white hover:bg-sky-400 hover:text-slate-950 hover:border-sky-400 hover:scale-110 backdrop-blur-md"
                : "bg-white/95 border border-gray-200 text-gray-800 hover:bg-gray-900 hover:text-white hover:scale-110 shadow-md"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex items-start gap-4 sm:gap-6 md:gap-8 overflow-x-auto scroll-smooth no-scrollbar py-3 px-2 sm:px-1 touch-pan-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center shrink-0 space-y-3">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full animate-pulse ${
                    isAqua ? "bg-white/10" : "bg-gray-200"
                  }`} />
                  <div className={`w-16 h-3 rounded animate-pulse ${
                    isAqua ? "bg-white/10" : "bg-gray-200"
                  }`} />
                </div>
              ))
            : activeCategories.map((item) => {
                const isSelected = currentCategorySlug === item.slug;

                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => handleCategoryClick(item.slug)}
                    className="flex flex-col items-center shrink-0 group/item focus:outline-none w-20 sm:w-28 text-center transition-transform active:scale-95 cursor-pointer"
                  >
                    {/* Circle Image Bubble */}
                    <div
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 border-2 ${
                        isSelected
                          ? isAqua
                            ? "border-sky-400 ring-4 ring-sky-400/30 scale-105 shadow-lg shadow-sky-400/20"
                            : "border-gray-900 ring-4 ring-gray-900/20 scale-105 shadow-md"
                          : isAqua
                          ? "border-white/15 bg-white/5 group-hover/item:border-sky-400/60 group-hover/item:scale-105"
                          : "border-gray-200 bg-gray-100/80 group-hover/item:border-gray-400 group-hover/item:scale-105"
                      }`}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover/item:scale-110 transition-transform duration-500"
                          unoptimized
                        />
                      ) : (
                        <div className={`flex flex-col items-center justify-center ${
                          isAqua ? "text-sky-400/70" : "text-gray-400"
                        }`}>
                          <Folder className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5]" />
                        </div>
                      )}
                    </div>

                    {/* Category Label */}
                    <span
                      className={`text-xs sm:text-sm font-medium mt-2.5 leading-snug line-clamp-2 max-w-[100px] transition-colors ${
                        isSelected
                          ? isAqua
                            ? "text-sky-400 font-bold"
                            : "text-gray-900 font-bold"
                          : isAqua
                          ? "text-white/80 group-hover/item:text-white"
                          : "text-gray-700 group-hover/item:text-gray-900"
                      }`}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
        </div>

      </div>

      {/* Hide scrollbar helper CSS */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default function CategorySlider(props: CategorySliderProps) {
  return (
    <Suspense fallback={null}>
      <CategorySliderContent {...props} />
    </Suspense>
  );
}
