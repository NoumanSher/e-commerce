"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  availableStock?: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDistance(t1: React.Touch, t2: React.Touch) {
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
}

function getMidpoint(t1: React.Touch, t2: React.Touch) {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  };
}

// ── Constants ───────────────────────────────────────────────────────────
const MIN_SCALE = 1;
const MAX_SCALE = 5;
const DOUBLE_TAP_SCALE = 2.5;
const DOUBLE_TAP_DELAY = 300; // ms
const SWIPE_THRESHOLD = 50;
const CLOSE_SWIPE_THRESHOLD = 150;
const SPRING_DURATION = 250; // ms for snap-back animation

export default function ImageLightbox({
  images,
  initialIndex = 0,
  onClose: onCloseProp,
  imageKey,
  onAddToCart,
  onBuyNow,
  availableStock = 1,
}: ImageLightboxProps) {
  // ── Close handling ──────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (typeof window !== "undefined" && window.history.state?.lightbox) {
      window.history.back();
    } else {
      onCloseProp();
    }
  }, [onCloseProp]);

  // ── Image state ─────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loading, setLoading] = useState(true);
  const [showIndicators, setShowIndicators] = useState(true);

  // ── Zoom & Pan state ────────────────────────────────────────────────
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [transitioning, setTransitioning] = useState(false);

  // ── Refs for gesture tracking ───────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapTime = useRef(0);
  const lastTapPos = useRef({ x: 0, y: 0 });
  const pinchStartDist = useRef(0);
  const pinchStartScale = useRef(1);
  const panStart = useRef({ x: 0, y: 0 });
  const translateAtPanStart = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const isPinching = useRef(false);
  const isSwiping = useRef(false);
  const swipeStart = useRef({ x: 0, y: 0 });

  // ── Live refs for values used inside gesture handlers ───────────────
  const scaleRef = useRef(scale);
  const translateRef = useRef(translate);
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { translateRef.current = translate; }, [translate]);

  const isZoomed = scale > 1.05;

  const getUrl = useCallback(
    (item: ImageType) =>
      typeof item === "string"
        ? item
        : (item[imageKey || "src"] as string),
    [imageKey]
  );

  // ── Navigation ──────────────────────────────────────────────────────
  const resetZoom = useCallback((animate = true) => {
    if (animate) {
      setTransitioning(true);
      setTimeout(() => setTransitioning(false), SPRING_DURATION);
    }
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const prevImage = useCallback(() => {
    resetZoom(false);
    setCurrentIndex((p) => (p - 1 + images.length) % images.length);
    setLoading(true);
  }, [images.length, resetZoom]);

  const nextImage = useCallback(() => {
    resetZoom(false);
    setCurrentIndex((p) => (p + 1) % images.length);
    setLoading(true);
  }, [images.length, resetZoom]);

  // ── Clamp translation to keep image within bounds ───────────────────
  const clampTranslation = useCallback(
    (tx: number, ty: number, s: number) => {
      if (s <= 1) return { x: 0, y: 0 };
      const container = containerRef.current;
      if (!container) return { x: tx, y: ty };

      const rect = container.getBoundingClientRect();
      const maxX = ((s - 1) * rect.width) / 2;
      const maxY = ((s - 1) * rect.height) / 2;

      return {
        x: clamp(tx, -maxX, maxX),
        y: clamp(ty, -maxY, maxY),
      };
    },
    []
  );

  // ── Double-tap zoom ─────────────────────────────────────────────────
  const handleDoubleTap = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) return;

      setTransitioning(true);
      setTimeout(() => setTransitioning(false), SPRING_DURATION);

      if (isZoomed) {
        // Reset
        setScale(1);
        setTranslate({ x: 0, y: 0 });
      } else {
        // Zoom into tap point
        const rect = container.getBoundingClientRect();
        const tapX = clientX - rect.left - rect.width / 2;
        const tapY = clientY - rect.top - rect.height / 2;

        const newScale = DOUBLE_TAP_SCALE;
        const tx = -tapX * (newScale - 1);
        const ty = -tapY * (newScale - 1);

        const clamped = clampTranslation(tx, ty, newScale);
        setScale(newScale);
        setTranslate(clamped);
      }
    },
    [isZoomed, clampTranslation]
  );

  // ── Touch handlers ──────────────────────────────────────────────────
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touches = e.touches;

      if (touches.length === 2) {
        // Pinch start
        isPinching.current = true;
        isPanning.current = false;
        isSwiping.current = false;
        pinchStartDist.current = getDistance(touches[0], touches[1]);
        pinchStartScale.current = scaleRef.current;

        // Track midpoint for zoom origin
        const mid = getMidpoint(touches[0], touches[1]);
        panStart.current = mid;
        translateAtPanStart.current = { ...translateRef.current };
      } else if (touches.length === 1) {
        const now = Date.now();
        const { clientX, clientY } = touches[0];

        // Check double-tap
        const dt = now - lastTapTime.current;
        const dx = Math.abs(clientX - lastTapPos.current.x);
        const dy = Math.abs(clientY - lastTapPos.current.y);

        if (dt < DOUBLE_TAP_DELAY && dx < 30 && dy < 30) {
          handleDoubleTap(clientX, clientY);
          lastTapTime.current = 0; // Reset to prevent triple-tap
          return;
        }

        lastTapTime.current = now;
        lastTapPos.current = { x: clientX, y: clientY };

        if (isZoomed) {
          // Pan start
          isPanning.current = true;
          isSwiping.current = false;
          panStart.current = { x: clientX, y: clientY };
          translateAtPanStart.current = { ...translateRef.current };
        } else {
          // Swipe start (for navigation)
          isSwiping.current = true;
          isPanning.current = false;
          swipeStart.current = { x: clientX, y: clientY };
        }
      }
    },
    [isZoomed, handleDoubleTap]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touches = e.touches;

      if (isPinching.current && touches.length === 2) {
        e.preventDefault();
        const currentDist = getDistance(touches[0], touches[1]);
        const ratio = currentDist / pinchStartDist.current;
        const newScale = clamp(pinchStartScale.current * ratio, MIN_SCALE, MAX_SCALE);

        // Pan while pinching (follow midpoint)
        const mid = getMidpoint(touches[0], touches[1]);
        const dx = mid.x - panStart.current.x;
        const dy = mid.y - panStart.current.y;

        const tx = translateAtPanStart.current.x + dx;
        const ty = translateAtPanStart.current.y + dy;
        const clamped = clampTranslation(tx, ty, newScale);

        setScale(newScale);
        setTranslate(clamped);
      } else if (isPanning.current && touches.length === 1) {
        e.preventDefault();
        const { clientX, clientY } = touches[0];
        const dx = clientX - panStart.current.x;
        const dy = clientY - panStart.current.y;

        const tx = translateAtPanStart.current.x + dx;
        const ty = translateAtPanStart.current.y + dy;
        const clamped = clampTranslation(tx, ty, scaleRef.current);

        setTranslate(clamped);
      } else if (isSwiping.current && touches.length === 1) {
        // Only prevent default for horizontal swipes (to avoid scroll)
        const deltaX = Math.abs(swipeStart.current.x - touches[0].clientX);
        if (deltaX > 10) e.preventDefault();
      }
    },
    [clampTranslation]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      // If we were pinching and one finger lifts, stop pinching, don't do anything else
      if (isPinching.current) {
        isPinching.current = false;

        // Snap back if below 1
        if (scaleRef.current < 1.05) {
          resetZoom(true);
        }
        return;
      }

      // Swipe navigation (only when not zoomed)
      if (isSwiping.current && e.changedTouches.length === 1) {
        isSwiping.current = false;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = swipeStart.current.x - endX;
        const deltaY = swipeStart.current.y - endY;

        setShowIndicators(false);

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (Math.abs(deltaX) > CLOSE_SWIPE_THRESHOLD) {
            handleClose();
          } else if (deltaX > SWIPE_THRESHOLD && images.length > 1) {
            nextImage();
          } else if (deltaX < -SWIPE_THRESHOLD && images.length > 1) {
            prevImage();
          }
        }
      }

      isPanning.current = false;
    },
    [handleClose, images.length, nextImage, prevImage, resetZoom]
  );

  // ── Mouse wheel zoom (desktop) ─────────────────────────────────────
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left - rect.width / 2;
      const cursorY = e.clientY - rect.top - rect.height / 2;

      const delta = -e.deltaY * 0.002;
      const newScale = clamp(scaleRef.current * (1 + delta), MIN_SCALE, MAX_SCALE);

      if (newScale <= 1.05) {
        resetZoom(true);
        return;
      }

      // Adjust translation so zoom targets cursor position
      const scaleFactor = newScale / scaleRef.current;
      const tx = translateRef.current.x * scaleFactor - cursorX * (scaleFactor - 1);
      const ty = translateRef.current.y * scaleFactor - cursorY * (scaleFactor - 1);

      const clamped = clampTranslation(tx, ty, newScale);
      setScale(newScale);
      setTranslate(clamped);
    },
    [clampTranslation, resetZoom]
  );

  // ── Keyboard navigation ─────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [prevImage, nextImage, handleClose]);

  // ── Browser history ─────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && !window.history.state?.lightbox) {
      window.history.pushState({ lightbox: true }, "");
    }

    const handlePopstate = () => {
      onCloseProp();
    };

    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, [onCloseProp]);

  // ── Lock body scroll ────────────────────────────────────────────────
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

  // ── Zoom indicator (shows briefly when zoomed) ──────────────────────
  const [showZoomLevel, setShowZoomLevel] = useState(false);
  const zoomTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (scale !== 1) {
      setShowZoomLevel(true);
      clearTimeout(zoomTimer.current);
      zoomTimer.current = setTimeout(() => setShowZoomLevel(false), 800);
    } else {
      setShowZoomLevel(false);
    }
    return () => clearTimeout(zoomTimer.current);
  }, [scale]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-[9999] flex items-center justify-center touch-none select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      style={{ touchAction: "none" }}
    >
      {/* Close Button */}
      <button
        aria-label="Close"
        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full z-50 transition-colors"
        onClick={handleClose}
      >
        <X size={28} />
      </button>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-50">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Zoom Level Indicator */}
      {showZoomLevel && (
        <div
          className="absolute top-14 left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium z-50 pointer-events-none"
          style={{
            animation: "fadeInOut 0.2s ease-out",
          }}
        >
          {Math.round(scale * 100)}%
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Main Image (zoomable) */}
      <div
        className="relative w-full h-full p-4 md:p-8"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: transitioning
            ? `transform ${SPRING_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
            : "none",
          willChange: "transform",
        }}
      >
        <Image
          src={getUrl(images[currentIndex]) || ""}
          alt={`Image ${currentIndex + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
          priority
          quality={90}
          draggable={false}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </div>

      {/* Mobile hint: double-tap to zoom */}
      {!isZoomed && showIndicators && (
        <div className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 text-white/40 text-xs z-40 pointer-events-none animate-pulse">
          Double-tap to zoom
        </div>
      )}

      {/* Mobile Swipe Indicators */}
      {images.length > 1 && showIndicators && !isZoomed && (
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

      {/* Mobile Action Buttons */}
      {(onAddToCart || onBuyNow) && (
        <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="px-4 py-3 flex gap-3">
            {onAddToCart && (
              <button
                onClick={() => {
                  handleClose(); // Close lightbox first
                  setTimeout(() => onAddToCart(), 100); // Then execute action
                }}
                disabled={availableStock === 0}
                className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            )}
            {onBuyNow && (
              <button
                onClick={() => {
                  handleClose(); // Close lightbox first
                  setTimeout(() => onBuyNow(), 100); // Then execute action
                }}
                disabled={availableStock === 0}
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Inline keyframe for zoom indicator fade */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInOut {
          from { opacity: 0; transform: translateX(-50%) scale(0.9); }
          to { opacity: 1; transform: translateX(-50%) scale(1); }
        }
      ` }} />
    </div>
  );
}
