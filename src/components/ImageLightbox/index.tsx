"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";

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
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const preloadLinksRef = useRef<Set<HTMLLinkElement>>(new Set());
  const isMountedRef = useRef(true);

  const getUrl = useCallback(
    (item: ImageType) =>
      typeof item === "string" ? item : (item[imageKey || "src"] as string),
    [imageKey]
  );

  const preloadImage = useCallback(
    (index: number) => {
      if (!images[index] || imagesLoaded.has(index) || !isMountedRef.current) return;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = getUrl(images[index]);
      document.head.appendChild(link);
      preloadLinksRef.current.add(link);
    },
    [images, imagesLoaded, getUrl]
  );

  useEffect(() => {
    const indices = [
      currentIndex,
      (currentIndex + 1) % images.length,
      (currentIndex - 1 + images.length) % images.length,
    ];
    indices.forEach(preloadImage);
  }, [currentIndex, images.length, preloadImage]);

  const prevImage = useCallback(() => {
    setCurrentIndex((p) => (p - 1 + images.length) % images.length);
    setLoading(true);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setCurrentIndex((p) => (p + 1) % images.length);
    setLoading(true);
  }, [images.length]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [prevImage, nextImage, onClose]);

  useEffect(() => {
    isMountedRef.current = true;
    document.body.style.overflow = "hidden";
    const preloadLinks = preloadLinksRef.current;
    return () => {
      isMountedRef.current = false;
      document.body.style.overflow = "unset";
      preloadLinks.forEach((link) => {
        if (document.head.contains(link)) document.head.removeChild(link);
      });
      preloadLinks.clear();
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        {...swipeHandlers}
      >
        {/* IMAGE LAYER (kept beneath buttons) */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full flex items-center justify-center px-8 py-8 z-0 pointer-events-none"
        >
          {/* Loader - never blocks clicks */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

          <Image
            src={getUrl(images[currentIndex]) || ""}
            alt={`Image ${currentIndex + 1}`}
            fill
            sizes="100vw"
            className="object-contain pointer-events-none"
            draggable={false}
            priority
            quality={95}
            onLoad={() => {
              setLoading(false);
              setImagesLoaded((prev) => new Set(prev).add(currentIndex));
            }}
            onError={() => setLoading(false)}
          />
        </motion.div>

        {/* UI CONTROLS (render after image so they’re on top) */}
        <button
          aria-label="Close"
          className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 z-50"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        {images.length > 1 && (
          <>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm z-50">
              {currentIndex + 1} / {images.length}
            </div>

            <button
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-gray-300 bg-black/30 rounded-full z-50"
              onClick={prevImage}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-gray-300 bg-black/30 rounded-full z-50"
              onClick={nextImage}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
