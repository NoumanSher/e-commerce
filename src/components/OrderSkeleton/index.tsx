import React from 'react'

function OrderConfirmationSkeleton() {
  return (
     <div className="flex flex-col items-center lg:p-8 p-4">
        {/* Success Icon and Message Skeleton */}
        <div className="flex flex-col items-center mb-8 w-full max-w-3xl">
          <div className="bg-gray-300 rounded-full w-16 h-16 flex items-center justify-center mb-4 animate-pulse">
            <div className="bg-gray-400 rounded w-8 h-8"></div>
          </div>
          <div className="h-7 bg-gray-300 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-300 rounded w-80 animate-pulse"></div>
        </div>

        {/* Order Summary Details Skeleton */}
        <div className="border-dotted border-2 border-gray-300 p-4 w-full max-w-3xl text-sm mb-8 animate-pulse">
          <div className="flex justify-between mb-3">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="flex justify-between mb-3">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-28"></div>
          </div>
          <div className="flex justify-between mb-3">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 rounded w-36"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
        </div>

        {/* Order Details Table Skeleton */}
        <div className="border-2 border-gray-300 p-4 w-full max-w-3xl animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
          <div className="flex justify-between font-semibold border-b border-gray-300 pb-2 mb-4">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>

          {/* Product items skeleton */}
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className={`flex justify-between ${index < 2 ? "border-b pb-3" : ""}`}
              >
                <div className="flex items-center space-x-2">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold border-t border-gray-300 pt-4 mt-4">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-3">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-3">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="flex justify-between font-semibold border-t border-gray-300 pt-3">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>

        {/* Return to shop button skeleton */}
        <div className="bg-gray-300 w-full max-w-3xl flex justify-center items-center mt-4 h-14 animate-pulse rounded">
          <div className="h-4 bg-gray-400 rounded w-32"></div>
        </div>
      </div>
  )
}

export default OrderConfirmationSkeleton
