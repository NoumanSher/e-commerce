"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageObject {
  src: string;
  alt?: string;
}
type ImageType = string | ImageObject;

interface ImageLightboxProps {
  images: ImageType[];
  initialIndex?: number;
  onClose: () => void;
  imageKey?: keyof ImageObject;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  availableStock?: number;
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  onClose: onCloseProp,
  imageKey,
  onAddToCart,
  onBuyNow,
  availableStock = 1,
}: ImageLightboxProps) {
  const handleClose = useCallback(() => {
    if (typeof window !== "undefined" && window.history.state?.lightbox) {
      window.history.back();
    } else {
      onCloseProp();
    }
  }, [onCloseProp]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [showIndicators, setShowIndicators] = useState(true);

  const getUrl = useCallback(
    (item: ImageType) =>
      typeof item === "string"
        ? item
        : (item[imageKey || "src"] as string),
    [imageKey]
  );

  const prevImage = useCallback(() => {
    setCurrentIndex((p) => (p - 1 + images.length) % images.length);
    setLoading(true);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setCurrentIndex((p) => (p + 1) % images.length);
    setLoading(true);
  }, [images.length]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setTouchEnd({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.touches[0].clientX, y: e.touches[0].clientY });

    const deltaX = Math.abs(touchStart.x - e.touches[0].clientX);
    if (deltaX > 10) e.preventDefault();
  };

  const handleTouchEnd = () => {
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;

    setShowIndicators(false);

    const shortSwipe = 50;
    const closeSwipeThreshold = 150;

    // Only close on horizontal swipe (left or right)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe to close (150px minimum)
      if (Math.abs(deltaX) > closeSwipeThreshold) {
        handleClose();
      }
      // Navigate between images (50px minimum)
      else if (deltaX > shortSwipe && images.length > 1) {
        nextImage();
      } else if (deltaX < -shortSwipe && images.length > 1) {
        prevImage();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [prevImage, nextImage, handleClose]);

  useEffect(() => {
    // Push a marker state into the browser history if not already there (handles StrictMode double-mount)
    if (typeof window !== "undefined" && !window.history.state?.lightbox) {
      window.history.pushState({ lightbox: true }, "");
    }

    const handlePopstate = () => {
      // The user pressed the hardware/swipe back button, OR we programmatically called history.back()
      onCloseProp();
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [onCloseProp]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
      document.body.style.touchAction = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black z-[9999] flex items-center justify-center touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "none" }}
    >
      {/* Close Button */}
      <button
        aria-label="Close"
        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full z-50 transition-colors"
        onClick={handleClose}
      >
        <X size={28} />
      </button>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-50">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Main Image */}
      <div className="relative w-full h-full p-4 md:p-8">
        <Image
          src={getUrl(images[currentIndex]) || ""}
          alt={`Image ${currentIndex + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
          priority
          quality={90}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </div>

      {/* Mobile Swipe Indicators */}
      {images.length > 1 && showIndicators && (
        <>
          <div className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 text-white/50 animate-pulse pointer-events-none z-40">
            <ChevronLeft size={36} />
          </div>
          <div className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 text-white/50 animate-pulse pointer-events-none z-40">
            <ChevronRight size={36} />
          </div>
        </>
      )}

      {/* Desktop Navigation */}
      {images.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full z-50 transition-colors"
            onClick={prevImage}
          >
            <ChevronLeft size={32} />
          </button>

          <button
            aria-label="Next image"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full z-50 transition-colors"
            onClick={nextImage}
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Mobile Action Buttons */}
      {(onAddToCart || onBuyNow) && (
        <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="px-4 py-3 flex gap-3">
            {onAddToCart && (
              <button
                onClick={() => {
                  handleClose(); // Close lightbox first
                  setTimeout(() => onAddToCart(), 100); // Then execute action
                }}
                disabled={availableStock === 0}
                className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            )}
            {onBuyNow && (
              <button
                onClick={() => {
                  handleClose(); // Close lightbox first
                  setTimeout(() => onBuyNow(), 100); // Then execute action
                }}
                disabled={availableStock === 0}
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
