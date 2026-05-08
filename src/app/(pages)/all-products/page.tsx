import React, { Suspense, lazy } from "react";

const AllCategoriesCardSection = lazy(() => import("@/components/Trending/components/AlllCAtegoriesCard"));

const AllProductsSkeleton = () => (
  <div className="flex w-full">
    {/* Desktop Sidebar Skeleton */}
    <aside className="hidden md:block w-64 shrink-0 border-r bg-gray-50/60 p-4">
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="flex flex-col gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-gray-200 animate-pulse w-full" />
        ))}
      </div>
    </aside>

    {/* Main Content Area Skeleton */}
    <main className="w-full bg-white min-h-screen">
      {/* Mobile Top Bar Skeleton */}
      <div className="md:hidden flex flex-col gap-3 px-3 pt-3 pb-2 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="h-8 w-28 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-2 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse shrink-0" />
          ))}
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 xl:max-w-[1440px] mx-auto p-3 sm:p-4 mt-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded overflow-hidden shadow-sm">
            <div className="aspect-square w-full bg-gray-200 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>
);

export default function AllProducts() {
  return (
    <>
      <Suspense fallback={<AllProductsSkeleton />}>
        <AllCategoriesCardSection />
      </Suspense>
    </>
  );
}

