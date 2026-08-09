"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useCartContext } from "@/context/CartContext";
import { useGetOrderDetailByorderNumber } from "@/components/OrderConfirmation/query/orderConfirmationQuery";
import GlassCard from "./GlassCard";

// ── Types & Interfaces ───────────────────────────────────────────────────────

interface RecItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  img: string;
  slug: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCESSORIES: RecItem[] = [
  {
    id: "acc-1",
    name: "Filter Pack",
    desc: "6-Month Mineral Protection",
    price: 4_200,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6t2INvvOGG8vKXOWaBkpa-mvK2R42fAfp557dzXRcn3MVfcwfUF1Mn1kH5MOUXM1fImfWlLkLztaOEKhemIsvUhbyi9sWEuWZTIoYKllIAxhLiswsQn1HqTvJAFOPlXrq16J47fLUSYxzV1BPoFEcTr-Q14sDhL8tfYOuvtzP4ZU1rvaE4qcoVJoGiFYK7e84gN0DPYIwlvcjr025pRFv8KKwSr2fwIa4VlWpK6hITDqEpS0fTU6h",
    slug: "filter-pack",
  },
  {
    id: "acc-2",
    name: "Aroma Oils",
    desc: "Serenity Collection (Set of 5)",
    price: 8_500,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwwFodczCSjmBJ98_RhQSb3aUrV1n2ta8LKFYQEntNkZuLdtlspRm5ytdzVLu-ZOyHEccK1Ox7b4dx0wfW5bL0Oos62tIvTHMLN9M1BVnYTIYz6N7VQ-Cctr2dKv29nDNyHpyX5j_nKwlBBFvOvrstiNWM-DE4KzBYSdqL5MfnV17-BahT77ORZ2-AebPgmcSb_trfnc8_-Ey_m_Y8dhhuaBZJmyLtmpybHOKEGzIzM-15An0XfvfB",
    slug: "aroma-oils",
  },
  {
    id: "acc-3",
    name: "MistLux Pro Max",
    desc: "Commercial Grade Capacity",
    price: 82_900,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCP3boLB0K8SxMTtoyAhhNlw0MXpQoNhXn-PkgxdM0thDhXmAemThOPGb9K6yFfeKS8MEFx0EFOLMBOsdLanegDuX26TEkjhtZxQYS9sreRvn4rKjy77Uahte5W1mO5TmylFf7c4VT7iI4DZJQq4HYkOyBoLQgTmE09Lj9d2KOUrEdOeURhXiwQNV5jybCk70uvgG_n2zMG7e71QzANynMFPA55_4GFNY40GX963LNUqAkWscpKDhEz",
    slug: "mistlux-pro-max",
  },
];

function formatPKR(n: number) {
  return `PKR ${n.toLocaleString("en-PK")}`;
}

// ── Skeleton Loader ─────────────────────────────────────────────────────────

function OrderConfirmationSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 animate-pulse">
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full mb-6 border border-white/10" />
        <div className="h-10 bg-white/5 w-64 rounded-lg mb-3" />
        <div className="h-5 bg-white/5 w-96 rounded mb-8" />
        <div className="h-8 bg-white/5 w-40 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="h-64 bg-white/5 rounded-2xl" />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-40 bg-white/5 rounded-2xl" />
            <div className="h-40 bg-white/5 rounded-2xl" />
          </div>
        </div>
        <div className="lg:col-span-4 h-96 bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AquaMistOrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orderNumber } = useCartContext();
  const { addToCart } = useCart();

  const queryOrderNo = searchParams?.get("orderId") || searchParams?.get("orderNo") || "";
  const effectiveOrderNo = queryOrderNo || orderNumber || "";

  const { data, isLoading } = useGetOrderDetailByorderNumber(effectiveOrderNo);

  // Star feedback interaction
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-[120px] pb-24">
        <OrderConfirmationSkeleton />
      </div>
    );
  }

  const orderDetails = data?.data;

  const displayOrderNo = orderDetails?.orderNo || effectiveOrderNo || "—";
  const firstName = orderDetails?.address?.firstName || orderDetails?.user?.username || "Valued Customer";
  const lastName = orderDetails?.address?.lastName || "";
  const displayUserName = `${firstName} ${lastName}`.trim();

  const subTotal = orderDetails?.orderDetails?.subTotal ?? orderDetails?.subTotal ?? 0;
  const discountAmount = orderDetails?.orderDetails?.discountAmount ?? orderDetails?.discountAmount ?? 0;
  const deliveryFee = orderDetails?.orderDetails?.deliveryFee ?? orderDetails?.deliveryFee ?? 0;
  const total = orderDetails?.orderDetails?.totalPrice ?? orderDetails?.total ?? (subTotal - discountAmount + deliveryFee);
  const paymentMethod = orderDetails?.orderDetails?.paymentMethod || orderDetails?.paymentMethod || "Cash on Delivery";

  const street = orderDetails?.address?.streetAddress || "";
  const city = orderDetails?.address?.city || "";
  const zip = orderDetails?.address?.zipCode || "";

  return (
    <div className="relative min-h-screen pt-[90px] sm:pt-[120px] pb-16 sm:pb-24 px-4 sm:px-5 md:px-20 max-w-[1280px] mx-auto">
      {/* Ambient background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-aq-primary-container/10 rounded-full blur-[120px] mix-blend-screen opacity-50 pointer-events-none -z-10" />

      {/* ── Progress steps ────────────────────────────────────────────────── */}
      <div className="w-full max-w-2xl mx-auto mb-16">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 z-0" />
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-aq-primary-container -translate-y-1/2 z-0" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full glass bg-aq-primary-container flex items-center justify-center text-aq-on-primary-container">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
            </div>
            <span className="font-inter text-[10px] font-semibold tracking-wider text-aq-primary uppercase">Cart</span>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full glass bg-aq-primary-container flex items-center justify-center text-aq-on-primary-container">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
            </div>
            <span className="font-inter text-[10px] font-semibold tracking-wider text-aq-primary uppercase">Details</span>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full border border-aq-primary-container flex items-center justify-center text-aq-primary shadow-[0_0_15px_rgba(125,232,216,0.3)] bg-aq-background">
              <div className="w-3 h-3 bg-aq-primary-container rounded-full" />
            </div>
            <span className="font-inter text-[10px] font-semibold tracking-wider text-aq-primary uppercase">Confirmation</span>
          </div>
        </div>
      </div>

      {/* ── Hero success ──────────────────────────────────────────────────── */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-aq-primary-container/10 border border-aq-primary-container mb-6 relative">
          <div className="absolute inset-0 bg-aq-primary-container/20 rounded-full animate-ping pointer-events-none" />
          <span className="material-symbols-outlined text-aq-primary text-[40px]" style={{ fontVariationSettings: "'wght' 200" }}>check</span>
        </div>
        <h1 className="font-eb-garamond text-[36px] sm:text-[48px] leading-[44px] sm:leading-[56px] text-aq-on-surface mb-4">
          Thank You, {displayUserName.split(" ")[0]}!
        </h1>
        <p className="text-aq-on-surface-variant font-inter text-base max-w-xl mx-auto mb-8">
          Your order has been confirmed and is being prepared with care.
        </p>
        <div className="inline-block px-5 py-2.5 rounded-lg border border-aq-primary-container/30 bg-aq-primary-container/5">
          <span className="font-inter text-xs font-semibold tracking-wider text-aq-primary uppercase">
            Order #{displayOrderNo}
          </span>
        </div>
      </section>

      {/* ── Main content grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
        
        {/* Left Column: Order items and details */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Items ordered list */}
          <GlassCard className="rounded-[20px] p-4 sm:p-8">
            <h3 className="font-inter text-[11px] font-semibold tracking-[0.2em] mb-6 sm:mb-8 text-aq-on-surface/50 uppercase">
              Items Ordered
            </h3>
            <div className="space-y-5 sm:space-y-6">
              {orderDetails?.items && orderDetails.items.length > 0 ? (
                orderDetails.items.map((item: any, idx: number) => {
                  const name = typeof item.product === "string"
                    ? item.product
                    : (item.product?.productName || item.productName || item.productId?.productName || "Product");
                  
                  const variantName = typeof item.variant === "object" && item.variant
                    ? item.variant.name
                    : (item.variantName || "");

                  const imageSrc = item.image || item.productImage || item.productId?.images?.[0]?.src || "";
                  const price = item.price || 0;
                  const qty = item.quantity || 1;
                  const lineTotal = item.lineTotal || (price * qty);

                  return (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-0 border-b border-white/5 sm:border-0 last:border-0 last:pb-0">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 relative">
                          {imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-aq-on-surface/30">image</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-inter font-semibold text-aq-on-surface text-sm sm:text-base leading-snug break-words">{name}</h4>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-aq-on-surface-variant font-inter text-xs mt-1">
                            <span>Qty: {qty}</span>
                            {variantName && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-aq-primary uppercase">
                                {variantName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between sm:justify-end items-center sm:self-center pl-17 sm:pl-0 pt-1 sm:pt-0">
                        <span className="text-aq-on-surface-variant text-xs sm:hidden">Item Total</span>
                        <span className="font-inter font-bold sm:font-semibold text-aq-primary sm:text-aq-on-surface text-sm whitespace-nowrap">
                          {formatPKR(lineTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-aq-on-surface-variant font-inter text-sm py-4 text-center">
                  No items found for this order.
                </div>
              )}

              {/* Price Breakdown */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-4 font-inter text-sm">
                <div className="flex justify-between text-aq-on-surface/60">
                  <span>Subtotal</span>
                  <span>{formatPKR(subTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-aq-primary">
                    <span>Discount</span>
                    <span>-{formatPKR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-aq-on-surface/60">
                  <span>Shipping</span>
                  <span className="text-aq-primary font-semibold">
                    {deliveryFee > 0 ? formatPKR(deliveryFee) : "FREE"}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-white/10">
                  <span className="font-eb-garamond text-[20px] text-aq-on-surface">Total</span>
                  <span className="font-eb-garamond text-[20px] text-aq-primary">
                    {formatPKR(total)}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Shipping Info Card */}
          <GlassCard className="rounded-[20px] p-8">
            <h3 className="font-inter text-[11px] font-semibold tracking-[0.2em] mb-4 text-aq-on-surface/50 uppercase">
              Shipping To
            </h3>
            <p className="font-inter font-semibold text-aq-on-surface text-base mb-1.5">{displayUserName}</p>
            <p className="text-aq-on-surface-variant font-inter text-sm leading-relaxed">
              {street ? (
                <>
                  {street}<br />
                  {city}{zip ? `, ${zip}` : ""}<br />
                  Pakistan
                </>
              ) : (
                "Address details saved with order"
              )}
            </p>
          </GlassCard>
        </div>

        {/* Right Column: Timeline & Actions */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-[100px]">
          <GlassCard className="rounded-[20px] p-8">
            <h3 className="font-inter text-[11px] font-semibold tracking-[0.2em] mb-8 text-aq-on-surface/50 uppercase">
              What&apos;s Next
            </h3>
            
            {/* Interactive Timeline */}
            <div className="relative space-y-8 pl-8 select-none">
              <div className="absolute left-[11px] top-2 w-[2px] h-[calc(100%-16px)] bg-white/10" />
              
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-aq-primary-container flex items-center justify-center text-aq-on-primary-container">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
                <p className="text-aq-primary font-inter font-semibold text-sm">Order Confirmed</p>
                <p className="text-aq-on-surface-variant font-inter text-xs">Recently</p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-8 top-1 w-6 h-6 rounded-full border border-aq-primary-container bg-aq-background flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-aq-primary-container rounded-full animate-pulse" />
                </div>
                <p className="text-aq-on-surface font-inter font-semibold text-sm">Being Packed</p>
                <p className="text-aq-on-surface-variant font-inter text-xs">Processing Order</p>
              </div>

              {/* Step 3 */}
              <div className="relative opacity-40">
                <div className="absolute -left-8 top-1 w-6 h-6 rounded-full border border-white/20 bg-aq-background flex items-center justify-center" />
                <p className="text-aq-on-surface font-inter font-semibold text-sm">Out for Delivery</p>
                <p className="text-aq-on-surface-variant font-inter text-xs">Expected Soon</p>
              </div>

              {/* Step 4 */}
              <div className="relative opacity-40">
                <div className="absolute -left-8 top-1 w-6 h-6 rounded-full border border-white/20 bg-aq-background flex items-center justify-center" />
                <p className="text-aq-on-surface font-inter font-semibold text-sm">Delivered</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-12 space-y-4">
              <button
                onClick={() => router.push(`/profile/order-details?orderId=${displayOrderNo}&from=order-confirmation`)}
                className="w-full py-4 bg-aq-primary text-aq-on-primary rounded-full font-inter font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-[0_8px_32px_rgba(189,255,243,0.15)]"
              >
                Track My Order
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <Link
                href="/collections"
                className="w-full py-4 inline-flex items-center justify-center rounded-full border border-white/10 font-inter font-semibold text-sm tracking-wider text-aq-on-surface uppercase hover:bg-white/5 active:scale-[0.98] transition-all duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
