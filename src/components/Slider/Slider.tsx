"use client";
import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { StoreInfo } from "./dto/storeSettingDto";

interface SliderProps {
  storeSettings?: StoreInfo;
}

function Slider({ storeSettings }: SliderProps) {
  // Filter active slides and sort by sortOrder, fallback to orderNumber
  const slides = useMemo(() => {
    const all = storeSettings?.bannerImages || [];
    return all
      .filter((s) => s.isActive !== false)
      .sort((a, b) => {
        const oa = a.sortOrder ?? a.orderNumber ?? 0;
        const ob = b.sortOrder ?? b.orderNumber ?? 0;
        return oa - ob;
      });
  }, [storeSettings?.bannerImages]);

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
    <div className="relative w-full overflow-hidden h-[120vw] max-h-[90vh] min-h-[400px] md:h-[calc(100vh-72px)] group">

      {/* ── Slides ──────────────────────────────────────────────────────── */}
      {slides.map((slide, i) => {
        const desktopSrc = slide.img;
        const mobileSrc = slide.mobileImg || slide.img;
        
        const hasTextContent = Boolean(slide.title) || Boolean(slide.subtitle) || Boolean(slide.buttonText);
        const showOverlay = (slide.displayText === true || slide.displayText === undefined) && hasTextContent;
        const buttonHref = slide.buttonLink || slide.link || "/collections";

        return (
          <div
            key={slide._id || i}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: i === currentSlide ? 1 : 0,
              zIndex: i === currentSlide ? 1 : 0,
            }}
          >
            {/* Desktop image — hidden on mobile */}
            <div className="absolute inset-0 hidden md:block">
              <Image
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                src={desktopSrc}
                alt={slide.altText || slide.title || `Slide ${i + 1}`}
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>

            {/* Mobile image — hidden on desktop */}
            <div className="absolute inset-0 block md:hidden">
              <Image
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                src={mobileSrc}
                alt={slide.altText || slide.title || `Slide ${i + 1}`}
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>

            {/* ── Text Overlay (Localized gradient to keep images bright) ── */}
            {showOverlay && (
              <div className="absolute inset-0 flex items-end md:items-center z-[2]">
                <div className="absolute bottom-0 left-0 right-0 h-2/3 md:h-full md:w-1/2 bg-gradient-to-t md:bg-gradient-to-r from-black/75 via-black/35 to-transparent pointer-events-none" />

                <div className="relative z-10 px-6 pb-12 md:px-16 md:pb-0 max-w-2xl">
                  {slide.title && (
                    <h2 className="text-white text-3xl sm:text-4xl md:text-6xl font-bold leading-tight tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-2 md:mb-4">
                      {slide.title}
                    </h2>
                  )}
                  {slide.subtitle && (
                    <p className="text-white/95 text-sm sm:text-base md:text-xl font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-5 md:mb-7">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.buttonText && (
                    <Link
                      href={buttonHref}
                      className="inline-block bg-white text-gray-900 font-semibold text-sm md:text-base px-6 py-3 md:px-8 md:py-3.5 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:scale-105"
                    >
                      {slide.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Whole-slide link (when no text button exists) */}
            {slide.link && !slide.buttonText && (
              <Link href={slide.link} className="absolute inset-0 z-[3]" aria-label={slide.altText || slide.title || `Slide ${i + 1}`} />
            )}
          </div>
        );
      })}

      {/* ── Navigation Arrows ───────────────────────────────────────────── */}
      {slides.length > 1 && (
        <>
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100"
            onClick={prevSlide}
            aria-label="Previous Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100"
            onClick={nextSlide}
            aria-label="Next Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* ── Bottom gradient ──────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-[5]" />

      {/* ── Pagination Dots ──────────────────────────────────────────────── */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === currentSlide
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
