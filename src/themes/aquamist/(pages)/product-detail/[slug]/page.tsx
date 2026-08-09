import React from "react";
import type { Metadata } from "next";
import AquaMistProductDetailContent from "@/themes/aquamist/components/ProductDetailContent";

interface PageProps {
  params: {
    slug: string;
  };
}

export const metadata: Metadata = {
  title: "Product Detail — HumidAura",
  description: "Experience premium ultrasonic hydration and whisper-quiet serenity.",
};

/**
 * AquaMist Product Detail page route component.
 *
 * Renders the theme-specific AquaMistProductDetailContent client component
 * passing the dynamic slug from Next.js dynamic routing.
 */
export default function AquaMistProductDetailPage({ params: { slug } }: PageProps) {
  return <AquaMistProductDetailContent slug={slug} />;
}
