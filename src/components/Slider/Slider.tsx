"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import P1 from "@/assets/img/P1.jpg";
import P2 from "@/assets/img/P2.jpg";
import P3 from "@/assets/img/P3.jpg";

export default function Slider() {
  const slides = useMemo(
    () => [
      { id: 1, img: P1 },
      { id: 2, img: P2 },
      { id: 3, img: P3 },
    ],
    []
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
    if (!isHovered) {
      intervalRef.current = window.setInterval(nextSlide, 5000);
    } else if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, nextSlide]);

  return (
    <div
      className="relative w-full h-[80vh] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 flex transition-transform duration-700"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0">
            <Image
              priority={true}
              loading="eager"
              src={slide.img}
              className="object-cover w-full h-full"
              alt={`Slide ${slide.id}`}
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
