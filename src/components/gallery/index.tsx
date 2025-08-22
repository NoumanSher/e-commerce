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

const OptimizedImageGallery = memo<ImageGalleryProps>(
  ({ images, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
const [direction, setDirection] = useState<"next" | "prev">("next");
    // Use refs instead of state to avoid unnecessary re-renders
    const imagesLoadedRef = useRef<Set<number>>(new Set());
    const preloadLinksRef = useRef<Set<HTMLLinkElement>>(new Set());
    const loadingImagesRef = useRef<Set<number>>(new Set());
    const isMountedRef = useRef(true);

    // Cleanup on unmount
    useEffect(() => {
      isMountedRef.current = true;
      const preloadLinks = preloadLinksRef.current;

      return () => {
        isMountedRef.current = false;
        // Cleanup preload links
        preloadLinks.forEach((link) => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        });
        preloadLinks.clear();
      };
    }, []);

    // Optimized preload function with better error handling and cleanup
    const preloadImage = useCallback(
      (index: number) => {
        if (
          !images[index] ||
          imagesLoadedRef.current.has(index) ||
          loadingImagesRef.current.has(index) ||
          !isMountedRef.current
        ) {
          return;
        }

        loadingImagesRef.current.add(index);

        const img = new window.Image();
        const src = images[index].src;

        const handleLoad = () => {
          if (isMountedRef.current) {
            imagesLoadedRef.current.add(index);
            loadingImagesRef.current.delete(index);
          }
          cleanup();
        };

        const handleError = () => {
          if (isMountedRef.current) {
            loadingImagesRef.current.delete(index);
          }
          cleanup();
        };

        const cleanup = () => {
          img.removeEventListener("load", handleLoad);
          img.removeEventListener("error", handleError);
        };

        img.addEventListener("load", handleLoad);
        img.addEventListener("error", handleError);
        img.src = src;
      },
      [images]
    );

    // More efficient preloading with link tags
    useEffect(() => {
      if (!isClient || !images.length) return;

      // Clear existing preload links
      preloadLinksRef.current.forEach((link) => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
      preloadLinksRef.current.clear();

      // Preload current and adjacent images with link tags (more efficient)
      const indicesToPreload = [
        currentIndex,
        (currentIndex + 1) % images.length,
        (currentIndex - 1 + images.length) % images.length,
      ];

      indicesToPreload.forEach((index) => {
        if (images[index]) {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = images[index].src;
          document.head.appendChild(link);
          preloadLinksRef.current.add(link);
        }
      });

      // Fallback preloading for browsers that don't support link preload well
      indicesToPreload.forEach(preloadImage);
    }, [currentIndex, images, isClient, preloadImage]);

    // Client-side rendering check
    useEffect(() => {
      setIsClient(true);
    }, []);

    // Memoized navigation handlers with better performance
    const handleNext = useCallback(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        // Preload next image immediately
        if (isClient) {
          const nextNext = (next + 1) % images.length;
          preloadImage(nextNext);
        }
        return next;
      });
      setIsImageLoaded(false);
    }, [images.length, isClient, preloadImage]);

    const handlePrev = useCallback(() => {
      setCurrentIndex((prev) => {
        const prevIndex = (prev - 1 + images.length) % images.length;
        // Preload previous image immediately
        if (isClient) {
          const prevPrev = (prevIndex - 1 + images.length) % images.length;
          preloadImage(prevPrev);
        }
        return prevIndex;
      });
      setIsImageLoaded(false);
    }, [images.length, isClient, preloadImage]);

    const handleThumbnailClick = useCallback(
      (index: number) => {
        if (index !== currentIndex) {
          setCurrentIndex(index);
          setIsImageLoaded(false);
          // Preload adjacent images when thumbnail is clicked
          if (isClient) {
            preloadImage((index + 1) % images.length);
            preloadImage((index - 1 + images.length) % images.length);
          }
        }
      },
      [currentIndex, isClient, preloadImage, images.length]
    );

    // Optimized thumbnail rendering with better key and reduced re-renders
    const thumbnailList = useMemo(
      () =>
        images.map((image, index) => (
          <div
            key={`thumb-${index}-${image.src}`}
            className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24"
          >
            
            <Image
              src={image.src}
              alt={`${productName} thumbnail ${index + 1}`}
              width={96}
              height={96}
              sizes="(max-width: 768px) 80px, 96px"
              className={`cursor-pointer w-full h-full object-cover rounded-lg transition-all duration-200 ${
                index === currentIndex
                  ? "ring-2 ring-blue-500 opacity-100"
                  : "opacity-70 hover:opacity-90"
              }`}
              onClick={() => handleThumbnailClick(index)}
              onMouseEnter={() => {
                // Only preload on hover, don't change current image
                preloadImage(index);
              }}
              priority={index <= 2} // Prioritize first 3 images
              loading={index <= 2 ? "eager" : "lazy"}
              onLoad={() => {
                // Mark as loaded when Next.js Image component loads
                imagesLoadedRef.current.add(index);
              }}
            />
          </div>
        )),
      [images, productName, currentIndex, handleThumbnailClick, preloadImage]
    );

    // Early return for empty images
    if (!images.length) {
      return (
        <div className="w-full lg:w-[60%] aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      );
    }

    return (
      <div className="relative flex flex-col lg:flex-row gap-4 w-full lg:w-[60%]">
        {/* Zoom button */}
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

        {/* Main Image */}
        <div className="flex-1 lg:order-2 order-1 group relative">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200  animate-pulse">
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
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <Image
        src={images[currentIndex].src}
        alt={`${productName} - Image ${currentIndex + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 60vw"
        className={`object-contain transition-opacity duration-300 ${
          isImageLoaded ? "opacity-100" : "opacity-0"
        }`}
        priority={currentIndex <= 5}
        loading={currentIndex <= 5 ? "eager" : "lazy"}
        quality={90}
        onLoad={() => setIsImageLoaded(true)}
      />
    </motion.div>
  </AnimatePresence>
          </div>

          {/* Navigation Buttons - Only render on client */}
          {isClient && images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image indicator dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
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
