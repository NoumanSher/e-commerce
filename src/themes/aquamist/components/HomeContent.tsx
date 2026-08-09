"use client";

import React, { useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import type { Product } from "@/components/productDetail/productDetailDto";
import CategorySlider from "@/components/CategorySlider/CategorySlider";
import AquaMistFaqSection from "./FaqSection";
import { useAppUIContext } from "@/context/AppUIContext";

const MOCK_PRODUCTS: Partial<Product>[] = [
  {
    _id: "auraflow-pro",
    productName: "AuraFlow Pro",
    description: "Advanced misting technology for large spaces.",
    salePrice: 249,
    discount: 0,
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSF6GE5NMk_k6jKIPPAKboK4qqSJzvXEE8X3Bj5bSBE3VgJNbOAkiMVLMueYSvzu-Pw6kq-HtghjvA5jLyO0J1otsFLVeLbQt1FRek6_4z4uHQPaXLHeT_sKzEAjBWSwkjvI52mzTqOKa-hQz35lMrRx-MLEFrWc5uyYoUobs98_lu948AQV_LdMSXyTxlzUigSRKy2tD63uVdE9GiLybF28HUNz_SCqHC0T4QP2lWCEL578dteC1fuWNmZmQYq6x6leILvrBDC6Q",
        alt: "Conical white humidifier emitting mist on a dark surface",
        blurDataURL: "",
        isThumbnail: true,
        _id: "img-1",
      },
    ],
    parentCategoryName: "Large Spaces",
    options: [],
    variants: [],
  },
  {
    _id: "puremist-compact",
    productName: "PureMist Compact",
    description: "Whisper-quiet hydration designed for nightstands.",
    salePrice: 129,
    discount: 15,
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD34FqL9CgZ95sLqZp34947-oP0Q2_P-K_M-lS5Q4y078G-oY8qO5K-c8H650Y30P_M8G0Y23P",
        alt: "Compact white humidifier on a wooden bedside table",
        blurDataURL: "",
        isThumbnail: true,
        _id: "img-2",
      },
    ],
    parentCategoryName: "Bedroom",
    options: [],
    variants: [],
  },
  {
    _id: "zenmist-stone",
    productName: "ZenMist Stone",
    description: "Organic ceramic finish with integrated ambient warm lighting.",
    salePrice: 189,
    discount: 0,
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHp28498gK-84j102-76345p-O_L88Z42011Y-7Z79Y-356L",
        alt: "Matte grey stone diffuser emitting mist next to green leaves",
        blurDataURL: "",
        isThumbnail: true,
        _id: "img-3",
      },
    ],
    parentCategoryName: "Living Room",
    options: [],
    variants: [],
  },
];

const PRESS = ["Forbes", "Vogue Living", "TechCrunch"];

export default function AquaMistHomeContent() {
  const { selectedCategory, isHydrated } = useAppUIContext();
  // Use selectedCategory only after hydration to avoid SSR text mismatch
  const activeCategory = isHydrated ? selectedCategory : null;

  // Ref to the products section — used to scroll into view on category select
  const productsSectionRef = useRef<HTMLElement>(null);

  // Query live products matching selected category if set
  const { data: productsData, isLoading } = useProductsQuery({
    categorySlug: activeCategory || undefined,
    page: 1,
    limit: 6,
    mode: "client",
  });

  // Use live products if available, else fall back to beautiful mock items
  const products = useMemo(() => {
    if (productsData?.data && productsData.data.length > 0) {
      return productsData.data.slice(0, 6);
    }
    if (activeCategory) {
      return (MOCK_PRODUCTS as Product[]).filter(
        (p) => p.parentCategoryName?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    return MOCK_PRODUCTS as Product[];
  }, [productsData, activeCategory]);

  // Scroll to products section when a category is selected
  useEffect(() => {
    if (!isHydrated || !activeCategory) return;
    productsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeCategory, isHydrated]);

  return (
    <>
      {/* ── Category Slider Carousel ────────────────────────────────────────── */}
      <section className="pt-12 pb-4">
        <CategorySlider theme="aquamist" title="Shop by Category" navigateOnClick={false} />
      </section>

      {/* ── Best Sellers / Featured Grid ─────────────────────────────────── */}
      <section ref={productsSectionRef} className="py-20 px-5 md:px-20 max-w-[1280px] mx-auto scroll-mt-24">
        <div className="text-center mb-14">
          <span className="text-aq-primary-container font-inter text-[14px] tracking-[0.2em] font-semibold block mb-3 uppercase" suppressHydrationWarning>
            {activeCategory ? `Category: ${activeCategory}` : "BEST SELLERS"}
          </span>
          <h2 className="font-eb-garamond text-[40px] md:text-[48px] leading-[48px] md:leading-[56px] text-aq-on-surface" suppressHydrationWarning>
            {activeCategory ? "Explore Featured Products" : "Our Most Loved"}
          </h2>
        </div>

        {isLoading && (!(productsData as any)?.data || (productsData as any).data.length === 0) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aquamist-loader-card aspect-[3/4] rounded-[20px] bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/60">
            No products found in this category.
          </div>
        )}

        {/* ── See All Collections Button ──────────────────────────────────── */}
        <div className="flex justify-center mt-14">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-aq-primary-container text-aq-on-primary-container px-8 py-3.5 rounded-full font-inter text-sm font-semibold tracking-widest hover:bg-aq-primary transition-all duration-300 shadow-[0_0_20px_rgba(125,232,216,0.25)] hover:shadow-[0_0_30px_rgba(125,232,216,0.45)] hover:scale-105"
          >
            See All Collections &rarr;
          </Link>
        </div>
      </section>

      {/* ── Press Strip ──────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-white/10 bg-aq-surface-container-lowest/50">
        <div className="max-w-[1280px] mx-auto px-5 md:px-20 text-center">
          <p className="text-aq-on-surface-variant font-inter text-sm mb-8 tracking-widest font-semibold">
            AS SEEN IN
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {PRESS.map((name) => (
              <span
                key={name}
                className="font-eb-garamond text-2xl font-bold text-aq-on-surface"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ────────────────────────────────────────────────── */}
      <AquaMistFaqSection />
    </>
  );
}
