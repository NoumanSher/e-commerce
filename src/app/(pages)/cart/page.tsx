import React, { Suspense, lazy } from "react";

const CartScreen = lazy(() => import("@/components/screen/cart"));
const CartSkeleton = () => {
  return (
    <div className="w-full py-6 container mx-auto lg:px-16 px-4">
      <div className="h-10 bg-gray-200 animate-pulse w-32 rounded mb-6" />

      {/* Tabs Skeleton */}
      <div className="flex lg:flex-row flex-col justify-normal lg:justify-between border-b border-gray-300 mb-6 gap-4 lg:gap-0 pb-4 lg:pb-0">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex-1 text-start lg:py-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-2 max-w-xs" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 max-w-sm" />
          </div>
        ))}
      </div>

      {/* Cart Content Skeleton */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Cart Items */}
        <div className="w-full lg:w-[65%] flex flex-col gap-6">
          {/* Header Row */}
          <div className="hidden lg:flex justify-between border-b border-gray-200 pb-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            <div className="flex gap-16">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
            </div>
          </div>
          {/* Cart Item Items */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-4 py-4 border-b border-gray-100">
              <div className="w-24 h-32 bg-gray-200 rounded animate-pulse shrink-0" />
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2 max-w-md" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                </div>
                <div className="flex justify-between items-end mt-4 lg:mt-0">
                  <div className="h-10 bg-gray-200 rounded animate-pulse w-28" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-[35%]">
          <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mb-6" />
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 mb-6">
              <div className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4" />
              </div>
            </div>
            <div className="h-12 bg-gray-900 rounded animate-pulse w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartScreen />
    </Suspense>
  );
}
