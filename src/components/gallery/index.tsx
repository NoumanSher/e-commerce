"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Fullscreen, X } from "lucide-react";
import dynamic from "next/dynamic";

const ImageLightbox = dynamic(() => import("../ImageLightbox"), {
  loading: () => <div></div>,
});

interface ImageGalleryProps {
  images: { src: string; alt: string; blurDataURL: string }[];
  productName: string;
}

// Default blur placeholder
const defaultBlur =
  "data:image/svg+xml;base64," +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f0f0f0" stop-opacity="1" />
          <stop offset="20%" stop-color="#e0e0e0" stop-opacity="1" />
          <stop offset="40%" stop-color="#f8f8f8" stop-opacity="1" />
          <stop offset="60%" stop-color="#e0e0e0" stop-opacity="1" />
          <stop offset="100%" stop-color="#f0f0f0" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" fill="#f0f0f0" />
      <rect width="32" height="32" fill="url(#shimmer)" opacity="0.7" />
    </svg>`
  );

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll thumbnails to keep current visible
  useEffect(() => {
    if (!thumbnailContainerRef.current) return;

    const thumbnail = thumbnailContainerRef.current.querySelector(
      `[data-index="${currentIndex}"]`
    ) as HTMLElement;

    if (thumbnail) {
      thumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  // Navigate to next image
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Navigate to previous image
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) return;

      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, isLightboxOpen]);

  // Empty state
  if (!images.length) {
    return (
      <div className="w-full lg:w-[60%] aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-3  lg:gap-4 w-full lg:w-[60%]">
        {/* Thumbnails */}
        <div
          ref={thumbnailContainerRef}
          className=" flex lg:flex-col gap-2 overflow-x-scroll lg:overflow-y-auto scrollbarHide lg:max-h-[600px] order-2 lg:order-1"
        >
          {images.map((image, index) => (
            <button
              key={index}
              data-index={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg  transition-all duration-200 ${index === currentIndex
                ? "opacity-100 scale-105"
                : "opacity-60 hover:opacity-100 hover:scale-105"
                }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.src}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="96px"
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL={image.blurDataURL || defaultBlur}
              />
            </button>
          ))}
        </div>

        {/* Main Image Container */}
        <div className="relative flex-1 order-1 lg:order-2">
          {/* Image Counter & Fullscreen Button */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 pointer-events-auto"
              aria-label="Open fullscreen"
            >
              <Fullscreen className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Main Image */}
          <div
            className="relative aspect-[4/5] sm:aspect-square lg:max-h-[600px]  w-full bg-gray-100 rounded-xl overflow-hidden group"
          >
            <div>
              <Image
                src={currentImage.src}
                alt={currentImage.alt || `${productName} - Image ${currentIndex + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 600px, 800px"
                className="object-contain"
                priority={currentIndex === 0}
                quality={90}
                placeholder="blur"
                blurDataURL={currentImage.blurDataURL || defaultBlur}
              />
            </div>

            {/* Navigation Buttons - Desktop */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Navigation Buttons - Mobile (Always Visible) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Pagination Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-200 rounded-full ${index === currentIndex
                      ? "w-6 h-2 bg-white"
                      : "w-2 h-2 bg-white/50 hover:bg-white/70"
                      }`}
                    aria-label={`Go to image ${index + 1}`}
                    aria-current={index === currentIndex}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <ImageLightbox
          images={images}
          initialIndex={currentIndex}
          onClose={() => setIsLightboxOpen(false)}
          imageKey="src"
        />
      )}


    </>
  );
}
