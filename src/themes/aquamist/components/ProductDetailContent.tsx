"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useGetProductDetailBySlug, useGetProductRelatedInfo } from "@/components/productDetail/productDetailQuery";
import { useCart } from "@/hooks/useCart";
import { useAppUIContext } from "@/context/AppUIContext";
import { useAuth } from "@/context/AuthContext";
import { useCategoriesQuery } from "@/hooks/useProductsQuery";
import { calculateDiscountedPrice } from "@/lib/utils";
import GlassCard from "./GlassCard";
import ProductCard from "./ProductCard";
import ProductDetailSkeleton from "@/components/productDetail/components/ProductDetailSkeleton";
import RichTextRenderer from "@/components/RichTextRenderer";
import AquaMistReviews from "./AquaMistReviews";
import ImageGallery from "@/components/Gallery";

// ── Color button hex mapping ───────────────────────────────────────────────
const COLOR_HEX_MAP: Record<string, string> = {
  "pearl white": "#ffffff",
  "white": "#ffffff",
  "mist gray": "#8e9b9a",
  "gray": "#8e9b9a",
  "sage": "#9eaba3",
  "green": "#2e7d32",
  "red gold": "#b76e79",
  "rose gold": "#b76e79",
  "gold": "#d4af37",
  "silver": "#c0c0c0",
  "bronze": "#cd7f32",
  "copper": "#b87333",
  "black": "#111111",
  "charcoal": "#36454f",
  "navy": "#1a237e",
  "blue": "#1565c0",
  "red": "#c62828",
  "yellow": "#fbc02d",
  "orange": "#ef6c00",
  "purple": "#6a1b9a",
  "pink": "#ad1457",
  "brown": "#4e342e",
  "beige": "#f5f5dc",
  "sand": "#c2b280",
  "cream": "#fffdd0",
  "peach": "#ffdab9",
  "lavender": "#e6e6fa",
  "olive": "#556b2f",
  "teal": "#008080",
  "cyan": "#00ffff",
  "magenta": "#ff00ff",
  "maroon": "#800000",
};

interface ProductDetailContentProps {
  slug: string;
}

