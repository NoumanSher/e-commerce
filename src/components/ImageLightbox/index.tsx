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
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  onClose,
  imageKey,
}: ImageLightboxProps) {
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
    const longSwipe = 150;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > longSwipe) onClose();
      else if (deltaX > shortSwipe && images.length > 1) nextImage();
      else if (deltaX < -shortSwipe && images.length > 1) prevImage();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [prevImage, nextImage, onClose]);

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
        onClick={onClose}
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
    </div>
  );
}
