"use client";

import { memo, useCallback, useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageLightbox from "../ImageLightbox";
import { Fullscreen } from 'lucide-react';
interface ImageGalleryProps {
  images: { src: string; alt: string }[];
  productName: string;
}

const OptimizedImageGallery = memo<ImageGalleryProps>(
  ({ images, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
      const [isOpen, setIsOpen] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
    const [isClient, setIsClient] = useState(false);
    const preloadLinkRef = useRef<HTMLLinkElement | null>(null);
useEffect(() => {
    const nextIdx = (currentIndex + 1) % images.length;
    // Create and append
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as  = 'image';
    link.href = images[nextIdx].src;
    document.head.appendChild(link);

    // Save it so cleanup knows exactly which node to drop
    preloadLinkRef.current = link;

    return () => {
      if (preloadLinkRef.current && document.head.contains(preloadLinkRef.current)) {
        document.head.removeChild(preloadLinkRef.current);
      }
      preloadLinkRef.current = null;
    };
  }, [currentIndex, images]);

    // Ensure client-side rendering for interactive elements
    useEffect(() => {
      setIsClient(true);
    }, []);

    // Memoize navigation handlers
    const handleNext = useCallback(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const handlePrev = useCallback(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const handleThumbnailClick = useCallback((index: number) => {
      setCurrentIndex(index);
    }, []);
    const preloadImage = useCallback(
      (index: number) => {
        if (images[index] && !imagesLoaded.has(index)) {
          const img = new window.Image();
          img.onload = () => {
            setImagesLoaded((prev) => new Set(prev).add(index));
          };
          img.src = images[index].src;
        }
      },
      [images, imagesLoaded]
    );

    // Preload adjacent images
    useEffect(() => {
      if (!isClient) return;

      // Preload current and adjacent images
      preloadImage(currentIndex);
      preloadImage((currentIndex + 1) % images.length);
      preloadImage((currentIndex - 1 + images.length) % images.length);
    }, [currentIndex, images, imagesLoaded, isClient, preloadImage]);

    // Memoize thumbnail list
    const thumbnailList = useMemo(
      () =>
        images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 "
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
              onMouseEnter={() => handleThumbnailClick(index)}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        )),
      [images, productName, currentIndex, handleThumbnailClick]
    );

    if (!images.length) {
      return (
        <div className="w-full lg:w-[60%] aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      );
    }

    return (
      <div className="relative flex flex-col lg:flex-row gap-4 w-full lg:w-[60%]">
        {/* zoom button */}
        <button className="top-2 right-2 absolute z-10" onClick={() => setIsOpen(true)}><Fullscreen className="hover:scale-105" /></button>
        {/* Thumbnails */}
        <div className="flex scrollbarHide lg:flex-col gap-2 overflow-x-auto lg:overflow-visible lg:order-1 order-2 px-1 py-2 lg:py-0 lg:px-0">
          {thumbnailList}
        </div>

        {/* Main Image */}
        <div className="flex-1 lg:order-2 order-1 group relative">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={images[currentIndex].src}
              alt={`${productName} - Image ${currentIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain transition-opacity duration-300"
              priority={true}
              // quality={100}
              loading="eager"
              // placeholder="blur"
              // blurDataURL={images[currentIndex].src}
            />
          </div>

          {/* Navigation Buttons - Only render on client */}
          {isClient && images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                onMouseEnter={() =>
                  preloadImage(
                    (currentIndex - 1 + images.length) % images.length
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNext}
                onMouseEnter={() =>
                  preloadImage((currentIndex + 1) % images.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
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
           {isOpen && (
                <ImageLightbox
                  images={images}
                  initialIndex={currentIndex}
                  onClose={() => setIsOpen(false)}
                  imageKey='src'
                />
              )}
      </div>
    );
  }
);

OptimizedImageGallery.displayName = "OptimizedImageGallery";

export default OptimizedImageGallery;
