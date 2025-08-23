"use client";

import { memo, useCallback, useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageLightbox from "../ImageLightbox";
import { Fullscreen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ImageGalleryProps {
  images: { src: string; alt: string }[];
  productName: string;
}

// Separate thumbnail component to prevent unnecessary re-renders
const ThumbnailImage = memo<{
  image: { src: string; alt: string };
  index: number;
  currentIndex: number;
  productName: string;
  onThumbnailClick: (index: number) => void;
  onPreload: (index: number) => void;
  onLoad: (index: number) => void;
}>(
  ({
    image,
    index,
    currentIndex,
    productName,
    onThumbnailClick,
    onPreload,
    onLoad,
  }) => {
    const isActive = index === currentIndex;

    return (
      <div className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24">
        <Image
          src={image.src}
          alt={`${productName} thumbnail ${index + 1}`}
          width={96}
          height={96}
          sizes="(max-width: 768px) 80px, 96px"
          className={`cursor-pointer w-full h-full object-cover rounded-lg transition-all duration-200 ${
            isActive
              ? "ring-2 ring-blue-500 opacity-100"
              : "opacity-70 hover:opacity-90"
          }`}
          onClick={() => onThumbnailClick(index)}
          onMouseEnter={() => onPreload(index)}
          priority={index <= 2}
          loading={index <= 2 ? "eager" : "lazy"}
          onLoad={() => onLoad(index)}
        />
      </div>
    );
  }
);

ThumbnailImage.displayName = "ThumbnailImage";

// Main image component to isolate re-renders
const MainImage = memo<{
  image: { src: string; alt: string };
  index: number;
  productName: string;
  isLoaded: boolean;
  onLoad: (index: number) => void;
}>(({ image, index, productName, isLoaded, onLoad }) => (
  <Image
    src={image.src}
    alt={image.alt || `${productName} - Image ${index + 1}`}
    fill
    sizes="(max-width: 768px) 100vw, 60vw"
    className={`object-contain transition-opacity duration-300 ${
      isLoaded ? "opacity-100 " : "opacity-0"
    }`}
    priority={index === 0} // Only prioritize the first image
    loading={index === 0 ? "eager" : "lazy"}
    quality={90}
    onLoad={() => onLoad(index)}
  />
));

MainImage.displayName = "MainImage";

// Optimized navigation controls
const NavigationControls = memo<{
  onPrev: () => void;
  onNext: () => void;
  isVisible: boolean;
}>(({ onPrev, onNext, isVisible }) => (
  <>
    <button
      onClick={onPrev}
      className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 z-10 ${
        isVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
      aria-label="Previous image"
    >
      <ChevronLeft size={20} />
    </button>
    <button
      onClick={onNext}
      className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 z-10 ${
        isVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
      aria-label="Next image"
    >
      <ChevronRight size={20} />
    </button>
  </>
));

NavigationControls.displayName = "NavigationControls";

// Pagination dots component
const PaginationDots = memo<{
  totalImages: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}>(({ totalImages, currentIndex, onDotClick }) => (
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
    {Array.from({ length: totalImages }, (_, index) => (
      <button
        key={index}
        onClick={() => onDotClick(index)}
        className={`w-2 h-2 rounded-full transition-all duration-200 ${
          index === currentIndex ? "bg-white" : "bg-white/50"
        }`}
        aria-label={`Go to image ${index + 1}`}
      />
    ))}
  </div>
));

PaginationDots.displayName = "PaginationDots";

const OptimizedImageGallery = memo<ImageGalleryProps>(
  ({ images, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [direction, setDirection] = useState<"next" | "prev">("next");

    // Simplified loading state management
    const [loadedImages] = useState(() => new Set<number>());
    const [, setLoadTrigger] = useState(0); // Force re-render when images load

    const isMountedRef = useRef(true);
    const preloadedRef = useRef(new Set<number>());

    // Check if current image is loaded
    const isCurrentImageLoaded = loadedImages.has(currentIndex);

    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    // Optimized preload function with debouncing
    const preloadImage = useCallback(
      (index: number) => {
        if (
          !images[index] ||
          preloadedRef.current.has(index) ||
          !isMountedRef.current
        ) {
          return;
        }

        preloadedRef.current.add(index);

        // Use native image preloading for better performance
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = images[index].src;
        document.head.appendChild(link);

        // Clean up after a delay
        setTimeout(() => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        }, 30000);
      },
      [images]
    );

    // Mark image as loaded
    const handleImageLoad = useCallback(
      (index: number) => {
        if (isMountedRef.current) {
          loadedImages.add(index);
          setLoadTrigger((prev) => prev + 1); // Trigger re-render
        }
      },
      [loadedImages]
    );

    // Preload adjacent images when current index changes
    useEffect(() => {
      if (!images.length) return;

      const indicesToPreload = [
        currentIndex,
        (currentIndex + 1) % images.length,
        (currentIndex - 1 + images.length) % images.length,
      ];

      // Use requestIdleCallback for non-blocking preloading
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {
          indicesToPreload.forEach(preloadImage);
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          indicesToPreload.forEach(preloadImage);
        }, 100);
      }
    }, [currentIndex, images.length, preloadImage]);

    // Navigation handlers with reduced state updates
    const handleNext = useCallback(() => {
      setDirection("next");
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const handlePrev = useCallback(() => {
      setDirection("prev");
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const handleThumbnailClick = useCallback(
      (index: number) => {
        if (index === currentIndex) return;

        const forwardDistance =
          (index - currentIndex + images.length) % images.length;
        const backwardDistance =
          (currentIndex - index + images.length) % images.length;

        setDirection(forwardDistance <= backwardDistance ? "next" : "prev");
        setCurrentIndex(index);
      },
      [currentIndex, images.length]
    );

    // Memoized thumbnail list with reduced dependencies
    const thumbnailList = useMemo(
      () =>
        images.map((image, index) => (
          <ThumbnailImage
            key={`thumb-${index}`}
            image={image}
            index={index}
            currentIndex={currentIndex}
            productName={productName}
            onThumbnailClick={handleThumbnailClick}
            onPreload={preloadImage}
            onLoad={handleImageLoad}
          />
        )),
      [
        images,
        currentIndex,
        productName,
        handleThumbnailClick,
        preloadImage,
        handleImageLoad,
      ]
    );

    // Early return for empty images
    if (!images.length) {
      return (
        <div className="w-full lg:w-[60%] aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      );
    }

    const currentImage = images[currentIndex];

    return (
      <div className="relative flex flex-col lg:flex-row gap-4 w-full lg:w-[60%]">
        {/* Fullscreen button */}
        <button
          className="top-2 right-2 absolute z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200"
          onClick={() => setIsOpen(true)}
          aria-label="Open image in fullscreen"
        >
          <Fullscreen className="hover:scale-105 w-4 h-4" />
        </button>

        {/* Thumbnails */}
        <div className="flex scrollbarHide lg:flex-col gap-2 overflow-x-auto lg:overflow-visible lg:order-1 order-2 px-1 py-2 lg:py-0 lg:px-0">
          {thumbnailList}
        </div>

        {/* Main image container */}
        <div className="flex-1 lg:order-2 order-1 group relative">
          <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {/* Loading indicator */}
            {!isCurrentImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
                <span className="text-gray-500 text-sm">Loading...</span>
              </div>
            )}

            {/* Main image with animation */}
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ x: direction === "next" ? 100 : -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction === "next" ? -100 : 100, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }} // Reduced duration
                className="absolute inset-0 flex items-center justify-center"
              >
                <MainImage
                  image={currentImage}
                  index={currentIndex}
                  productName={productName}
                  isLoaded={isCurrentImageLoaded}
                  onLoad={handleImageLoad}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation controls */}
          {images.length > 1 && (
            <NavigationControls
              onPrev={handlePrev}
              onNext={handleNext}
              isVisible={false} // Will show on hover via CSS
            />
          )}

          {/* Pagination dots */}
          {images.length > 1 && (
            <PaginationDots
              totalImages={images.length}
              currentIndex={currentIndex}
              onDotClick={handleThumbnailClick}
            />
          )}
        </div>

        {/* Lightbox */}
        {isOpen && (
          <ImageLightbox
            images={images}
            initialIndex={currentIndex}
            onClose={() => setIsOpen(false)}
            imageKey="src"
          />
        )}
      </div>
    );
  }
);

OptimizedImageGallery.displayName = "OptimizedImageGallery";

export default OptimizedImageGallery;
