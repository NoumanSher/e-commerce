const ImageGallerySkeleton = () => {
    return (
      <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-[60%] animate-pulse">
        {/* Thumbnails */}
        <div className="overflow-x-auto lg:overflow-x-hidden flex lg:flex-col flex-row gap-1 lg:order-1 order-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-[100px] h-[100px] bg-gray-300 rounded" />
          ))}
        </div>
  
        {/* Main Image */}
        <div className="lg:w-[82%] h-fit w-full relative lg:order-2 order-1 group">
          <div className="relative h-[390px] md:h-[690px] lg:h-[700px] bg-gray-300 rounded" />
  
          {/* Navigation Buttons (grey circles) */}
          <div className="absolute -left-[15px] lg:left-7 top-1/2 transform -translate-y-1/2 p-2">
            <div className="h-8 w-8 lg:h-12 lg:w-12 bg-gray-300 rounded-full shadow-sm" />
          </div>
          <div className="absolute -right-[15px] lg:right-7 top-1/2 transform -translate-y-1/2 p-2">
            <div className="h-8 w-8 lg:h-12 lg:w-12 bg-gray-300 rounded-full shadow-sm" />
          </div>
        </div>
      </div>
    );
  };
  
  export default ImageGallerySkeleton;
  