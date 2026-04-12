import React, { lazy, Suspense } from "react";
const TrendingMain = lazy(() => import("./components/TrendingMain"));

export default function Trending() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="bg-[#faf9f8] px-4 md:px-6 mx-auto pt-7">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
            <div className="flex justify-center gap-6 mb-6 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 xl:max-w-[1440px] mx-auto">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded overflow-hidden shadow-sm">
                  <div className="aspect-[3/4] w-full bg-gray-200 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <TrendingMain />
      </Suspense>
    </div>
  );
}
