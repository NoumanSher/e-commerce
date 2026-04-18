import React from "react";
import { SlidersHorizontal } from "lucide-react";

interface MobileHeaderProps {
  setMobileOpen: (open: boolean) => void;
  activeLabel: string | null;
  productsLength: number;
  isLoading: boolean;
  containerRef: React.Ref<HTMLDivElement>;
  allCategoriesLoading: boolean;
  activeChildCategories: any[];
  selectedChildCategory: string | null;
  handleChildCategoryClick: (childSlug: string, parentSlug?: string) => void;
  activeParentSlug: string | null;
}

export default function MobileHeader({
  setMobileOpen,
  activeLabel,
  productsLength,
  isLoading,
  containerRef,
  allCategoriesLoading,
  activeChildCategories,
  selectedChildCategory,
  handleChildCategoryClick,
  activeParentSlug,
}: MobileHeaderProps) {
  return (
    <div className="md:hidden sticky top-16 z-20 bg-white border-b border-gray-100 shadow-sm px-3 pt-3 pb-2">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 text-sm font-semibold px-3 py-2 rounded-lg"
            onClick={() => setMobileOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Categories
          </button>
          {activeLabel && (
            <span className="text-sm text-gray-500 read-only">
              / <span className="text-gray-800 font-medium">{activeLabel}</span>
            </span>
          )}
        </div>
        {productsLength > 0 && !isLoading && (
          <span className="text-xs text-gray-400 font-medium">{productsLength} items</span>
        )}
      </div>

      {/* Mobile Child Category Chips */}
      <div
        ref={containerRef}
        className="flex gap-2 scrollbarHide overflow-x-auto pb-1"
      >
        {allCategoriesLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="px-10 py-4 rounded-full bg-gray-100 animate-pulse shrink-0"
            />
          ))
        ) : (
          activeChildCategories.map((child: any) => (
            <button
              key={child?._id}
              data-id={child?.slug}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all duration-150 shrink-0
                ${
                  selectedChildCategory === child?.slug
                    ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-700 hover:text-gray-900"
                }`}
              onClick={() =>
                handleChildCategoryClick(child?.slug as string, activeParentSlug || undefined)
              }
            >
              {child?.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
