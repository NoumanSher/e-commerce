"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { PackageSearch } from "lucide-react";
import { productsService } from "@/services/productsService";
import { Product } from "@/components/productDetail/productDetailDto";
import { useStore } from "@/context/storeContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategoriesQuery, useInfiniteProductsQuery } from "@/hooks/useProductsQuery";

// Subcomponents
import DesktopSidebar from "./components/DesktopSidebar";
import MobileHeader from "./components/MobileHeader";
import MobileDrawer from "./components/MobileDrawer";
import ProductGrid from "./components/ProductGrid";

export default function CategoryNavigation() {
  // Fetch all categories
  const {
    data: allCategories,
    isLoading: allCategoriesLoading,
    error: allCategoriesError,
  } = useCategoriesQuery();

  // Read URL params first — needed as initial values for state below
  const searchParams = useSearchParams();
  const router = useRouter();
  const childCategoryID = searchParams.get("childCategorySlug");
  const parentCategorySlug = searchParams.get("parentCategorySlug");
  const { selectedCategory, updateSelectedCategory } = useStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(parentCategorySlug);
  const categoriesData = useMemo(() => allCategories?.categories || [], [allCategories?.categories]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Use state strictly for local UI selection if the URL hasn't caught up, but default to URL params
  const [selectedChildCategory, setSelectedChildCategory] = useState<string | null>(childCategoryID);
  
  // Resolve active categories reliably based on URL params and local state
  const activeParentSlug = useMemo(() => {
    // If a child is selected, trace back its parent
    const activeChild = selectedChildCategory || childCategoryID;
    if (activeChild && allCategories?.categories) {
      const parent = allCategories.categories.find(c => 
        c.children?.some(ch => ch.slug === activeChild)
      );
      if (parent) return parent.slug;
    }
    // Otherwise fallback to explicit parent selection
    return parentCategorySlug || selectedCategory || expanded;
  }, [selectedChildCategory, childCategoryID, allCategories?.categories, parentCategorySlug, selectedCategory, expanded]);

  const activeChildCategories = useMemo(() => {
    if (!activeParentSlug || !allCategories?.categories) return [];
    const parent = allCategories.categories.find(c => c.slug === activeParentSlug);
    return parent?.children || [];
  }, [activeParentSlug, allCategories?.categories]);

  // When a child is selected, ensure its parent accordion is expanded
  useEffect(() => {
    if (activeParentSlug) {
      setExpanded(activeParentSlug);
    }
  }, [activeParentSlug]);

  // Handle incoming URL params
  useEffect(() => {
    if (!allCategories?.categories) return;

    if (childCategoryID) {
      setSelectedChildCategory(childCategoryID);
    } else if (parentCategorySlug) {
      const parentCat = allCategories.categories.find(
        (cat: any) => cat.slug === parentCategorySlug
      );
      if (parentCat) {
        // Auto-select first child if the parent has children
        if (parentCat.children && parentCat.children.length > 0 && !selectedChildCategory) {
          const firstChild = parentCat.children[0];
          setSelectedChildCategory(firstChild.slug);
        } else if (!parentCat.children || parentCat.children.length === 0) {
          setSelectedChildCategory(null);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCategories?.categories, childCategoryID, parentCategorySlug]);

  // Infinite query for products (using custom hook)
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isPlaceholderData,
  } = useInfiniteProductsQuery(
    activeParentSlug,
    selectedChildCategory,
    { enabled: Boolean(selectedCategory || selectedChildCategory) }
  );

  const products: Product[] = data?.pages.flatMap((page) => page.data) ?? [];

  const handleParentCategoryClick = useCallback(
    (categorySlug: string, hasChildren: boolean) => {
      // Always expand the clicked parent (closes any previously open one)
      setExpanded(hasChildren ? categorySlug : null);
      updateSelectedCategory(categorySlug);
      setSelectedChildCategory(null);
      // Let the URL reflect exactly what was requested; auto-selection of first child happens via effect
      router.push(`/all-products?parentCategorySlug=${categorySlug}&mode=client`);
    },
    [router, updateSelectedCategory]
  );

  const scrollToCategory = useCallback((childSlug: string) => {
    if (!containerRef.current) return;
    const categoryElement = containerRef.current.querySelector<HTMLButtonElement>(
      `button[data-id='${childSlug}']`
    );
    if (categoryElement) {
      categoryElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, []);

  const handleChildCategoryClick = useCallback(
    (childCategorySlug: string, parentSlug?: string) => {
      setSelectedChildCategory(childCategorySlug);
      // Keep the parent accordion open so the user can see the child is selected
      if (parentSlug) setExpanded(parentSlug);
      router.push(`/all-products?childCategorySlug=${childCategorySlug}&mode=client`);
      scrollToCategory(childCategorySlug);
    },
    [router, scrollToCategory]
  );

  // Auto-scroll to selected category on mobile initial load
  useEffect(() => {
    if (selectedChildCategory && activeChildCategories.length > 0) {
      const timer = setTimeout(() => {
        scrollToCategory(selectedChildCategory);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedChildCategory, activeChildCategories.length, scrollToCategory]);

  // Active label for mobile header
  const activeLabel = useMemo(() => {
    if (selectedChildCategory) {
      return activeChildCategories.find((c: any) => c.slug === selectedChildCategory)?.name ?? null;
    }
    if (activeParentSlug) {
      return categoriesData.find((c: any) => c.slug === activeParentSlug)?.name ?? null;
    }
    return null;
  }, [selectedChildCategory, activeParentSlug, activeChildCategories, categoriesData]);

  if (allCategoriesError) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-2">
      <PackageSearch className="w-10 h-10 text-gray-300" />
      <p>Failed to load categories. Please refresh.</p>
    </div>
  );

  return (
    <div className="flex w-full">
      <DesktopSidebar
        allCategoriesLoading={allCategoriesLoading}
        categoriesData={categoriesData}
        expanded={expanded}
        handleParentCategoryClick={handleParentCategoryClick}
        selectedChildCategory={selectedChildCategory}
        handleChildCategoryClick={handleChildCategoryClick}
      />

      <main className="w-full bg-white min-h-screen">
        <MobileHeader
          setMobileOpen={setMobileOpen}
          activeLabel={activeLabel}
          productsLength={products.length}
          isLoading={isLoading}
          containerRef={containerRef}
          allCategoriesLoading={allCategoriesLoading}
          activeChildCategories={activeChildCategories}
          selectedChildCategory={selectedChildCategory}
          handleChildCategoryClick={handleChildCategoryClick}
          activeParentSlug={activeParentSlug}
        />

        <ProductGrid
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          isPlaceholderData={isPlaceholderData}
          isLoading={isLoading}
          products={products}
          activeParentSlug={activeParentSlug}
          selectedChildCategory={selectedChildCategory}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage || false}
        />
      </main>

      <MobileDrawer
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        categoriesData={categoriesData}
        expanded={expanded}
        handleParentCategoryClick={handleParentCategoryClick}
        selectedChildCategory={selectedChildCategory}
        childCategoryID={childCategoryID}
        allCategories={allCategories}
        handleChildCategoryClick={handleChildCategoryClick}
      />
    </div>
  );
}