// ── Below-the-fold lazy section ───────────────────────────────────────────
function BelowFoldSection({ productId, productSlug, userId, authToken, productImages, description }: {
  productId: string;
  productSlug: string;
  userId?: string;
  authToken?: string | null;
  productImages?: { src: string; alt?: string }[];
  description?: string;
}) {
  const { selectedCategory } = useAppUIContext();
  const { data: categoriesData } = useCategoriesQuery();

  const category = useMemo(
    () => categoriesData?.categories?.find((item: any) => item.slug === selectedCategory) ?? null,
    [categoriesData, selectedCategory]
  );

  const { data: relatedInfo, isLoading: relatedLoading } = useGetProductRelatedInfo({
    parentCategorySlug: selectedCategory as string,
    categoryId: category?._id,
    productId,
  });

  const relatedProducts = useMemo(() =>
    (relatedInfo?.data?.related || []).filter((p: any) => p.seo?.slug !== productSlug),
    [relatedInfo, productSlug]
  );

  const recommendedProducts = useMemo(() =>
    (relatedInfo?.data?.recommended || []).filter((p: any) => p.seo?.slug !== productSlug),
    [relatedInfo, productSlug]
  );

  const [activeTab, setActiveTab] = useState<"related" | "recommended" | "reviews">("related");

  return (
    <div className="mt-0">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MOBILE SCROLL-BASED SECTIONS (< sm)                                */}
      {/* Sequence: Reviews → Description → Images → More to Love → Recommended */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="sm:hidden space-y-10">
        {/* 1. REVIEWS */}
        <section id="mobile-section-reviews" className="px-4">
          <h2 className="font-eb-garamond text-2xl text-aq-on-surface mb-4 font-light border-b border-white/10 pb-2">
            Reviews
          </h2>
          <AquaMistReviews
            productId={productId}
            userId={userId}
            authToken={authToken}
          />
        </section>

        {/* 2. DESCRIPTION (if available) */}
        {description && (
          <section id="mobile-section-description" className="px-4">
            <h2 className="font-eb-garamond text-2xl text-aq-on-surface mb-4 font-light border-b border-white/10 pb-2">
              Product Description
            </h2>
            <div className="aq-rich-text font-inter text-aq-on-surface-variant text-sm leading-relaxed">
              <RichTextRenderer content={description} />
            </div>
          </section>
        )}

        {/* 3. STACKED IMAGES (Full Width - no horizontal padding) */}
        {productImages && productImages.length > 0 && (
          <section id="mobile-section-images" className="w-full">
            <div className="flex flex-col gap-0 w-full">
              {productImages.map((img, idx) => (
                <Image
                  key={idx}
                  src={img.src}
                  alt={img.alt || `Product detail ${idx + 1}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto block object-contain border-0 p-0 m-0"
                  unoptimized
                />
              ))}
            </div>
          </section>
        )}

        {/* 4. MORE TO LOVE (Related Products) */}
        <section id="mobile-section-related" className="px-4">
          <h2 className="font-eb-garamond text-2xl text-aq-on-surface mb-4 font-light border-b border-white/10 pb-2">
            More to Love
          </h2>
          {relatedLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-64 rounded-[20px] bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {relatedProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-aq-on-surface-variant py-6 font-inter text-sm">
              No related products found.
            </div>
          )}
        </section>

        {/* 5. RECOMMENDED FOR YOU */}
        <section id="mobile-section-recommended" className="px-4">
          <h2 className="font-eb-garamond text-2xl text-aq-on-surface mb-4 font-light border-b border-white/10 pb-2">
            Recommended For You
          </h2>
          {relatedLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-64 rounded-[20px] bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {recommendedProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-aq-on-surface-variant py-6 font-inter text-sm">
              No recommended products found.
            </div>
          )}
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* DESKTOP TABS (hidden on mobile)                                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden sm:block">
        {/* Tab Row */}
        <div className="flex gap-0 border-b border-white/10 mb-8 sm:mb-10 overflow-x-auto scrollbar-none whitespace-nowrap">
          {(["related", "recommended", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "px-4 sm:px-6 py-3 font-inter text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-300 border-b-2 -mb-[2px] shrink-0",
                activeTab === tab
                  ? "border-aq-primary text-aq-primary"
                  : "border-transparent text-aq-on-surface-variant hover:text-aq-on-surface",
              ].join(" ")}
            >
              {tab === "related" ? "More to Love" : tab === "recommended" ? "Recommended" : "Reviews"}
            </button>
          ))}
        </div>

        {/* Related Products */}
        {activeTab === "related" && (
          relatedLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 rounded-[16px] bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-aq-on-surface-variant py-12 font-inter">
              No related products found.
            </div>
          )
        )}

        {/* Recommended Products */}
        {activeTab === "recommended" && (
          relatedLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 rounded-[16px] bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-aq-on-surface-variant py-12 font-inter">
              No recommended products found.
            </div>
          )
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <AquaMistReviews
            productId={productId}
            userId={userId}
            authToken={authToken}
          />
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AquaMistProductDetailContent({ slug }: ProductDetailContentProps) {
  const router = useRouter();
  const { userId, authToken } = useAuth();
  const { addToCart } = useCart();
  const { updateProductDetailData } = useAppUIContext();

  // Fetch product detail
  const { data: product, isLoading } = useGetProductDetailBySlug(slug);

  // ── States ────────────────────────────────────────────────────────────────
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [availableStock, setAvailableStock] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [extraCost, setExtraCost] = useState(0);
  const [validation, setValidation] = useState({ colorRequired: false, sizeRequired: false });

  // ── Lazy-load trigger ─────────────────────────────────────────────────────
  const [belowFoldLoaded, setBelowFoldLoaded] = useState(false);
  const { ref: belowFoldRef, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  useEffect(() => { if (inView) setBelowFoldLoaded(true); }, [inView]);

  // ── Stock check helpers ───────────────────────────────────────────────────
  const isColorDisabled = useCallback((color: string) => {
    if (!product?.variants || product.variants.length === 0) {
      return (product?.stock ?? 0) <= 0;
    }
    const colorVariants = product.variants.filter((v: any) =>
      v.name.toLowerCase().includes(color.toLowerCase().trim())
    );
    if (colorVariants.length === 0) return false;
    return colorVariants.every((v: any) => (v.stock ?? 0) <= 0);
  }, [product]);

  const isSizeDisabled = useCallback((size: string) => {
    if (!product?.variants || product.variants.length === 0) {
      return (product?.stock ?? 0) <= 0;
    }
    if (selectedColor) {
      const targetName = `${selectedColor.trim()} - ${size.trim()}`.toLowerCase();
      const matched = product.variants.find((v: any) => v.name.toLowerCase().trim() === targetName);
      if (matched) return (matched.stock ?? 0) <= 0;
    }
    const sizeVariants = product.variants.filter((v: any) =>
      v.name.toLowerCase().includes(size.toLowerCase().trim())
    );
    if (sizeVariants.length === 0) return false;
    return sizeVariants.every((v: any) => (v.stock ?? 0) <= 0);
  }, [product, selectedColor]);

  // ── Options parsing ───────────────────────────────────────────────────────
  const colors = useMemo(() => {
    if (!product?.options) return [];
    const opt = product.options.find((o) => o.title.toLowerCase() === "color");
    return opt?.values ?? [];
  }, [product?.options]);

  const sizes = useMemo(() => {
    if (!product?.options) return [];
    const opt = product.options.find((o) => o.title.toLowerCase() === "size");
    return opt?.values ?? [];
  }, [product?.options]);

  // ── Initialize defaults ───────────────────────────────────────────────────
  useEffect(() => {
    if (product) {
      setAvailableStock(product.stock < 0 ? 0 : product.stock || 0);
    }
  }, [product]);

  // ── Dynamic price & variant calculation ──────────────────────────────────
  useEffect(() => {
    if (!product) return;

    let variantName = "";
    if (colors.length > 0 && sizes.length > 0) {
      if (selectedColor && selectedSize) variantName = `${selectedColor.trim()} - ${selectedSize}`;
    } else if (colors.length > 0) {
      if (selectedColor) variantName = selectedColor.trim();
    } else if (sizes.length > 0) {
      if (selectedSize) variantName = selectedSize.trim();
    }

    if (variantName) {
      const matchedVariant = product.variants?.find(
        (v) => v.name.toLowerCase().trim() === variantName.toLowerCase().trim()
      );
      if (matchedVariant) {
        setSelectedVariantId(matchedVariant._id);
        setAvailableStock(matchedVariant.stock > 0 ? matchedVariant.stock : 0);
        setExtraCost(matchedVariant.additionalSalePrice ?? 0);
      }
    } else {
      setAvailableStock(product.stock < 0 ? 0 : product.stock || 0);
      setExtraCost(0);
    }
  }, [selectedColor, selectedSize, product, colors, sizes]);

  // Pricing calculations
  const originalPrice = product ? product.salePrice + extraCost : 0;
  const currentPrice = product ? calculateDiscountedPrice(originalPrice, product.discount || 0) : 0;

  // ── Selection Validation (Exact Base Theme Behavior) ────────────────────
  const validateSelection = useCallback(() => {
    if (!product) return false;
    const isColorMissing = colors.length > 0 && !selectedColor;
    const isSizeMissing = sizes.length > 0 && !selectedSize;

    if (isColorMissing || isSizeMissing) {
      setValidation({
        colorRequired: isColorMissing,
        sizeRequired: isSizeMissing,
      });
      const optionEl = document.getElementById("product-options-container");
      if (optionEl) {
        optionEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }
    return true;
  }, [product, colors.length, selectedColor, sizes.length, selectedSize]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    if (!validateSelection()) return;

    addToCart({
      product: product as any,
      quantity: quantity > availableStock ? availableStock : quantity,
      variantID: selectedVariantId || undefined,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    });
  }, [product, validateSelection, quantity, availableStock, selectedVariantId, selectedColor, selectedSize, addToCart]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    if (!validateSelection()) return;

    let variantName = "";
    if (product.isVariant) {
      if (colors.length > 0 && sizes.length > 0) variantName = `${selectedColor.trim()} - ${selectedSize}`;
      else if (colors.length > 0) variantName = selectedColor.trim();
      else if (sizes.length > 0) variantName = selectedSize.trim();
    }

    const mainImage = (product?.images && product.images.length > 0)
      ? (product.images[0]?.src || "")
      : "/placeholder.png";

    updateProductDetailData({
      productName: product.productName,
      items: [{
        productId: product._id,
        variantId: selectedVariantId,
        variantName,
        price: currentPrice,
        quantity,
        lineTotal: currentPrice * quantity,
        image: mainImage,
      }],
      deliveryFee: 0,
      totalPrice: currentPrice * quantity,
      subTotal: currentPrice * quantity,
    });
    router.push("/checkout?section=checkout");
  }, [product, validateSelection, currentPrice, quantity, selectedVariantId, selectedColor, selectedSize, updateProductDetailData, router, colors, sizes]);

  // ── Render guards ─────────────────────────────────────────────────────────
  if (isLoading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="pt-32 pb-48 text-center text-aq-on-surface-variant font-inter">
        <span className="material-symbols-outlined text-6xl text-aq-primary/40 mb-4 block">search_off</span>
        <h2 className="font-eb-garamond text-[32px] text-aq-on-surface mb-3">Product Not Found</h2>
        <p className="text-aq-on-surface-variant mb-8">We couldn&apos;t find this product. Browse our full collection instead.</p>
        <Link
          href="/collections"
          className="inline-block px-8 py-3 rounded-full bg-aq-primary text-aq-on-primary font-inter text-sm font-semibold tracking-wider hover:bg-aq-primary-fixed transition-colors duration-300"
        >
          Go to Collections
        </Link>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0
    ? product.images
    : [{ src: "/placeholder.png", alt: product.productName, _id: "placeholder" }];

  const galleryFormattedImages = productImages.map((img) => ({
    src: img.src,
    alt: img.alt || product.productName,
    blurDataURL: "",
  }));

  return (
    <div className="w-full max-w-[1280px] mx-auto px-0 sm:px-5 md:px-20 pt-24 sm:pt-32 pb-36 sm:pb-32">
      {/* Breadcrumb — Home > Collections only (Option A) */}
      <div className="mb-8 px-4 sm:px-0 font-inter text-[13px] text-white/50 tracking-wide flex items-center gap-2">
        <Link href="/" className="hover:text-aq-primary transition-colors">Home</Link>
        <span>&gt;</span>
        <Link href="/collections" className="hover:text-aq-primary transition-colors">Collections</Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ABOVE THE FOLD — loads immediately                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 lg:mb-24">
        
        {/* Left Column: Image Gallery Component from Base Theme (No outer glass container border/padding) */}
        <div className="lg:col-span-7">
          {/* Override Gallery's internal lg:w-[60%] so it fills the full grid column */}
          <div className="gallery-full-width">
            <ImageGallery
              images={galleryFormattedImages}
              productName={product.productName}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              availableStock={availableStock > 0 ? availableStock : 1}
            />
          </div>
        </div>

        {/* Right Column: Details & Configuration */}
        <div className="lg:col-span-5 flex flex-col justify-center px-4 sm:px-0">

          {/* Product Title — Full Width on Mobile (Next Line) */}
          <h1 className="block w-full font-eb-garamond text-[26px]  sm:text-[28px]  leading-tight mb-3 sm:mb-4 font-light text-aq-on-surface">
            {product.productName}
          </h1>

          {/* Description — Desktop Only (hidden on mobile, shown in long-scroll below reviews) */}
          {product.description && (
            <div className="aq-rich-text hidden sm:block font-inter text-aq-on-surface-variant text-sm sm:text-base leading-relaxed mb-6 max-h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-aq-primary/30 hover:scrollbar-thumb-aq-primary/60">
              <RichTextRenderer content={product.description} />
            </div>
          )}

          {/* Rating — placeholder stars */}
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <div className="flex text-aq-primary">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[18px] sm:text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
            <button
              onClick={() => {
                document.getElementById("below-fold-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-inter text-aq-primary text-xs sm:text-sm font-semibold hover:underline"
            >
              See reviews ↓
            </button>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 sm:gap-4 mb-6 sm:mb-8 border-b border-white/10 pb-6">
            <span className="font-inter text-[26px] sm:text-[32px] font-bold text-aq-on-surface">
              PKR {currentPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="font-inter text-aq-error/60 line-through pb-1 text-base sm:text-lg">
                PKR {originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Options Container (Target for scroll-into-view validation) */}
          <div id="product-options-container" className="space-y-6 mb-6">
            {/* Color Option Selector */}
            {colors.length > 0 && (
              <div>
                <label
                  htmlFor="color-select"
                  className="font-inter text-xs tracking-wider text-aq-on-surface-variant block mb-2 font-semibold uppercase"
                >
                  COLOR: <span className="text-aq-primary">{selectedColor || "Select Color"}</span>
                </label>
                <div className="relative">
                  <select
                    id="color-select"
                    value={selectedColor}
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      setValidation((prev) => ({ ...prev, colorRequired: false }));
                    }}
                    className="w-full appearance-none bg-white/5 border border-white/15 rounded-xl px-4 py-3 font-inter text-sm text-aq-on-surface focus:outline-none focus:border-aq-primary focus:ring-1 focus:ring-aq-primary/30 transition-all cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#0a0f1e] text-white/50">
                      Select Color
                    </option>
                    {colors.map((color) => {
                      const disabled = isColorDisabled(color);
                      return (
                        <option
                          key={color}
                          value={color}
                          disabled={disabled}
                          className={`bg-[#0a0f1e] ${disabled ? "text-white/30 cursor-not-allowed" : "text-white"}`}
                        >
                          {color} {disabled ? "(Sold Out)" : ""}
                        </option>
                      );
                    })}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-aq-on-surface/50">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
                {validation.colorRequired && (
                  <span className="text-xs font-semibold text-red-500 mt-1 block">
                    *Color required
                  </span>
                )}
              </div>
            )}

            {/* Size Option Selector */}
            {sizes.length > 0 && (
              <div>
                <label
                  htmlFor="size-select"
                  className="font-inter text-xs tracking-wider text-aq-on-surface-variant block mb-2 font-semibold uppercase"
                >
                  SIZE: <span className="text-aq-primary">{selectedSize || "Select Size"}</span>
                </label>
                <div className="relative">
                  <select
                    id="size-select"
                    value={selectedSize}
                    onChange={(e) => {
                      setSelectedSize(e.target.value);
                      setValidation((prev) => ({ ...prev, sizeRequired: false }));
                    }}
                    className="w-full appearance-none bg-white/5 border border-white/15 rounded-xl px-4 py-3 font-inter text-sm text-aq-on-surface focus:outline-none focus:border-aq-primary focus:ring-1 focus:ring-aq-primary/30 transition-all cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#0a0f1e] text-white/50">
                      Select Size
                    </option>
                    {sizes.map((size) => {
                      const disabled = isSizeDisabled(size);
                      return (
                        <option
                          key={size}
                          value={size}
                          disabled={disabled}
                          className={`bg-[#0a0f1e] ${disabled ? "text-white/30 cursor-not-allowed" : "text-white"}`}
                        >
                          {size} {disabled ? "(Sold Out)" : ""}
                        </option>
                      );
                    })}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-aq-on-surface/50">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
                {validation.sizeRequired && (
                  <span className="text-xs font-semibold text-red-500 mt-1 block">
                    *Size required
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Add to Cart panel — Hidden on Mobile (Requirement #4) */}
          <div className="hidden sm:flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <GlassCard className="rounded-full flex items-center px-4 h-12 sm:h-14 w-full sm:w-32 justify-between shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="text-aq-on-surface-variant hover:text-aq-on-surface transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <span className="font-inter font-semibold text-aq-on-surface">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="text-aq-on-surface-variant hover:text-aq-on-surface transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </GlassCard>

            <button
              onClick={handleAddToCart}
              className="flex-1 px-6 h-12 sm:h-14 bg-transparent border border-aq-primary text-aq-primary rounded-full font-inter text-xs sm:text-sm font-semibold tracking-wider hover:bg-aq-primary/10 transition-colors duration-300 uppercase"
            >
              ADD TO CART
            </button>
          </div>

          {/* Buy Now CTA — Hidden on Mobile (Requirement #4) */}
          <button
            onClick={handleBuyNow}
            className="hidden sm:block w-full h-12 sm:h-14 bg-aq-primary text-aq-on-primary font-inter text-xs sm:text-sm font-semibold tracking-wider rounded-full hover:bg-aq-primary-fixed transition-colors duration-300 mb-6 sm:mb-8 shadow-[0_0_30px_rgba(189,255,243,0.3)] uppercase"
          >
            BUY NOW
          </button>

          {/* Trust Badges */}
          <div className="flex justify-between items-center px-4 py-6 bg-aq-surface/30 rounded-xl border border-white/5">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="material-symbols-outlined text-aq-primary/80 text-[24px]">local_shipping</span>
              <span className="text-xs font-inter text-aq-on-surface-variant font-medium">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="material-symbols-outlined text-aq-primary/80 text-[24px]">assignment_return</span>
              <span className="text-xs font-inter text-aq-on-surface-variant font-medium">30-Day Returns</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="material-symbols-outlined text-aq-primary/80 text-[24px]">verified_user</span>
              <span className="text-xs font-inter text-aq-on-surface-variant font-medium">2yr Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BELOW THE FOLD — lazy loaded when scrolled into view               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div id="below-fold-section" ref={belowFoldRef}>
        {belowFoldLoaded ? (
          <BelowFoldSection
            productId={product._id}
            productSlug={product.seo?.slug || slug}
            userId={userId}
            authToken={authToken}
            productImages={productImages}
            description={product.description}
          />
        ) : (
          /* Placeholder sentinel that keeps the DOM height stable */
          <div className="h-96 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-aq-on-surface-variant/50">
              <div className="w-8 h-8 border-2 border-aq-primary/30 border-t-aq-primary rounded-full animate-spin" />
              <span className="font-inter text-sm">Loading details…</span>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MOBILE STICKY ACTION BAR — visible only on mobile screens           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0f1e]/95 backdrop-blur-xl border-t border-white/10 p-3 flex items-center gap-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {/* Quantity Stepper */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-full px-3 h-11 w-24 shrink-0">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="text-aq-on-surface/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-base">remove</span>
          </button>
          <span className="font-inter text-xs font-semibold text-aq-on-surface">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="text-aq-on-surface/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-base">add</span>
          </button>
        </div>

        {/* Cart Icon Button (Requirement #6) */}
        <button
          onClick={handleAddToCart}
          aria-label="Add to Cart"
          className="w-12 h-11 bg-white/5 border border-aq-primary/40 text-aq-primary rounded-full flex items-center justify-center hover:bg-aq-primary/10 transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
        </button>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          className="flex-1 h-11 bg-aq-primary text-aq-on-primary rounded-full font-inter text-[11px] font-semibold tracking-wider hover:bg-aq-primary-fixed transition-colors shadow-[0_0_15px_rgba(189,255,243,0.3)] uppercase"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
