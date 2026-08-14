"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useAppUIContext } from "@/context/AppUIContext";
import { useCart } from "@/hooks/useCart";
import { useCartContext } from "@/context/CartContext";
import { calculateDiscountedPrice, formatPrice } from "@/lib/utils";
import { useGetProductDetailBySlug } from "@/components/productDetail/productDetailQuery";
import { useGetStoreSettings } from "@/components/Slider/query/storeSettingQuery";
import { X, ChevronDown, ShoppingCart, Image as ImageIcon } from "lucide-react";

interface QuickAddModalProps {
  theme?: "default" | "aquamist";
}

export default function QuickAddModal({ theme }: QuickAddModalProps) {
  const { quickAddProduct, setQuickAddProduct } = useAppUIContext();
  const { addToCart } = useCart();
  const { setIsCartOpen } = useCartContext();
  const { data: storeSettings } = useGetStoreSettings();

  // Active theme resolution: explicit prop || storeSettings theme || default
  const activeTheme = theme || storeSettings?.theme || "default";
  const isAqua = activeTheme === "aquamist";

  const slug = quickAddProduct?.seo?.slug || quickAddProduct?._id || "";
  const { data: fullProduct, isLoading } = useGetProductDetailBySlug(slug);

  const product = fullProduct || quickAddProduct;

  // ── States ────────────────────────────────────────────────────────────────
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [availableStock, setAvailableStock] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [extraCost, setExtraCost] = useState(0);
  const [validation, setValidation] = useState({ colorRequired: false, sizeRequired: false });

  // ── Options parsing ───────────────────────────────────────────────────────
  const colors = useMemo(() => {
    if (!product?.options) return [];
    const opt = product.options.find((o: any) => o.title.toLowerCase() === "color");
    return opt?.values ?? [];
  }, [product?.options]);

  const sizes = useMemo(() => {
    if (!product?.options) return [];
    const opt = product.options.find((o: any) => o.title.toLowerCase() === "size");
    return opt?.values ?? [];
  }, [product?.options]);

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

  // ── Initialize defaults ───────────────────────────────────────────────────
  useEffect(() => {
    if (product) {
      setAvailableStock(product.stock < 0 ? 0 : product.stock || 0);
      setQuantity(1);
      setSelectedColor("");
      setSelectedSize("");
      setSelectedVariantId("");
      setValidation({ colorRequired: false, sizeRequired: false });
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
        (v: any) => v.name.toLowerCase().trim() === variantName.toLowerCase().trim()
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

  // ── Selection Validation ──────────────────────────────────────────────────
  const validateSelection = useCallback(() => {
    if (!product) return false;
    const isColorMissing = colors.length > 0 && !selectedColor;
    const isSizeMissing = sizes.length > 0 && !selectedSize;

    if (isColorMissing || isSizeMissing) {
      setValidation({
        colorRequired: isColorMissing,
        sizeRequired: isSizeMissing,
      });
      return false;
    }
    return true;
  }, [product, colors.length, selectedColor, sizes.length, selectedSize]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleClose = () => setQuickAddProduct(null);

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
    handleClose();
    setTimeout(() => setIsCartOpen(true), 300);
  }, [product, validateSelection, quantity, availableStock, selectedVariantId, selectedColor, selectedSize, addToCart, setIsCartOpen]);

  if (!product) return null;

  const imageSrc = product.images?.[0]?.src || "";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${
          isAqua ? "bg-black/60 backdrop-blur-md" : "bg-black/50 backdrop-blur-sm"
        }`}
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className={`relative w-full max-w-lg overflow-hidden flex flex-col sm:flex-row animate-in fade-in zoom-in-95 duration-300 ${
        isAqua 
          ? "bg-aq-surface border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)] rounded-[24px]"
          : "bg-white border border-gray-200 shadow-2xl rounded-2xl"
      }`}>
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          aria-label="Close Modal"
          className={`absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            isAqua
              ? "bg-black/20 text-white hover:bg-black/40 border border-white/10"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black border border-gray-200"
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image Section */}
        <div className={`w-full sm:w-[45%] h-56 sm:h-auto relative shrink-0 ${
          isAqua ? "bg-aq-surface-container-low/30" : "bg-gray-100"
        }`}>
           {imageSrc ? (
             <Image src={imageSrc} alt={product.productName} fill className="object-cover" unoptimized />
           ) : (
             <div className="w-full h-full flex items-center justify-center">
               <ImageIcon className={`w-10 h-10 ${
                 isAqua ? "text-aq-on-surface-variant/40" : "text-gray-400"
               }`} />
             </div>
           )}
        </div>

        {/* Details Section */}
        <div className={`flex-1 p-6 flex flex-col ${
          isAqua ? "bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl" : "bg-white"
        }`}>
          <h2 className={`mb-1 line-clamp-2 leading-tight ${
            isAqua ? "font-eb-garamond text-2xl text-aq-on-surface" : "font-jost text-xl font-bold text-gray-900"
          }`}>
            {product.productName}
          </h2>
          
          <p className={`mb-6 ${
            isAqua ? "font-inter font-bold text-aq-primary text-lg" : "font-jost font-bold text-black text-xl"
          }`}>
            PKR {formatPrice(currentPrice)}
          </p>

          {/* Options Dropdowns */}
          <div className="space-y-4 mb-6 flex-grow">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className={`h-10 rounded-xl ${isAqua ? "bg-white/10" : "bg-gray-200"}`} />
                <div className={`h-10 rounded-xl ${isAqua ? "bg-white/10" : "bg-gray-200"}`} />
              </div>
            ) : (
              <>
                {colors.length > 0 && (
                  <div>
                    <label 
                      htmlFor="modal-color-select" 
                      className={`block mb-1.5 uppercase ${
                        isAqua 
                          ? "font-inter text-[10px] font-semibold text-aq-on-surface/60 tracking-widest" 
                          : "font-jost text-xs font-semibold text-gray-700 tracking-wider"
                      }`}
                    >
                      COLOR: <span className={isAqua ? "text-aq-primary" : "text-black"}>{selectedColor || "Select Color"}</span>
                    </label>
                    <div className="relative">
                      <select
                        id="modal-color-select"
                        value={selectedColor}
                        onChange={(e) => {
                          setSelectedColor(e.target.value);
                          setValidation((prev) => ({ ...prev, colorRequired: false }));
                        }}
                        className={`w-full appearance-none px-4 py-2.5 transition-all cursor-pointer ${
                          isAqua
                            ? `bg-white/5 border rounded-xl font-inter text-xs text-aq-on-surface focus:outline-none ${
                                validation.colorRequired
                                  ? "border-red-500 ring-1 ring-red-500/50"
                                  : "border-white/15 focus:border-aq-primary focus:ring-1 focus:ring-aq-primary/30"
                              }`
                            : `bg-gray-50 border rounded-lg font-jost text-sm text-gray-900 focus:outline-none ${
                                validation.colorRequired
                                  ? "border-red-500 ring-1 ring-red-500/50"
                                  : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                              }`
                        }`}
                      >
                        <option value="" disabled className={isAqua ? "bg-[#0a0f1e] text-white/50" : "bg-white text-gray-400"}>
                          Select Color
                        </option>
                        {colors.map((c: string) => {
                          const disabled = isColorDisabled(c);
                          return (
                            <option
                              key={c}
                              value={c}
                              disabled={disabled}
                              className={
                                isAqua 
                                  ? `bg-[#0a0f1e] ${disabled ? "text-white/30 cursor-not-allowed" : "text-white"}`
                                  : `bg-white ${disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-900"}`
                              }
                            >
                              {c} {disabled ? "(Sold Out)" : ""}
                            </option>
                          );
                        })}
                      </select>
                      <div className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
                        isAqua ? "text-aq-on-surface/50" : "text-gray-500"
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                    {validation.colorRequired && (
                      <span className={`mt-1 block font-semibold ${isAqua ? "text-[11px] text-red-500" : "text-xs text-red-600"}`}>
                        *Color required
                      </span>
                    )}
                  </div>
                )}

                {sizes.length > 0 && (
                  <div>
                    <label 
                      htmlFor="modal-size-select" 
                      className={`block mb-1.5 uppercase ${
                        isAqua 
                          ? "font-inter text-[10px] font-semibold text-aq-on-surface/60 tracking-widest" 
                          : "font-jost text-xs font-semibold text-gray-700 tracking-wider"
                      }`}
                    >
                      SIZE: <span className={isAqua ? "text-aq-primary" : "text-black"}>{selectedSize || "Select Size"}</span>
                    </label>
                    <div className="relative">
                      <select
                        id="modal-size-select"
                        value={selectedSize}
                        onChange={(e) => {
                          setSelectedSize(e.target.value);
                          setValidation((prev) => ({ ...prev, sizeRequired: false }));
                        }}
                        className={`w-full appearance-none px-4 py-2.5 transition-all cursor-pointer ${
                          isAqua
                            ? `bg-white/5 border rounded-xl font-inter text-xs text-aq-on-surface focus:outline-none ${
                                validation.sizeRequired
                                  ? "border-red-500 ring-1 ring-red-500/50"
                                  : "border-white/15 focus:border-aq-primary focus:ring-1 focus:ring-aq-primary/30"
                              }`
                            : `bg-gray-50 border rounded-lg font-jost text-sm text-gray-900 focus:outline-none ${
                                validation.sizeRequired
                                  ? "border-red-500 ring-1 ring-red-500/50"
                                  : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                              }`
                        }`}
                      >
                        <option value="" disabled className={isAqua ? "bg-[#0a0f1e] text-white/50" : "bg-white text-gray-400"}>
                          Select Size
                        </option>
                        {sizes.map((s: string) => {
                          const disabled = isSizeDisabled(s);
                          return (
                            <option
                              key={s}
                              value={s}
                              disabled={disabled}
                              className={
                                isAqua 
                                  ? `bg-[#0a0f1e] ${disabled ? "text-white/30 cursor-not-allowed" : "text-white"}`
                                  : `bg-white ${disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-900"}`
                              }
                            >
                              {s} {disabled ? "(Sold Out)" : ""}
                            </option>
                          );
                        })}
                      </select>
                      <div className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
                        isAqua ? "text-aq-on-surface/50" : "text-gray-500"
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                    {validation.sizeRequired && (
                      <span className={`mt-1 block font-semibold ${isAqua ? "text-[11px] text-red-500" : "text-xs text-red-600"}`}>
                        *Size required
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={availableStock <= 0}
            className={`w-full mt-auto flex items-center justify-center gap-2 transition-all duration-300 uppercase ${
              isAqua
                ? `rounded-full font-inter font-semibold text-[11px] tracking-[0.15em] py-3.5 ${
                    availableStock > 0 
                      ? "bg-aq-primary text-aq-on-primary hover:brightness-110 shadow-[0_4px_20px_rgba(189,255,243,0.15)] hover:shadow-[0_4px_25px_rgba(189,255,243,0.25)] hover:-translate-y-0.5 active:scale-95" 
                      : "bg-white/5 border border-white/10 text-aq-on-surface/30 cursor-not-allowed"
                  }`
                : `rounded-lg font-jost font-semibold text-xs tracking-wider py-3 ${
                    availableStock > 0
                      ? "bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg active:scale-98"
                      : "bg-gray-200 border border-gray-300 text-gray-400 cursor-not-allowed"
                  }`
            }`}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            {availableStock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
