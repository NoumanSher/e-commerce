"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import GlassCard from "./GlassCard";
import { useGetStoreSettings } from "@/components/Slider/query/storeSettingQuery";

/** Floating badge card shown around the hero product image */
function FloatingBadge({
  icon,
  label,
  className,
  delay = "0s",
}: {
  icon: string;
  label: string;
  className?: string;
  delay?: string;
}) {
  return (
    <GlassCard
      className={[
        "absolute px-4 py-3 rounded-xl flex items-center gap-3 animate-float z-20",
        className,
      ].join(" ")}
      style={{ animationDelay: delay }}
    >
      <span className="material-symbols-outlined text-aq-primary-container text-[20px]">
        {icon}
      </span>
      <span className="font-inter text-sm text-aq-on-surface whitespace-nowrap">
        {label}
      </span>
    </GlassCard>
  );
}

export default function AquaMistHero() {
  const { data: storeSettings, isLoading, isError, refetch } = useGetStoreSettings();

  // Filter active slides and sort by sortOrder / orderNumber
  const slides = useMemo(() => {
    const all = storeSettings?.bannerImages || [];
    return all
      .filter((s: any) => s.isActive !== false)
      .sort((a: any, b: any) => {
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

  // ── 1. Loading State: Glassmorphic Animated Loader ──────────────────────────
  if (isLoading) {
    return (
      <section className="relative w-full h-[120vw] max-h-[80vh] min-h-[400px] md:h-[calc(100vh-80px)] mt-[80px] overflow-hidden bg-[#0a0f1e] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-sky-400/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span className="material-symbols-outlined text-sky-400 text-xl animate-pulse">auto_awesome</span>
        </div>
        <p className="font-inter text-xs text-white/50 uppercase tracking-widest animate-pulse font-medium">
          Loading Banners...
        </p>
      </section>
    );
  }

  // ── 2. Error State: Network Error Card ──────────────────────────────────────
  if (isError) {
    return (
      <section className="relative w-full h-[120vw] max-h-[80vh] min-h-[400px] md:h-[calc(100vh-80px)] mt-[80px] overflow-hidden bg-[#0a0f1e] flex items-center justify-center px-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md text-center backdrop-blur-xl space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <span className="material-symbols-outlined text-3xl">wifi_off</span>
          </div>
          <h3 className="font-eb-garamond text-2xl font-bold text-white">
            Connection Error
          </h3>
          <p className="font-inter text-xs text-white/60 leading-relaxed">
            Unable to load store banners from backend server. Please check your network or try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2.5 bg-sky-400 text-slate-950 text-xs font-semibold rounded-full hover:bg-sky-300 transition-all shadow-lg hover:scale-105"
          >
            Retry Connection
          </button>
        </div>
      </section>
    );
  }

  // ── 3. Slideshow State: Merchant Banner Slides ─────────────────────────────
  if (slides.length > 0) {
    return (
      /*
        CSS Grid stacking: all slides occupy the same grid cell (row-start-1 col-start-1).
        Active slide = opacity-100, inactive = opacity-0. Cross-fade still works perfectly.
        Container height = active image's natural height (w-full h-auto on the <img>).
        bg-[#0a0f1e] shows behind letterbox areas if any image has unusual dimensions.
        Vertical scroll is fine — no fixed height constraint.
      */
      <section className="relative w-full bg-[#0a0f1e] mt-[80px] group">
        <div className="grid w-full">
          {slides.map((slide: any, i: number) => {
            const isActive = i === currentSlide;
            const desktopSrc = slide.img;
            const slideHasDedicatedMobile = Boolean(
              slide.mobileImg &&
                slide.mobileImg.trim() !== "" &&
                slide.mobileImg !== slide.img
            );
            const mobileSrc = slideHasDedicatedMobile ? slide.mobileImg : slide.img;

            const hasTextContent = Boolean(slide.title) || Boolean(slide.subtitle) || Boolean(slide.buttonText);
            const showOverlay = (slide.displayText === true || slide.displayText === undefined) && hasTextContent;
            const buttonHref = slide.buttonLink || slide.link || "/collections";

            return (
              <div
                key={slide._id || i}
                className={[
                  // All slides in the same grid cell — CSS Grid stacking
                  "row-start-1 col-start-1 w-full",
                  "transition-opacity duration-1000 ease-in-out",
                  isActive
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none",
                ].join(" ")}
              >
                {/*
                  <picture> art-direction:
                    Case A — dedicated portrait mobile image:
                      <768px  → portrait, w-full h-auto (natural height, zero crop)
                      ≥768px  → landscape desktop, w-full h-auto (natural height, zero crop)
                    Case B — desktop-only image (same src):
                      all breakpoints → w-full h-auto (natural height, zero crop)
                */}
                {slideHasDedicatedMobile ? (
                  <picture className="block w-full">
                    <source media="(min-width: 768px)" srcSet={desktopSrc} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mobileSrc}
                      alt={slide.altText || slide.title || `Slide ${i + 1}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="w-full h-auto block"
                    />
                  </picture>
                ) : (
                  <picture className="block w-full">
                    <source media="(min-width: 768px)" srcSet={desktopSrc} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={desktopSrc}
                      alt={slide.altText || slide.title || `Slide ${i + 1}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="w-full h-auto block"
                    />
                  </picture>
                )}

                {/* Text Overlay */}
                {showOverlay && (
                  <div className="absolute inset-0 flex items-end md:items-center z-[12] pointer-events-none">
                    <div className="absolute bottom-0 left-0 right-0 h-2/3 md:h-full md:w-1/2 bg-gradient-to-t md:bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
                    <div className="relative z-20 px-6 pb-12 md:px-16 md:pb-0 max-w-2xl pointer-events-auto">
                      {slide.title && (
                        <h2 className="font-eb-garamond text-white text-3xl sm:text-4xl md:text-6xl font-medium tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-2 md:mb-4">
                          {slide.title}
                        </h2>
                      )}
                      {slide.subtitle && (
                        <p className="font-inter text-white/95 text-sm sm:text-base md:text-xl font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-5 md:mb-7">
                          {slide.subtitle}
                        </p>
                      )}
                      {slide.buttonText && (
                        <Link
                          href={buttonHref}
                          className="inline-block bg-aq-primary-container text-aq-on-primary-container font-inter text-xs sm:text-sm font-semibold tracking-[0.1em] px-6 py-3 md:px-8 md:py-3.5 rounded-full hover:bg-aq-primary transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:scale-105"
                        >
                          {slide.buttonText}
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Whole-slide link */}
                {slide.link && !slide.buttonText && (
                  <Link
                    href={slide.link}
                    className="absolute inset-0 z-[11]"
                    aria-label={slide.altText || slide.title || `Slide ${i + 1}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Prev / Next controls */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border border-white/20 bg-black/30 backdrop-blur-md text-white hover:text-aq-primary hover:bg-black/50 hover:border-white/40 transition-all duration-300 transform active:scale-95 hover:scale-105 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-xl"
              aria-label="Previous Banner"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">chevron_left</span>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border border-white/20 bg-black/30 backdrop-blur-md text-white hover:text-aq-primary hover:bg-black/50 hover:border-white/40 transition-all duration-300 transform active:scale-95 hover:scale-105 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-xl"
              aria-label="Next Banner"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">chevron_right</span>
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
              {slides.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={[
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    i === currentSlide
                      ? "bg-aq-primary w-6 shadow-[0_0_8px_#38bdf8]"
                      : "bg-white/30 hover:bg-white/60",
                  ].join(" ")}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>
    );
  }

  // ── 4. No Banners: Show store's own title/description, no static brand content
  return (
    <section
      className="relative w-full h-[120vw] max-h-[80vh] min-h-[400px] md:h-[calc(100vh-80px)] mt-[80px] overflow-hidden bg-[#0a0f1e] flex flex-col items-center justify-center space-y-6 px-6 text-center"
      style={{ background: "linear-gradient(180deg, #0A0F1E 0%, #0D1B2A 100%)" }}
    >
      {/* Soft ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(125,232,216,0.08) 0%, rgba(125,232,216,0) 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-xl space-y-5">
        {storeSettings?.title ? (
          <>
            <h1 className="font-eb-garamond text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight leading-tight">
              {storeSettings.title}
            </h1>
            {storeSettings.description && (
              <p className="font-inter text-sm sm:text-base text-white/60 leading-relaxed">
                {storeSettings.description}
              </p>
            )}
          </>
        ) : (
          <h1 className="font-eb-garamond text-4xl sm:text-5xl text-white/40 font-light">
            Welcome
          </h1>
        )}

        <Link
          href="/collections"
          className="inline-block bg-aq-primary-container text-aq-on-primary-container px-8 py-3 rounded-full font-inter text-sm font-semibold tracking-widest hover:bg-aq-primary transition-colors duration-300 mt-2"
          style={{ boxShadow: "0 0 20px rgba(125,232,216,0.25)" }}
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}

