"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/types";
import GlassCard from "./GlassCard";
import { toast } from "react-toastify";

import { calculateItemPrice } from "@/lib/cartUtils";
import { useShippingFee } from "@/hooks/useShippingFee";

function formatPKR(n: number) {
  return `PKR ${n.toLocaleString("en-PK")}`;
}

// ── Quantity Stepper ──────────────────────────────────────────────────────────

function QuantityStepper({
  value,
  onDecrement,
  onIncrement,
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex items-center gap-4 bg-white/5 rounded-full px-4 py-2 border border-white/10 select-none">
      <button
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className="text-aq-on-surface/60 hover:text-aq-primary transition-colors duration-200 text-lg leading-none font-light w-4 text-center"
      >
        −
      </button>
      <span className="font-inter text-sm font-medium text-aq-on-surface w-5 text-center">
        {value}
      </span>
      <button
        onClick={onIncrement}
        aria-label="Increase quantity"
        className="text-aq-on-surface/60 hover:text-aq-primary transition-colors duration-200 text-lg leading-none font-light w-4 text-center"
      >
        +
      </button>
    </div>
  );
}

// ── Real CartItem Row ─────────────────────────────────────────────────────────

function RealCartRow({
  item,
  onRemove,
  onDecrement,
  onIncrement,
  removing,
}: {
  item: CartItem;
  onRemove: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
  removing: boolean;
}) {
  const images = item.product.images as any;
  const imgSrc = typeof images?.[0] === "string" ? images[0] : (images?.[0]?.src ?? "");
  const name = item.product.productName;
  const unitPrice = calculateItemPrice(item);
  const lineTotal = unitPrice * item.quantity;
  const originalUnitPrice = Number(item.product.salePrice) || 0;
  const hasDiscount = Number(item.product.discount || 0) > 0;

  return (
    <div
      className={[
        "transition-all duration-400",
        removing ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100",
      ].join(" ")}
    >
      <GlassCard className="rounded-[20px] p-6 flex flex-col sm:flex-row gap-6">
        {/* Thumbnail */}
        <div className="w-full sm:w-32 h-32 bg-white/5 rounded-xl overflow-hidden shrink-0 border border-white/10">
          {imgSrc ? (
            <Image src={imgSrc} alt={name} width={128} height={128} className="w-full h-full object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-aq-on-surface/30 text-[32px]">image_not_supported</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-eb-garamond text-[22px] text-aq-on-surface leading-tight">{name}</h3>
              {item.color && <p className="font-inter text-sm text-aq-on-surface/60 mt-0.5">{item.color}</p>}
              {item.size && <p className="font-inter text-xs text-aq-on-surface/40 mt-0.5">Size: {item.size}</p>}
            </div>
            <div className="text-right">
              <p className="font-inter font-semibold text-aq-on-surface whitespace-nowrap">{formatPKR(lineTotal)}</p>
              {hasDiscount && (
                <p className="font-inter text-xs text-aq-on-surface/50 line-through whitespace-nowrap">{formatPKR(originalUnitPrice * item.quantity)}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-5">
            <QuantityStepper value={item.quantity} onDecrement={onDecrement} onIncrement={onIncrement} />
            <button
              onClick={onRemove}
              className="flex items-center gap-1 font-inter text-[11px] font-semibold tracking-[0.1em] text-aq-on-surface/40 hover:text-aq-error transition-colors duration-200 uppercase"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Remove
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyCartState() {
  return (
    <GlassCard className="rounded-[20px] p-16 text-center">
      <div className="flex flex-col items-center gap-5">
        <span className="material-symbols-outlined text-[64px] text-aq-primary/30" style={{ fontVariationSettings: "'FILL' 0" }}>
          shopping_cart
        </span>
        <h3 className="font-eb-garamond text-[28px] text-aq-on-surface">Your cart is empty</h3>
        <p className="font-inter text-sm text-aq-on-surface/50 max-w-xs">
          Discover our premium products and elevate your atmosphere.
        </p>
        <Link
          href="/collections"
          className="mt-2 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-aq-primary-container text-aq-on-primary-container font-inter text-sm font-semibold tracking-wider hover:brightness-110 transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[16px]">explore</span>
          Browse Collections
        </Link>
      </div>
    </GlassCard>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AquaMistCartContent() {
  const router = useRouter();
  const { cartItems, subTotal, updateItemQuantity, removeFromCart, isHydrated } = useCart();

  // Local state
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const hasRealItems = cartItems.length > 0;
  const totalItems = cartItems.reduce((a, i) => a + i.quantity, 0);
  const { deliveryFee, displayFee, isFree, shippingLabel } = useShippingFee(subTotal);
  const total = subTotal + deliveryFee;

  // ── Remove with animation ──────────────────────────────────────────────────
  const handleRemove = useCallback((productID: string, variantID?: string) => {
    const key = `${productID}-${variantID ?? ""}`;
    setRemovingIds((s) => new Set(s).add(key));
    setTimeout(() => {
      removeFromCart(productID, variantID);
      setRemovingIds((s) => {
        const next = new Set(s);
        next.delete(key);
        return next;
      });
    }, 350);
  }, [removeFromCart]);

  // ── Quantity updates ───────────────────────────────────────────────────────
  const handleDecrement = useCallback((productID: string, currentQty: number, variantID?: string) => {
    if (currentQty > 1) updateItemQuantity(productID, currentQty - 1, variantID);
  }, [updateItemQuantity]);

  const handleIncrement = useCallback((productID: string, currentQty: number, variantID?: string) => {
    updateItemQuantity(productID, currentQty + 1, variantID);
  }, [updateItemQuantity]);
  
  // ── Checkout Validation ───────────────────────────────────────────────────────
  const handleProceedToCheckout = () => {
    if (!hasRealItems) {
      toast.error("Your cart is empty. Add items before proceeding.");
      return;
    }
    router.push("/checkout");
  };

  if (!isHydrated) {
    return null; // Don't render until hydration completes to avoid mismatch
  }

  return (
    <div className="relative min-h-screen pt-[100px] sm:pt-[140px] pb-16 sm:pb-24 px-4 sm:px-5 md:px-20 max-w-[1280px] mx-auto">

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <header className="text-center mb-16">
        <span className="font-inter text-[11px] font-semibold tracking-[0.2em] text-aq-primary uppercase block mb-2">
          Your Cart
        </span>
        <h1 className="font-eb-garamond text-[36px] sm:text-[48px] leading-[44px] sm:leading-[56px] text-aq-on-surface mt-2 mb-3">
          Review Your Order
        </h1>
        <p className="font-inter text-sm text-aq-on-surface/60 mb-10">
          {hasRealItems ? `${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart` : "Your cart is empty"}
        </p>

        {/* Progress Steps */}
        <div className="flex items-center justify-center max-w-sm mx-auto relative px-4">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2 z-0" />
          <div className="flex justify-between w-full relative z-10">
            {/* Step 1: Cart — active */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-aq-primary text-aq-on-primary flex items-center justify-center font-inter font-bold text-sm">
                1
              </div>
              <span className="text-[10px] font-inter font-semibold tracking-wider text-aq-primary uppercase">Cart</span>
            </div>
            {/* Step 2: Details */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 text-aq-on-surface/40 flex items-center justify-center font-inter font-bold text-sm">
                2
              </div>
              <span className="text-[10px] font-inter font-semibold tracking-wider text-aq-on-surface/40 uppercase">Details</span>
            </div>
            {/* Step 3: Confirm */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 text-aq-on-surface/40 flex items-center justify-center font-inter font-bold text-sm">
                3
              </div>
              <span className="text-[10px] font-inter font-semibold tracking-wider text-aq-on-surface/40 uppercase">Confirm</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* ── Left: Cart Items ──────────────────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-5">
          {!hasRealItems ? (
            <EmptyCartState />
          ) : (
            cartItems.map((item) => {
              const key = `${item.product._id}-${item.variantID ?? ""}`;
              return (
                <RealCartRow
                  key={key}
                  item={item}
                  removing={removingIds.has(key)}
                  onRemove={() => handleRemove(item.product._id, item.variantID)}
                  onDecrement={() => handleDecrement(item.product._id, item.quantity, item.variantID)}
                  onIncrement={() => handleIncrement(item.product._id, item.quantity, item.variantID)}
                />
              );
            })
          )}

          {/* Continue Shopping link */}
          <div className="pt-2">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 font-inter text-[12px] font-semibold tracking-[0.1em] text-aq-primary hover:-translate-x-1 transition-transform duration-300 uppercase"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* ── Right: Order Summary ──────────────────────────────────────────── */}
        <div className="lg:col-span-5 lg:sticky lg:top-[100px]">
          <GlassCard className="rounded-[20px] p-8">
            <h2 className="font-eb-garamond text-[24px] font-medium text-aq-on-surface mb-6 border-b border-white/10 pb-4">
              Order Summary
            </h2>

            {/* Price rows */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center font-inter text-sm text-aq-on-surface/80">
                <span>Subtotal</span>
                <span>{formatPKR(subTotal)}</span>
              </div>
              <div className="flex justify-between items-center font-inter text-sm text-aq-on-surface/80">
                <span>Shipping ({shippingLabel})</span>
                <span className={isFree ? "font-inter font-semibold text-aq-primary tracking-wide" : "font-inter font-semibold text-aq-on-surface"}>
                  {displayFee}
                </span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-inter font-bold text-base text-aq-on-surface">Total</span>
                <span className="font-eb-garamond text-[28px] text-aq-primary">
                  {formatPKR(total)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              disabled={!hasRealItems}
              className={`w-full font-inter font-semibold text-[13px] tracking-[0.1em] uppercase py-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200 mb-5 group shadow-[0_8px_32px_rgba(189,255,243,0.2)] ${
                hasRealItems 
                  ? "bg-aq-primary text-aq-on-primary hover:brightness-110 active:scale-[0.98]" 
                  : "bg-white/10 text-aq-on-surface/30 cursor-not-allowed shadow-none"
              }`}
            >
              Proceed to Checkout
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-200">
                arrow_forward
              </span>
            </button>
            
            {/* Trust badges */}
            <div className="flex justify-center items-center gap-6 opacity-40 hover:opacity-70 transition-opacity duration-500 mb-2 mt-4">
              {["lock", "verified_user", "package_2"].map((icon) => (
                <span key={icon} className="material-symbols-outlined text-[28px] text-aq-on-surface">
                  {icon}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
