const ImageGallerySkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-4 w-full lg:w-[60%]">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] order-2 lg:order-1 px-3 lg:px-0 py-2 lg:py-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg bg-gray-200 animate-pulse"
          />
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 order-1 lg:order-2">
        <div className="relative aspect-square lg:max-h-[600px] w-full overflow-hidden bg-gray-200 animate-pulse">
          {/* Counter badge skeleton */}
          <div className="absolute top-3 left-3 w-14 h-7 bg-gray-300 rounded-full" />
          {/* Fullscreen button skeleton */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ImageGallerySkeleton;
