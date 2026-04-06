"use client";
import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [nextSlide, slides.length]);

  if (!slides.length) return null;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Sliding track */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide._id} className="w-full flex-shrink-0 relative">

            {/* ── MOBILE: natural height, no crop, no stretch ── */}
            <div className="block md:hidden h-[200px]">
              <Image
                priority
                loading="eager"
                src={slide.img}
                alt={`Slide ${slide._id}`}
                fill
                // width={1920}
                // height={800}
                sizes="100vw"
                className="w-full h-auto block "
              />
            </div>

            {/* ── DESKTOP: fixed viewport height, edge-to-edge width ──
                object-cover fills the full width without stretching pixels.
                Slight top/bottom trim only — standard for e-commerce banners. */}
            <div className="hidden md:block relative  h-[90vh]">
              <Image
                priority
                loading="eager"
                fill
                src={slide.img}
                alt={`Slide ${slide._id}`}
                sizes="100vw"
                className={`object-center   aspect-auto ${slide.link ? 'cursor-pointer' : ''}`}
                onClick={() => slide.link && router.push(slide.link)}
              />
            </div>

          </div>
        ))}
      </div>

      {/* Prev / Next buttons */}
      {/* <div className="absolute bottom-4 left-4 flex space-x-3 z-10">
        <button
          className="w-10 h-10 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
          onClick={prevSlide}
          aria-label="Previous Slide"
        >
          &larr;
        </button>
        <button
          className="w-10 h-10 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
          onClick={nextSlide}
          aria-label="Next Slide"
        >
          &rarr;
        </button>
      </div> */}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/80"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(Slider);
