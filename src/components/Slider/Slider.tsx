"use client";
import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StoreInfo } from "./dto/storeSettingDto";

interface SliderProps {
  storeSettings?: StoreInfo;
}

function Slider({ storeSettings }: SliderProps) {
  const router = useRouter();
  const slides = useMemo(
    () => storeSettings?.bannerImages || [],
    [storeSettings?.bannerImages]
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!slides.length) return;
    intervalRef.current = window.setInterval(nextSlide, 6000);
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [nextSlide, slides.length]);

  if (!slides.length) return null;

  return (
    <div className="relative w-full overflow-hidden h-[150px] md:h-[90vh] group">

      {/* Fading slides stacked on top of each other */}
      {slides.map((slide, i) => (
        <div
          key={slide._id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: i === currentSlide ? 1 : 0,
            zIndex: i === currentSlide ? 1 : 0,
          }}
        >
          {slide.link ? (
            <Link href={slide.link}>
              <Image
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                src={slide.img}
                alt={`Slide ${slide._id}`}
                fill
                sizes="100vw"
                className="object-cover object-center cursor-pointer"
              />
            </Link>
          ) : (
            <Image
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              src={slide.img}
              alt={`Slide ${slide._id}`}
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
        </div>
      ))}

      {/* Prev / Next buttons */}
      {slides.length > 1 && (
        <>
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={prevSlide}
            aria-label="Previous Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={nextSlide}
            aria-label="Next Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-[5]" />

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300  ${i === currentSlide
                ? "bg-white w-6 h-2.5"
                : "bg-white/50 hover:bg-white/80 w-2.5 h-2.5"
                }`}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default memo(Slider);