"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/context/AuthContext";
import { useAppUIContext } from "@/context/AppUIContext";
import { orderService } from "@/services/orderService";
import { useSubmitOrder } from "@/hooks/mutations/useOrderMutations";
import { useFirstOrderDiscount } from "@/hooks/useFirstOrderDiscount";
import { useShippingFee } from "@/hooks/useShippingFee";
import { calculateDiscountedPrice } from "@/lib/utils";
import { PaymentMethod } from "@/types";
import { toast } from "react-toastify";
import GlassCard from "./GlassCard";

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatPKR(amount: number) {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

// ── Styled Input ────────────────────────────────────────────────────────────────

interface GlassInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  error?: string;
  optional?: boolean;
}

function GlassInput({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  readOnly,
  error,
  optional,
}: GlassInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-inter font-semibold tracking-[0.1em] text-aq-on-surface/60 mb-2 uppercase"
      >
        {label}
        {optional && (
          <span className="ml-1 normal-case tracking-normal font-normal text-aq-on-surface/35">
            (optional)
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={[
          "w-full rounded-lg px-4 py-3 font-inter text-sm text-aq-on-surface placeholder:text-aq-on-surface/30 border transition-all duration-200 focus:outline-none",
          readOnly
            ? "bg-white/5 border-white/10 cursor-not-allowed text-aq-on-surface/50"
            : error
            ? "bg-white/5 border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
            : "bg-white/5 border-white/10 focus:border-aq-primary-container/60 focus:ring-2 focus:ring-aq-primary-container/20",
        ].join(" ")}
      />
      {error && (
        <p className="mt-1.5 text-[11px] font-inter text-red-400">{error}</p>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────────

export default function AquaMistCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId, userName, authToken } = useAuth();
  const { cartItems, subTotal: cartSubTotal, clearCart, isHydrated } = useCart();
  const { productDetail, setIsAuthModalOpen, setActiveTab } = useAppUIContext();
  const { mutate: submitOrder, isPending, isSuccess, data: orderData } = useSubmitOrder();

  // Detect Buy Now vs Cart checkout
  const section = searchParams?.get("section");
  const isBuyNow = section === "checkout" || Boolean(productDetail?.items?.length && cartItems.length === 0);

  const activeItems = isBuyNow ? (productDetail?.items ?? []) : cartItems;
  const activeSubTotal = isBuyNow ? (productDetail?.subTotal ?? 0) : cartSubTotal;

  const { isEligible, discountPercent, discountType, discountValue, discountAmount } = useFirstOrderDiscount(activeSubTotal);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPlacing, setIsPlacing] = useState(false);

  // ── Pre-fill saved address from API ────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    orderService.getUserAddress(userId).then((res) => {
      if (res?.data) {
        const addr = res.data;
        setFirstName(addr.firstName || "");
        setLastName(addr.lastName || "");
        setEmail(addr.email || "");
        setPhone(addr.phone || "");
        setStreet(addr.streetAddress || "");
        setCity(addr.city || "");
        setPostal(addr.zipCode || "");
      } else if (userName) {
        // fallback: split username into first/last if no saved address
        const parts = userName.trim().split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
    }).catch(() => {
      if (userName) {
        const parts = userName.trim().split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
    });
  }, [userId, userName]);

  // ── Pricing ─────────────────────────────────────────────────────────────────
  const subtotal = useMemo(() => {
    if (isBuyNow) return activeSubTotal;
    return cartItems.reduce((sum, item) => {
      const variant = item.variantID
        ? item.product.variants?.find((v) => v._id === item.variantID)
        : null;
      const base = item.product.salePrice + (variant?.additionalSalePrice || 0);
      const discounted = calculateDiscountedPrice(base, item.product.discount || 0);
      return sum + discounted * item.quantity;
    }, 0);
  }, [cartItems, isBuyNow, activeSubTotal]);

  // ── Shipping Fee ─────────────────────────────────────────────────────────────
  const { deliveryFee, isFree, displayFee, amountNeededForFree, shippingLabel } = useShippingFee(subtotal);

  const firstOrderDiscount = isEligible ? discountAmount : 0;
  const total = Math.max(0, subtotal - firstOrderDiscount + deliveryFee);

  // ── Navigate on success ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isSuccess && orderData?.data?.orderNo) {
      if (!isBuyNow) {
        clearCart();
      }
      router.push(`/order-confirmation?orderId=${orderData.data.orderNo}`);
    }
  }, [isSuccess, orderData, router, clearCart, isBuyNow]);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required.";
    if (!lastName.trim()) errs.lastName = "Last name is required.";
    if (!email.trim()) errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email.";
    if (!phone.trim()) errs.phone = "Phone number is required.";
    if (!street.trim()) errs.street = "Street address is required.";
    if (!city.trim()) errs.city = "City is required.";
    return errs;
  }, [firstName, lastName, email, phone, street, city]);

  // ── Place order ──────────────────────────────────────────────────────────────
  const handlePlaceOrder = useCallback(async () => {
    if (!authToken) {
      toast.error("Please log in to place an order.");
      setActiveTab("login");
      setIsAuthModalOpen(true);
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});

    if (!isBuyNow && cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const address = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      streetAddress: street.trim(),
      city: city.trim(),
      zipCode: postal.trim() || undefined,
    };

    const cartMappedItems = cartItems.map((item) => {
      const variant = item.variantID
        ? item.product.variants?.find((v) => v._id === item.variantID)
        : null;
      const base = item.product.salePrice + (variant?.additionalSalePrice || 0);
      const price = calculateDiscountedPrice(base, item.product.discount || 0);
      return {
        productId: item.product._id,
        ...(item.variantID && { variantId: item.variantID }),
        price,
        quantity: item.quantity,
        lineTotal: price * item.quantity,
      };
    });

    const payload = {
      userId,
      address,
      isSaved: true,
      paymentMethod: PaymentMethod.Cash,
      deliveryFee,
      discountAmount: firstOrderDiscount,
      ...(isBuyNow
        ? {
            items: productDetail?.items.map((it) => ({
              productId: it.productId,
              ...(it.variantId && { variantId: it.variantId }),
              price: it.price,
              quantity: it.quantity,
              lineTotal: it.lineTotal,
            })) ?? [],
            subTotal: productDetail?.subTotal ?? 0,
            totalPrice: (productDetail?.subTotal ?? 0) - firstOrderDiscount,
          }
        : {
            items: cartMappedItems,
            subTotal: subtotal,
            totalPrice: total,
          }),
    };

    submitOrder(payload as any);
  }, [
    authToken, validate, isBuyNow, cartItems, firstName, lastName, email,
    phone, street, city, postal, userId, deliveryFee, firstOrderDiscount,
    productDetail, subtotal, total, submitOrder, setIsAuthModalOpen, setActiveTab,
  ]);

  // ── Cart is empty guard ──────────────────────────────────────────────────────
  const isCartEmpty = isHydrated && (isBuyNow ? !productDetail?.items?.length : cartItems.length === 0);

  // ── Display items for order summary ─────────────────────────────────────────
  const summaryItems = useMemo(() => {
    if (isBuyNow && productDetail) {
      return productDetail.items.map((it) => ({
        name: productDetail.productName ?? "Product",
        image: it.image || "",
        color: "",
        qty: it.quantity,
        price: it.price * it.quantity,
      }));
    }
    return cartItems.map((item) => {
      const variant = item.variantID
        ? item.product.variants?.find((v) => v._id === item.variantID)
        : null;
      const base = item.product.salePrice + (variant?.additionalSalePrice || 0);
      const price = calculateDiscountedPrice(base, item.product.discount || 0);
      return {
        name: item.product.productName,
        image: item.product.images?.[0]?.src ?? "",
        color: item.color ?? "",
        qty: item.quantity,
        price: price * item.quantity,
      };
    });
  }, [isBuyNow, productDetail, cartItems]);

  return (
    <div className="relative min-h-screen w-full pt-[90px] sm:pt-[120px] pb-16 sm:pb-24 px-3 sm:px-5 md:px-20 max-w-[1280px] mx-auto overflow-hidden">

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <header className="text-center mb-10 sm:mb-16">
        <span className="font-inter text-[11px] font-semibold tracking-[0.2em] text-aq-primary-container block mb-2 uppercase">
          Secure Checkout
        </span>
        <h1 className="font-eb-garamond text-[32px] sm:text-[48px] leading-[38px] sm:leading-[56px] text-aq-on-surface mb-6 sm:mb-8">
          Almost There
        </h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-sm mx-auto">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-aq-primary-container text-aq-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] sm:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-inter font-semibold tracking-wider text-aq-on-surface/60 uppercase">Cart</span>
          </div>
          <div className="w-10 sm:w-16 h-[2px] bg-aq-primary-container -mt-5 sm:-mt-6" />
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-aq-primary-container text-aq-primary-container flex items-center justify-center shadow-[0_0_15px_rgba(125,232,216,0.3)]">
              <span className="text-xs sm:text-sm font-bold font-inter">02</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-inter font-semibold tracking-wider text-aq-primary-container uppercase">Details</span>
          </div>
          <div className="w-10 sm:w-16 h-[2px] bg-white/10 -mt-5 sm:-mt-6" />
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/10 text-aq-on-surface/40 flex items-center justify-center">
              <span className="text-xs sm:text-sm font-bold font-inter">03</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-inter font-semibold tracking-wider text-aq-on-surface/40 uppercase">Done</span>
          </div>
        </div>
      </header>

      {/* ── Empty cart state ───────────────────────────────────────────────── */}
      {isCartEmpty && (
        <GlassCard className="rounded-[20px] p-6 sm:p-12 text-center max-w-md mx-auto mb-12">
          <span className="material-symbols-outlined text-4xl sm:text-5xl text-aq-primary/30 block mb-4">
            shopping_cart_off
          </span>
          <h2 className="font-eb-garamond text-[24px] sm:text-[28px] text-aq-on-surface mb-3">Your cart is empty</h2>
          <p className="font-inter text-xs sm:text-sm text-aq-on-surface-variant/70 mb-6">
            Add some products before checking out.
          </p>
          <Link
            href="/collections"
            className="inline-block px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-aq-primary text-aq-on-primary font-inter text-xs sm:text-sm font-semibold tracking-wider hover:bg-aq-primary-fixed transition-colors"
          >
            Browse Collections
          </Link>
        </GlassCard>
      )}

      {!isCartEmpty && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* ── Left Column: Forms ────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">

            {/* Contact Details */}
            <GlassCard className="rounded-[20px] p-4 sm:p-6 md:p-8">
              <h2 className="font-eb-garamond text-[20px] sm:text-[24px] font-medium mb-4 sm:mb-6 flex items-center gap-2.5 text-aq-on-surface">
                <span className="material-symbols-outlined text-aq-primary-container text-[20px] sm:text-[22px]">person</span>
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput
                  label="First Name"
                  id="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(v) => { setFirstName(v); setErrors((e) => ({ ...e, firstName: "" })); }}
                  error={errors.firstName}
                />
                <GlassInput
                  label="Last Name"
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(v) => { setLastName(v); setErrors((e) => ({ ...e, lastName: "" })); }}
                  error={errors.lastName}
                />
                <GlassInput
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: "" })); }}
                  error={errors.email}
                />
                <GlassInput
                  label="Phone Number"
                  id="phone"
                  type="tel"
                  placeholder="03001234567"
                  value={phone}
                  onChange={(v) => { setPhone(v); setErrors((e) => ({ ...e, phone: "" })); }}
                  error={errors.phone}
                />
              </div>
            </GlassCard>

            {/* Shipping Address */}
            <GlassCard className="rounded-[20px] p-4 sm:p-6 md:p-8">
              <h2 className="font-eb-garamond text-[20px] sm:text-[24px] font-medium mb-4 sm:mb-6 flex items-center gap-2.5 text-aq-on-surface">
                <span className="material-symbols-outlined text-aq-primary-container text-[20px] sm:text-[22px]">local_shipping</span>
                Shipping Address
              </h2>
              <div className="space-y-4">
                <GlassInput
                  label="Street Address"
                  id="street"
                  placeholder="House 123, Street 4, Sector F-7"
                  value={street}
                  onChange={(v) => { setStreet(v); setErrors((e) => ({ ...e, street: "" })); }}
                  error={errors.street}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GlassInput
                    label="City"
                    id="city"
                    placeholder="Islamabad"
                    value={city}
                    onChange={(v) => { setCity(v); setErrors((e) => ({ ...e, city: "" })); }}
                    error={errors.city}
                  />
                  <GlassInput
                    label="Postal Code"
                    id="postal"
                    placeholder="44000"
                    value={postal}
                    onChange={setPostal}
                    optional
                  />
                </div>
              </div>
            </GlassCard>

            {/* Delivery Method — COD only */}
            <GlassCard className="rounded-[20px] p-4 sm:p-6 md:p-8">
              <h2 className="font-eb-garamond text-[20px] sm:text-[24px] font-medium mb-4 sm:mb-6 flex items-center gap-2.5 text-aq-on-surface">
                <span className="material-symbols-outlined text-aq-primary-container text-[20px] sm:text-[22px]">payments</span>
                Delivery & Payment
              </h2>

              {/* COD card — selected by default, only option */}
              <div className="p-4 sm:p-6 rounded-xl border border-aq-primary-container bg-aq-primary-container/5 relative">
                <div className="flex justify-between items-start mb-2 pr-6">
                  <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                    <span className="material-symbols-outlined text-aq-primary-container text-[22px] sm:text-[24px] shrink-0 mt-0.5 sm:mt-0">
                      payments
                    </span>
                    <div>
                      <span className="font-inter font-semibold text-aq-on-surface text-sm sm:text-base">
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-xs sm:text-sm font-inter text-aq-on-surface/60 mt-0.5">
                        Pay when your order arrives. No card required.
                      </p>
                    </div>
                  </div>
                  <span className="text-aq-primary-container font-bold font-inter text-xs sm:text-sm shrink-0">{displayFee}</span>
                </div>
                {/* Selected checkmark */}
                <span className="absolute top-4 right-4">
                  <span
                    className="material-symbols-outlined text-aq-primary-container text-[18px] sm:text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </span>
              </div>
            </GlassCard>
          </div>

          {/* ── Right Column: Order Summary ──────────────────────────────── */}
          <div className="lg:col-span-5">
            <aside className="sticky top-[100px]">
              <GlassCard className="rounded-[20px] p-4 sm:p-6 md:p-8">
                <h2 className="font-eb-garamond text-[20px] sm:text-[24px] font-medium mb-4 sm:mb-6 text-aq-on-surface">
                  Order Summary
                </h2>

                {/* Item List */}
                <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                  {summaryItems.length > 0 ? (
                    summaryItems.map((item, idx) => (
                      <div key={idx} className="flex gap-3 sm:gap-4 items-start">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-aq-on-surface/30 text-[20px] sm:text-[24px]">
                                image_not_supported
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h3 className="font-inter font-semibold text-aq-on-surface text-xs sm:text-sm leading-snug line-clamp-2 min-w-0 flex-1">
                              {item.name}
                            </h3>
                            <span className="font-inter text-aq-on-surface/90 text-xs sm:text-sm font-semibold shrink-0">
                              {formatPKR(item.price)}
                            </span>
                          </div>
                          {item.color && (
                            <p className="text-[11px] sm:text-xs font-inter text-aq-on-surface/50 mb-0.5">
                              Color: {item.color}
                            </p>
                          )}
                          <span className="text-[11px] sm:text-xs font-inter text-aq-on-surface/60">
                            Qty: {item.qty}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-aq-on-surface-variant/60 font-inter text-sm py-4">
                      No items in cart.
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 pt-4 sm:pt-6 border-t border-white/10 font-inter text-xs sm:text-sm">
                  <div className="flex justify-between text-aq-on-surface/60">
                    <span>Subtotal</span>
                    <span className="shrink-0">{formatPKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-aq-on-surface/60">
                    <span>Delivery ({shippingLabel})</span>
                    <span className={isFree ? "text-aq-primary-container font-semibold" : "shrink-0 font-medium text-aq-on-surface"}>
                      {displayFee}
                    </span>
                  </div>
                  {amountNeededForFree > 0 && (
                    <p className="text-[11px] font-inter text-aq-primary-container/80 mt-1 mb-0">
                      Add PKR {amountNeededForFree.toLocaleString()} more for Free Delivery!
                    </p>
                  )}
                  {isEligible && firstOrderDiscount > 0 && (
                    <div className="flex justify-between text-aq-primary-container">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className="material-symbols-outlined text-[14px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                          celebration
                        </span>
                        <span className="truncate">
                          First Order ({discountType === "fixed" ? `PKR ${discountValue}` : `${discountPercent}%`} off)
                        </span>
                      </span>
                      <span className="shrink-0">-{formatPKR(firstOrderDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-white/10">
                    <span className="font-eb-garamond text-lg sm:text-[20px] text-aq-on-surface">Total</span>
                    <span className="font-eb-garamond text-lg sm:text-[20px] text-aq-primary shrink-0">
                      {formatPKR(total)}
                    </span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPending || isCartEmpty}
                  className="w-full bg-aq-primary-container text-aq-on-primary-container py-3.5 sm:py-4 px-4 rounded-full font-inter font-semibold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2.5 sm:gap-3 shadow-[0_8px_32px_rgba(125,232,216,0.3)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6 uppercase"
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-aq-on-primary-container/30 border-t-aq-on-primary-container rounded-full animate-spin" />
                      Placing Order…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                      Place Order Securely
                    </>
                  )}
                </button>

                {/* Trust Icons */}
                <div className="flex justify-center items-center gap-4 sm:gap-6 opacity-40">
                  {["verified", "security", "shield_lock", "workspace_premium"].map((icon) => (
                    <span key={icon} className="material-symbols-outlined text-[24px] sm:text-[28px] text-aq-on-surface">
                      {icon}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
