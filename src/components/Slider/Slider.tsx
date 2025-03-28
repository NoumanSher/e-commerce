"use client";
import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import Image from "next/image";

import { StoreInfo } from "./dto/storeSettingDto";

interface SliderProps {
  storeSettings?: StoreInfo;
}

function Slider({ storeSettings }: SliderProps) {
  const slides = useMemo(
    () => storeSettings?.bannerImages || [],
    [storeSettings?.bannerImages]
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // UseRef should be typed as number | null for browser environments
  const intervalRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play functionality with pause on hover
  useEffect(() => {
    if (!slides.length) return;

    if (!isHovered) {
      intervalRef.current = window.setInterval(nextSlide, 5000);
    } else if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, nextSlide, slides.length]);

  if (!slides.length) {
    return null;
  }

  return (
    <div
      className="relative w-full h-[50vh] md:h-[90vh] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 flex transition-transform duration-700"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide._id} 
            className="w-full flex-shrink-0 relative h-full" // Added "relative" and "h-full"
          >
            <Image
              priority={true}
              loading="eager"
              fill
              src={slide.img}
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-center object-fill"
              alt={`Slide ${slide._id}`}
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 pl-4 flex space-x-4 pb-5">
        <button
          className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
          onClick={prevSlide}
          aria-label="Previous Slide"
        >
          &larr;
        </button>
        <button
          className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
          onClick={nextSlide}
          aria-label="Next Slide"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}

export default memo(Slider);
