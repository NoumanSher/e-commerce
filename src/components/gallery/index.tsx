"use client";

import {
  memo,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Fullscreen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ImageLightbox from "../ImageLightbox";

interface ImageGalleryProps {
  images: { src: string; alt: string }[];
  productName: string;
}

/* ---------------- Thumbnail ---------------- */
const ThumbnailImage = memo<{
  image: { src: string; alt: string };
  index: number;
  currentIndex: number;
  productName: string;
  onClick: (index: number) => void;
  onPreload: (index: number) => void;
  onLoad: (index: number) => void;
}>(({ image, index, currentIndex, productName, onClick, onPreload, onLoad }) => {
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
        onClick={() => onClick(index)}
        onMouseEnter={() => onPreload(index)}
        loading="lazy"
        onLoad={() => onLoad(index)}
      />
    </div>
  );
});
ThumbnailImage.displayName = "ThumbnailImage";

/* ---------------- Main Image ---------------- */
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
    priority={index === 0}
    loading={index === 0 ? "eager" : "lazy"}
    quality={90}
    onLoad={() => onLoad(index)}
  />
));
MainImage.displayName = "MainImage";

/* ---------------- Navigation ---------------- */
const NavigationControls = memo<{
  onPrev: () => void;
  onNext: () => void;
}>(({ onPrev, onNext }) => (
  <>
    <button
      onClick={onPrev}
      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 z-10"
      aria-label="Previous image"
    >
      <ChevronLeft size={20} />
    </button>
    <button
      onClick={onNext}
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 z-10"
      aria-label="Next image"
    >
      <ChevronRight size={20} />
    </button>
  </>
));
NavigationControls.displayName = "NavigationControls";

/* ---------------- Pagination ---------------- */
const PaginationDots = memo<{
  totalImages: number;
  currentIndex: number;
  onClick: (index: number) => void;
}>(({ totalImages, currentIndex, onClick }) => (
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
    {Array.from({ length: totalImages }, (_, index) => (
      <button
        key={index}
        onClick={() => onClick(index)}
        className={`w-3 h-3 rounded-full transition-all duration-200 ${
          index === currentIndex ? "bg-white" : "bg-white/50"
        }`}
        aria-label={`Go to image ${index + 1}`}
        aria-current={index === currentIndex ? "true" : "false"}
      />
    ))}
  </div>
));
PaginationDots.displayName = "PaginationDots";

/* ---------------- Main Gallery ---------------- */
const OptimizedImageGallery = memo<ImageGalleryProps>(
  ({ images, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [direction, setDirection] = useState<"next" | "prev">("next");

    // Track loaded images without mutating state
    const loadedImagesRef = useRef<Set<number>>(new Set());
    const [, forceUpdate] = useState(0);

    const preloadedRef = useRef(new Set<number>());

    const isCurrentImageLoaded = loadedImagesRef.current.has(currentIndex);

    // Preload function (safe polyfill)
    const preloadImage = useCallback(
      (index: number) => {
        if (!images[index] || preloadedRef.current.has(index)) return;
        preloadedRef.current.add(index);

        const img = new window.Image();
        img.src = images[index].src;
      },
      [images]
    );

    const handleImageLoad = useCallback((index: number) => {
      if (!loadedImagesRef.current.has(index)) {
        loadedImagesRef.current.add(index);
        forceUpdate((x) => x + 1);
      }
    }, []);

    // Preload adjacent images
    useEffect(() => {
      if (!images.length) return;

      const indices = [
        currentIndex,
        (currentIndex + 1) % images.length,
        (currentIndex - 1 + images.length) % images.length,
      ];

      const idle =
        "requestIdleCallback" in window
          ? window.requestIdleCallback
          : (cb: () => void) => setTimeout(cb, 100);

      idle(() => indices.forEach(preloadImage));
    }, [currentIndex, images.length, preloadImage]);

    // Navigation
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

        const forward =
          (index - currentIndex + images.length) % images.length;
        const backward =
          (currentIndex - index + images.length) % images.length;

        setDirection(forward <= backward ? "next" : "prev");
        setCurrentIndex(index);
      },
      [currentIndex, images.length]
    );

    // Memoized thumbnails
    const thumbnailList = useMemo(
      () =>
        images.map((image, index) => (
          <ThumbnailImage
            key={`thumb-${index}`}
            image={image}
            index={index}
            currentIndex={currentIndex}
            productName={productName}
            onClick={handleThumbnailClick}
            onPreload={preloadImage}
            onLoad={handleImageLoad}
          />
        )),
      [images, currentIndex, productName, handleThumbnailClick, preloadImage, handleImageLoad]
    );

    // Empty state
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

        {/* Main image */}
        <div className="flex-1 lg:order-2 order-1 group relative">
          <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {!isCurrentImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
                <span className="text-gray-500 text-sm">Loading...</span>
              </div>
            )}

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ x: direction === "next" ? 100 : -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction === "next" ? -100 : 100, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
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

          {/* Navigation */}
          {images.length > 1 && (
            <NavigationControls onPrev={handlePrev} onNext={handleNext} />
          )}

          {/* Pagination */}
          {images.length > 1 && (
            <PaginationDots
              totalImages={images.length}
              currentIndex={currentIndex}
              onClick={handleThumbnailClick}
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
