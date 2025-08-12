"use client";

import { useState } from "react";
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
  imageKey?:  keyof ImageObject;
}

export default function ImageLightbox({ images, initialIndex = 0, onClose ,imageKey}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1); // zoom level
 const getUrl = (item: ImageType) =>
    typeof item === "string" ? item : (item[imageKey || "src"]);
  const prevImage = () => {
    setScale(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const nextImage = () => {
    setScale(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // Toggle zoom when clicking the image
  const toggleZoom = () => setScale((prev) => (prev === 1 ? 1.8 : 1));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
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

        {/* Left Button (Desktop) */}
        {images.length > 1 && (
          <button
            className="hidden md:flex absolute left-4 text-white hover:text-gray-300"
            onClick={prevImage}
          >
            <ChevronLeft size={40} />
          </button>
        )}

        {/* Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="max-w-full max-h-full px-4 overflow-hidden flex items-center justify-center"
        >
          <motion.div
            animate={{ scale }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="cursor-zoom-in"
            onClick={toggleZoom}
          >
            <Image
              src={getUrl(images[currentIndex]) || ""}
              alt="Preview"
              width={800}
              height={800}
              className="object-contain max-h-[90vh] w-auto mx-auto select-none"
              draggable={false}
            />
          </motion.div>
        </motion.div>

        {/* Right Button (Desktop) */}
        {images.length > 1 && (
          <button
            className="hidden md:flex absolute right-4 text-white hover:text-gray-300"
            onClick={nextImage}
          >
            <ChevronRight size={40} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
