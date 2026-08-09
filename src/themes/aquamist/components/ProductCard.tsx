"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import GlassCard from "./GlassCard";
import type { Product } from "@/components/productDetail/productDetailDto";
import { useCart } from "@/hooks/useCart";
import { useCartContext } from "@/context/CartContext";
import { useAppUIContext } from "@/context/AppUIContext";
import { formatPrice } from "@/lib/utils";
import { queryKeys } from "@/lib/queryKeys";
import { productsService } from "@/services/productsService";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { addToCart } = useCart();
  const { setIsCartOpen } = useCartContext();
  const { setQuickAddProduct } = useAppUIContext();

  const {
    _id,
    productName,
    description,
    salePrice,
    discount,
    isNew,
    isLimited,
    images,
    seo,
    parentCategoryName,
    childCategoryName,
    options,
  } = product;

   const defaultBlur =
    "data:image/svg+xml;base64," +
    btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f0f0f0" stop-opacity="1" />
          <stop offset="20%" stop-color="#e0e0e0" stop-opacity="1" />
          <stop offset="40%" stop-color="#f8f8f8" stop-opacity="1" />
          <stop offset="60%" stop-color="#e0e0e0" stop-opacity="1" />
          <stop offset="100%" stop-color="#f0f0f0" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" fill="#f0f0f0" />
      <rect width="32" height="32" fill="url(#shimmer)" opacity="0.7" />
    </svg>`,
    );
  const slug = seo?.slug || _id;
  const imageSrc = images?.[0]?.src || "";
  const imageAlt = images?.[0]?.alt || productName;
  const baseUrl = images?.[0]?.blurDataURL || defaultBlur;

  // Badge mapping
  const badge = isNew
    ? "New"
    : isLimited
      ? "Limited"
      : Number(discount) > 0
        ? "Sale"
        : null;

  const badgeStyle =
    badge === "New"
      ? "bg-aq-primary/20 backdrop-blur-md border border-aq-primary/30 text-aq-primary"
      : "bg-white/10 backdrop-blur-md border border-white/20 text-aq-on-surface";

  // Prefetch product details on hover to make user experience instant
  const prefetchProduct = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.detail(slug),
      queryFn: () => productsService.getProductBySlug(slug),
      staleTime: 1000 * 60 * 5,
    });
    router.prefetch(`/product-detail/${slug}`);
  }, [queryClient, router, slug]);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const hasOptions = product.isVariant || (options && options.length > 0);
    if (hasOptions) {
      // Trigger the Quick Add Modal for variant selection
      setQuickAddProduct(product);
    } else {
      addToCart({ product, quantity: 1 });
      setTimeout(() => {
        setIsCartOpen(true);
      }, 1000);
    }
  };
 

  return (
    <Link
      href={`/product-detail/${slug}`}
      className="flex flex-col h-full animate-fadeIn"
      onMouseEnter={prefetchProduct}
      onTouchStart={prefetchProduct}
    >
      <GlassCard className="rounded-[20px] overflow-hidden flex flex-col group cursor-pointer h-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] hover:border-aq-primary/30">
        {/* Product Image */}
        <div className="relative h-72  lg:h-64 bg-aq-surface-container-low/30 overflow-hidden w-full">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-aq-surface/60 via-aq-surface/10 to-transparent z-10" />

          {/* Badge */}
          {badge && (
            <span
              className={[
                "absolute top-3 left-3 sm:top-4 sm:left-4 z-20 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-inter font-semibold tracking-[0.08em]",
                badgeStyle,
              ].join(" ")}
            >
              {badge}
            </span>
          )}

          {/* Product image */}
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              placeholder="blur"
              blurDataURL={baseUrl}
            />
          ) : (
            <div className="relative w-full h-full bg-aq-surface-container-low/20 rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-aq-on-surface-variant/40 text-4xl">
                image
              </span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-grow">
          <h3 className="font-eb-garamond text-lg sm:text-xl lg:text-[24px] leading-tight sm:leading-[32px] font-medium text-aq-on-surface mb-1.5 line-clamp-2 group-hover:text-aq-primary transition-colors">
            {productName}
          </h3>
          {(childCategoryName || parentCategoryName) && (
            <p className="font-inter text-[11px] sm:text-[12px] tracking-[0.08em] font-semibold text-aq-primary mb-2 sm:mb-4 uppercase">
              {childCategoryName || parentCategoryName}
            </p>
          )}
          {description && (
            <p className="font-inter text-xs sm:text-sm text-aq-on-surface-variant mb-4 flex-grow leading-relaxed line-clamp-2 sm:line-clamp-3">
              {description}
            </p>
          )}

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-auto pt-2 gap-2">
            <span className="font-inter text-base sm:text-lg font-bold text-aq-on-surface shrink-0">
              PKR {formatPrice(salePrice)}
            </span>
            <button
              onClick={handleAddToCart}
              className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full border border-aq-primary text-aq-primary hover:bg-aq-primary hover:text-aq-on-primary font-inter text-[11px] sm:text-xs font-semibold tracking-[0.08em] transition-all duration-300 transform active:scale-95 shrink-0"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
