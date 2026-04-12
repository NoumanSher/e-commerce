"use client";
import { ChevronDown, SlidersHorizontal, X, PackageSearch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productsService } from "@/services/productsService";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import MainCard from "../../../Card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Product } from "@/components/productDetail/productDetailDto";

import { useStore } from "@/context/storeContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategoriesQuery } from "@/hooks/useProductsQuery";

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
  const [childCategory, setChildCategory] = useState<any[]>([]);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState<
    string | null
  >(null);

  // Memoize the extraction and reversing of child categories
  const allChildCategories = useMemo(() => {
    return [...categoriesData.flatMap((c: any) => c.children || [])].reverse();
  }, [categoriesData]);

  // When a child is already selected, expand its parent
  useEffect(() => {
    if (selectedChildCategory && allCategories?.categories) {
      const parent = allCategories.categories.find((cat: any) =>
        cat.children?.some((child: any) => child.slug === selectedChildCategory)
      );
      if (parent) {
        setExpanded(parent.slug);
      }
    }
  }, [selectedChildCategory, allCategories?.categories]);

  // Update child categories when parent category changes
  useEffect(() => {
    if (parentCategorySlug || selectedCategory) {
      const categorySlug = selectedCategory || parentCategorySlug;
      const foundCategory = allCategories?.categories.find(
        (cat) => cat.slug === categorySlug
      );
      const children = foundCategory?.children || [];
      setChildCategory(children);

      // Reset selected child category when parent changes, unless a child is explicitly selected via URL
      if (!childCategoryID && selectedCategory && selectedCategory !== parentCategorySlug) {
        setSelectedChildCategory(null);
      }
    }
  }, [allCategories?.categories, parentCategorySlug, selectedCategory, childCategoryID]);

  // Handle incoming URL params
  useEffect(() => {
    if (!allCategories?.categories) return;

    if (childCategoryID) {
      // Child explicitly selected via URL
      setSelectedChildCategory(childCategoryID);
      updateSelectedCategory("");
    } else if (parentCategorySlug) {
      // Parent selected via "See All Products" button or direct URL
      const parentCat = allCategories.categories.find(
        (cat: any) => cat.slug === parentCategorySlug
      );
      if (parentCat) {
        setExpanded(parentCategorySlug);
        // Auto-select first child if the parent has children
        if (parentCat.children && parentCat.children.length > 0) {
          const firstChild = parentCat.children[0];
          setSelectedChildCategory(firstChild.slug);
          updateSelectedCategory("");
        } else {
          updateSelectedCategory(parentCategorySlug);
          setSelectedChildCategory(null);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCategories?.categories, childCategoryID, parentCategorySlug]);

  // Infinite query for products
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isPlaceholderData,
  } = useInfiniteQuery({
    queryKey: [
      "products",
      { parent: selectedCategory, child: selectedChildCategory },
    ],
    queryFn: ({ pageParam = 1 }) =>
      productsService.fetchProducts({
        categorySlug: selectedCategory ?? undefined,
        childCategorySlug: selectedChildCategory ?? undefined,
        page: pageParam as number,
        limit: 10,
        mode: 'client'
      }),
    initialPageParam: 1,
    // Keep previous category's products visible while new ones load — eliminates flicker
    placeholderData: (prev) => prev,
    getNextPageParam: (lastPage) => {
      const current = lastPage?.pagination?.currentPage;
      const total = lastPage?.pagination?.totalPages;
      return current != null && total != null && current < total ? current + 1 : undefined;
    },
    enabled: Boolean(selectedCategory || selectedChildCategory),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const products: Product[] = data?.pages.flatMap((page) => page.data) ?? [];

  const handleParentCategoryClick = useCallback(
    (categorySlug: string, hasChildren: boolean) => {
      // Always expand the clicked parent (closes any previously open one)
      setExpanded(hasChildren ? categorySlug : null);
      updateSelectedCategory(categorySlug);
      setSelectedChildCategory(null);
      router.push(`/all-products?parentCategorySlug=${categorySlug}`);
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
      updateSelectedCategory("");
      // Keep the parent accordion open so the user can see the child is selected
      if (parentSlug) setExpanded(parentSlug);
      router.push(`/all-products?childCategorySlug=${childCategorySlug}`);
      if (childCategorySlug) scrollToCategory(childCategorySlug);
    },
    [router, scrollToCategory, updateSelectedCategory]
  );

  // Auto-scroll to selected category on mobile initial load
  useEffect(() => {
    if (selectedChildCategory && allChildCategories.length > 0) {
      const timer = setTimeout(() => {
        scrollToCategory(selectedChildCategory);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedChildCategory, allChildCategories.length, scrollToCategory]);

  // Active label for mobile header
  const activeLabel = useMemo(() => {
    if (selectedChildCategory) {
      return allChildCategories.find((c) => c.slug === selectedChildCategory)?.name ?? null;
    }
    if (selectedCategory) {
      return categoriesData.find((c: any) => c.slug === selectedCategory)?.name ?? null;
    }
    return null;
  }, [selectedChildCategory, selectedCategory, allChildCategories, categoriesData]);

  if (allCategoriesError) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-2">
      <PackageSearch className="w-10 h-10 text-gray-300" />
      <p>Failed to load categories. Please refresh.</p>
    </div>
  );

  return (
    <div className="flex w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r bg-gray-50/60">
        <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-2">
            Browse
          </h2>

          {/* Sidebar Skeleton */}
          {allCategoriesLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 rounded-lg bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            [...categoriesData].reverse().map((cat) => (
              <div key={cat._id} className="mb-1">
                <button
                  className={`flex justify-between items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                    ${expanded === cat.slug
                      ? "bg-gray-100 text-black"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => handleParentCategoryClick(cat.slug, (cat.children?.length ?? 0) > 0)}
                >
                  <span>{cat.name}</span>
                  {(cat.children?.length ?? 0) > 0 && (
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${expanded === cat.slug ? "rotate-180" : ""}`}
                    />
                  )}
                </button>
                <AnimatePresence>
                  {expanded === cat.slug && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-3 mt-0.5 border-l-2 border-gray-300 pl-3"
                    >
                      {cat.children?.map((child) => (
                        <div
                          key={child._id}
                          className={`py-1.5 px-2 cursor-pointer text-sm rounded-md transition-all duration-150
                            ${selectedChildCategory === child.slug
                              ? "text-black font-semibold bg-gray-100"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                          onClick={() => handleChildCategoryClick(child.slug)}
                        >
                          {child.name}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="w-full bg-white min-h-screen">

        {/* Mobile Sticky Header: Top Bar + Chips */}
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
            {products.length > 0 && !isLoading && (
              <span className="text-xs text-gray-400 font-medium">{products.length} items</span>
            )}
          </div>

          {/* Mobile Child Category Chips */}
          <div
            ref={containerRef}
            className="flex gap-2 scrollbarHide overflow-x-auto pb-1"
          >
            {allCategoriesLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="px-10 py-4 rounded-full bg-gray-100 animate-pulse shrink-0" />
              ))
            ) : (
              allChildCategories.map((child) => (
                <button
                  key={child?._id}
                  data-id={child?.slug}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all duration-150 shrink-0
                    ${selectedChildCategory === child?.slug
                      ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-700 hover:text-gray-900"
                    }`}
                  onClick={() => handleChildCategoryClick(child?.slug as string)}
                >
                  {child?.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Slim shimmer bar — visible only while switching categories (no layout shift) */}
        <div className="relative h-0.5 overflow-hidden">
          {isFetching && !isFetchingNextPage && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400 to-transparent animate-shimmer" />
          )}
        </div>

        {/* Product Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 xl:max-w-[1440px] mx-auto p-3 sm:p-4 transition-opacity duration-300"
          style={{ opacity: isPlaceholderData ? 0.5 : 1 }}
        >
          {/* True first-load skeleton — only when no data exists at all */}
          {isLoading && !isPlaceholderData ? (
            <>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded overflow-hidden shadow-sm mt-3 sm:mt-0">
                  <div className="aspect-[3/4] w-full bg-gray-200 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </>
          ) : products.length === 0 && !isFetching && (selectedCategory || selectedChildCategory) ? (
            <div className="col-span-full flex flex-col items-center justify-center h-60 gap-3 text-gray-400">
              <PackageSearch className="w-12 h-12 text-gray-200" />
              <p className="text-sm font-medium">No products found in this category</p>
            </div>
          ) : (
            products.map((item) => (
              <div key={item._id} className="mt-3 sm:mt-0">
                <MainCard item={item} />
              </div>
            ))
          )}

          {/* Infinite scroll loader & end message */}
          <div
            ref={loaderRef}
            className="col-span-full flex flex-col justify-center items-center py-8 gap-2"
          >
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Loading more...
              </div>
            )}
            {!hasNextPage && products.length > 0 && !isPlaceholderData && (
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">You&apos;ve seen all products</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 bg-white w-72 shadow-2xl p-5 md:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-800">Browse Categories</h2>
                <button
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto -mx-1 px-1">
                {[...categoriesData].reverse().map((cat) => (
                  <div key={cat._id} className="mb-1">
                    <button
                      className={`flex justify-between items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                        ${expanded === cat.slug
                          ? "bg-gray-100 text-black"
                          : "text-gray-700 hover:bg-gray-100"
                        }`}
                      onClick={() => handleParentCategoryClick(cat.slug, (cat.children?.length ?? 0) > 0)}
                    >
                      <span>{cat.name}</span>
                      {(cat.children?.length ?? 0) > 0 && (
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${expanded === cat.slug ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>
                    <AnimatePresence>
                      {expanded === cat.slug && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden ml-3 mt-0.5 border-l-2 border-gray-300 pl-3"
                        >
                          {cat.children?.map((child) => (
                            <div
                              key={child._id}
                              className={`py-2 px-2 cursor-pointer text-sm rounded-md transition-all duration-150
                                ${(selectedChildCategory || childCategoryID) === child.slug
                                  ? "text-black font-semibold bg-gray-100"
                                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                              onClick={() => {
                                setMobileOpen(false);
                                // Find this child's parent slug to keep accordion open
                                const parentSlug = allCategories?.categories?.find((c: any) =>
                                  c.children?.some((ch: any) => ch.slug === child.slug)
                                )?.slug;
                                handleChildCategoryClick(child.slug, parentSlug);
                              }}
                            >
                              {child.name}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
