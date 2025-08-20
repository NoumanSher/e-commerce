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
  const [scale, setScale] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());

  const preloadLinksRef = useRef<Set<HTMLLinkElement>>(new Set());
  const isMountedRef = useRef(true);
  const getUrl = useCallback(
    (item: ImageType) =>
      typeof item === "string" ? item : (item[imageKey || "src"] as string),
    [imageKey]
  );

  // Simple preload function
  const preloadImage = useCallback(
    (index: number) => {
      if (!images[index] || imagesLoaded.has(index) || !isMountedRef.current)
        return;

      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = getUrl(images[index]);
      document.head.appendChild(link);
      preloadLinksRef.current.add(link);
    },
    [images, imagesLoaded, getUrl]
  );

  // Preload adjacent images
  useEffect(() => {
    const indices = [
      currentIndex,
      (currentIndex + 1) % images.length,
      (currentIndex - 1 + images.length) % images.length,
      (currentIndex + 2) % images.length,
      (currentIndex - 2 + images.length) % images.length,
    ];
    indices.forEach(preloadImage);
  }, [currentIndex, images.length, preloadImage]);

  const prevImage = useCallback(() => {
    setScale(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setScale(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const toggleZoom = useCallback(() => {
    setScale((prev) => (prev === 1 ? 1.8 : 1));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "Escape") onClose();
      else if (e.key === " ") {
        e.preventDefault();
        toggleZoom();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [prevImage, nextImage, onClose, toggleZoom]);

  // Cleanup
  useEffect(() => {
    isMountedRef.current = true;
    document.body.style.overflow = "hidden";
    const preloadLinks = preloadLinksRef.current;

    return () => {
      isMountedRef.current = false;
      document.body.style.overflow = "unset";

      // Copy ref to variable to avoid ESLint warning
      preloadLinks.forEach((link) => {
        if (document.head.contains(link)) document.head.removeChild(link);
      });
      preloadLinks.clear();
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        {...swipeHandlers}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-gray-300 bg-black/30 rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-gray-300 bg-black/30 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Main Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full flex items-center justify-center px-16 py-16"
        >
          <motion.div
            animate={{ scale }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={scale === 1 ? "cursor-zoom-in" : "cursor-zoom-out"}
            onClick={toggleZoom}
          >
            <Image
              src={getUrl(images[currentIndex]) || ""}
              alt={`Image ${currentIndex + 1}`}
              width={500}
              height={800}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
              priority={true}
              quality={95}
              onLoad={() =>
                setImagesLoaded((prev) => new Set(prev).add(currentIndex))
              }
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
