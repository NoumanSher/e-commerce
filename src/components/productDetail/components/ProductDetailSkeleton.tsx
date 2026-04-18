import ImageGallerySkeleton from "./ImageGallerySkeleton";

const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row lg:p-8 p-0">
        {/* Gallery Skeleton */}
        <ImageGallerySkeleton />

        {/* Info Panel Skeleton */}
        <div className="lg:pl-8 pt-2 lg:w-[40%] w-full">
          {/* Product name */}
          <div className="mb-3 px-3 lg:px-0">
            <div className="h-7 w-[75%] bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Price & stock row */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-3 px-3 lg:px-0 gap-2 lg:gap-0">
            <div className="flex items-baseline gap-3">
              <div className="h-7 w-28 bg-gray-200 animate-pulse rounded" />
              <div className="h-6 w-14 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="h-5 w-24 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Description lines */}
          <div className="mb-4 px-3 lg:px-0 space-y-2.5">
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-[90%] bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-[70%] bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-[85%] bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Variant selectors */}
          <div className="flex mb-4 gap-3 px-3 lg:px-0">
            <div className="flex-1 h-12 lg:h-14 bg-gray-200 animate-pulse rounded-lg lg:rounded-none" />
            <div className="flex-1 h-12 lg:h-14 bg-gray-200 animate-pulse rounded-lg lg:rounded-none" />
          </div>

          {/* Desktop action buttons */}
          <div className="hidden lg:flex items-center gap-x-3 mb-4">
            <div className="h-14 w-[120px] bg-gray-200 animate-pulse rounded-sm" />
            <div className="h-14 flex-1 bg-gray-200 animate-pulse rounded-sm" />
            <div className="h-14 flex-1 bg-gray-200 animate-pulse rounded-sm" />
          </div>

          {/* Mobile action buttons placeholder */}
          <div className="lg:hidden flex gap-3 px-3 mb-4">
            <div className="h-11 flex-1 bg-gray-200 animate-pulse rounded-lg" />
            <div className="h-11 flex-1 bg-gray-200 animate-pulse rounded-lg" />
          </div>

          {/* SKU line */}
          <div className="px-2 lg:px-0 mb-2">
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
