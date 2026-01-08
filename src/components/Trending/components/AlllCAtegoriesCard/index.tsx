"use client";
import { Menu, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productsService } from "@/services/productsService";
import React, { useEffect, useRef, useState, useCallback } from "react";
import MainCard from "../../../Card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Product } from "@/components/productDetail/productDetailDto";

import { useStore } from "@/Context/storeContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategoriesQuery } from "@/hooks/useProductsQuery";
export default function CategoryNavigation() {
  // Fetch all categories
  const {
    data: allCategories,
    isLoading: allCategoriesLoading,
    error: allCategoriesError,
  } = useCategoriesQuery();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  // const [activeChild, setActiveChild] = useState<string | null>(null);
  const categoriesData = allCategories?.categories || [];
  const searchParams = useSearchParams();
  const router = useRouter();
  const childCategoryID = searchParams.get("childCategorySlug");
  const parentCategorySlug = searchParams.get("parentCategorySlug");
  const { selectedCategory, updateSelectedCategory } = useStore();
  const [childCategory, setChildCategory] = useState<any[]>([]);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (selectedChildCategory && allCategories?.categories) {
      const parent = allCategories.categories.find((cat: any) =>
        cat.children.some((child: any) => child.slug === selectedChildCategory)
      );
      if (parent) {
        setExpanded(parent.slug); // expand the right parent automatically
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

      // Reset selected child category when parent changes
      if (selectedCategory && selectedCategory !== parentCategorySlug) {
        setSelectedChildCategory(null);
      }
    }
  }, [allCategories?.categories, parentCategorySlug, selectedCategory]);
  useEffect(() => {
    if (childCategoryID) {
      setSelectedChildCategory(childCategoryID);
    }
  }, [childCategoryID]);
  // Infinite query for products
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [
      "products",
      { parent: selectedCategory, child: selectedChildCategory },
    ],
    queryFn: ({ pageParam = 1 }) =>
      productsService.fetchProducts(
        selectedCategory ?? undefined,
        selectedChildCategory ?? undefined,
        pageParam as number,
        10,
        'client'
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.currentPage! < lastPage?.pagination?.totalPages!
        ? lastPage.pagination.currentPage + 1
        : undefined,
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
    (categorySlug: string) => {
      updateSelectedCategory(categorySlug);
      setSelectedChildCategory(null); // reset child when parent changes
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
    (childCategorySlug: string, parentId?: string) => {
      setSelectedChildCategory(childCategorySlug);
      updateSelectedCategory("");
      setExpanded(parentId ? parentId : ""); // expand parent automatically
      router.push(`/all-products?childCategorySlug=${childCategorySlug}`);
      if (childCategorySlug) scrollToCategory(childCategorySlug);
    },
    [router, scrollToCategory, updateSelectedCategory]
  );

  if (allCategoriesError) return <div>Error loading categories</div>;
  return (
    <div className="flex w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        {categoriesData.toReversed().map((cat) => (
          <div key={cat._id}>
            <button
              className={`flex justify-between w-full py-2 font-medium ${selectedCategory === cat.slug ? "text-blue-600" : ""}`}
              onClick={() => {
                setExpanded(expanded === cat.slug ? null : cat.slug);
                handleParentCategoryClick(cat.slug);
              }}
            >
              {cat.name}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${expanded === cat.slug ? "rotate-180" : ""
                  }`}
              />
            </button>
            <AnimatePresence>
              {expanded === cat.slug && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pl-4 overflow-hidden"
                >
                  {cat.children?.map((child) => (
                    <div
                      key={child._id}
                      className={`py-1 cursor-pointer text-sm hover:text-blue-500 ${selectedChildCategory === child.slug
                        ? "text-blue-600 font-semibold"
                        : ""
                        }`}
                      onClick={() => {
                        handleChildCategoryClick(child.slug);
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
      </aside>

      {/* Main Content Area */}
      <main className="p-4 w-full bg-white rounded-lg sm:ml-4">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <button className="text-lg font-semibold" onClick={() => setMobileOpen(true)}>
            Explore Categories
          </button>
          {/* <span className="text-lg font-semibold">Products</span> */}
        </div>

        {/* Mobile Child Category Chips */}
        <div
          ref={containerRef}
          className="md:hidden  flex gap-2 scrollbarHide overflow-x-auto  pb-2"
        >
          {categoriesData
            .flatMap((c) => c.children)
            .toReversed()
            .map((child) => (
              <button
                key={child?._id}
                data-id={child?.slug}
                className={`px-3 py-1  rounded-full border text-sm whitespace-nowrap transition-colors ${selectedChildCategory === child?.slug
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-300 text-gray-700"
                  }`}
                onClick={() => {
                  // setActiveChild(child?._id as string);
                  handleChildCategoryClick(child?.slug as string);
                }}
              >
                {child?.name}
              </button>
            ))}
        </div>

        {/* Product Grid Placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 xl:max-w-[1440px] mx-auto xl:mt-14">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-40">
              <span className="text-gray-600">Loading Products...</span>
            </div>
          ) : (
            products.map((item) => (
              <div key={item._id} className="mt-3 sm:mt-0">
                <MainCard item={item} />
              </div>
            ))
          )}
          <div
            ref={loaderRef}
            className="col-span-full flex justify-center items-center h-40"
          >
            {isFetchingNextPage && (
              <span className="text-gray-600">Loading more...</span>
            )}
            {!hasNextPage && products.length > 0 && (
              <span className="text-gray-400">No more products</span>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed inset-0 z-50 bg-white w-64 shadow-lg p-4 md:hidden"
          >
            <button
              className="mb-4 text-sm text-gray-500"
              onClick={() => setMobileOpen(false)}
            >
              Close
            </button>
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            {categoriesData.toReversed().map((cat) => (
              <div key={cat._id}>
                <button
                  className={`flex justify-between w-full py-2 font-medium ${selectedCategory === cat.slug ? "text-blue-600" : ""}`}
                  onClick={() => {
                    setExpanded(expanded === cat.slug ? null : cat.slug);
                    handleParentCategoryClick(cat.slug);
                  }}
                >
                  {cat.name}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expanded === cat.slug ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <AnimatePresence>
                  {expanded === cat.slug && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 overflow-hidden"
                    >
                      {cat.children?.map((child, index) => (
                        <div
                          key={child._id}
                          className={`py-1 cursor-pointer text-sm  ${(selectedChildCategory || childCategoryID) ===
                            child.slug
                            ? "text-blue-600 font-semibold"
                            : ""
                            }`}
                          onClick={() => {
                            // setActiveChild(child._id);
                            setMobileOpen(false);
                            handleChildCategoryClick(
                              child.slug,
                              selectedCategory || parentCategorySlug!
                            );
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
