"use client";

import React from "react";
import { useInView } from "react-intersection-observer";

interface ScrollRevealProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  /** Reserve height while content hasn't loaded yet — prevents CLS */
  minHeight?: string;
}

export default function ScrollReveal({
  children,
  fallback,
  rootMargin = "800px 0px", // pre-load well before viewport edge
  minHeight,
}: ScrollRevealProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin,
  });

  return (
    <div
      ref={ref}
      style={!inView && minHeight ? { minHeight } : undefined}
    >
      {inView ? children : (fallback ?? null)}
    </div>
  );
}
