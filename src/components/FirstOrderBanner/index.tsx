"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useAppUIContext } from "@/context/AppUIContext";
import { useAuth } from "@/context/AuthContext";
import { storageApi, STORAGE_KEYS } from "@/lib/storageApi";
import Image from "next/image";
import logo from "@/assets/img/logo.webp";
import { useGetStoreSettings } from "@/components/Slider/query/storeSettingQuery";
import { FiX, FiTag } from "react-icons/fi";

const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day

function isDismissed(): boolean {
  if (typeof window === "undefined") return true;
  const raw = localStorage.getItem(STORAGE_KEYS.firstOrderBannerDismissed);
  if (!raw) return false;
  const ts = Number(raw);
  return Date.now() - ts < DISMISS_DURATION_MS;
}

export default function FirstOrderBanner() {
  const { setIsAuthModalOpen, setActiveTab } = useAppUIContext();
  const { authToken } = useAuth();
  const { data: storeSettings } = useGetStoreSettings();

  const [showModal, setShowModal] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [mounted, setMounted] = useState(false);

  const promo = (storeSettings as any)?.firstOrderDiscount;

  // Check if promotion is active
  const isEnabled = React.useMemo(() => {
    if (promo?.enabled === false) return false;
    const now = new Date();
    if (promo?.startDate && new Date(promo.startDate) > now) return false;
    if (promo?.endDate && new Date(promo.endDate) < now) return false;
    return true;
  }, [promo]);

  // Compute countdown timer string (e.g. "2 hours left" or "4 days left")
  const timeRemainingText = React.useMemo(() => {
    if (!promo?.endDate) return "";
    const now = new Date();
    const diffMs = new Date(promo.endDate).getTime() - now.getTime();
    if (diffMs <= 0) return "";
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays >= 1) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} left`;
    }
    if (diffHours >= 1) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} left`;
    }
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins} min${diffMins > 1 ? "s" : ""} left`;
  }, [promo?.endDate]);

  const discountBadgeText = React.useMemo(() => {
    if (promo?.discountType === "fixed") {
      return `PKR ${promo?.discountValue ?? 0} OFF`;
    }
    return `${promo?.discountValue ?? 5}% OFF`;
  }, [promo]);

  const titleText = promo?.title || `Get ${discountBadgeText} On Your First Order`;
  const subtitleText = promo?.subtitle || "Sign up and unlock your instant discount.";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show popup after 3 s for non-logged-in users who haven't dismissed it
  useEffect(() => {
    if (!mounted || !isEnabled || authToken) return;
    if (isDismissed()) {
      setShowStickyBar(true); // still show the sticky hint
      return;
    }
    const t = setTimeout(() => setShowModal(true), 3000);
    return () => clearTimeout(t);
  }, [mounted, isEnabled, authToken]);

  // Show sticky bar when modal is closed (or already dismissed)
  useEffect(() => {
    if (!mounted || !isEnabled || authToken) {
      setShowStickyBar(false);
      return;
    }
    if (!showModal) setShowStickyBar(true);
  }, [showModal, mounted, isEnabled, authToken]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(
      STORAGE_KEYS.firstOrderBannerDismissed,
      String(Date.now())
    );
    setShowModal(false);
  }, []);

  const handleClaim = useCallback(() => {
    setShowModal(false);
    setActiveTab("register");
    setIsAuthModalOpen(true);
  }, [setIsAuthModalOpen, setActiveTab]);

  const handleStickyOpen = useCallback(() => {
    setShowStickyBar(false);
    setShowModal(true);
  }, []);

  const handleStickyClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowStickyBar(false);
  }, []);

  if (!mounted || !isEnabled || authToken) return null;

  return (
    <>
      {/* ── Sticky bar ───────────────────────────────────────────── */}
      {showStickyBar && (
        <div
          role="button"
          tabIndex={0}
          aria-label={titleText}
          onClick={handleStickyOpen}
          onKeyDown={(e) => e.key === "Enter" && handleStickyOpen()}
          className="
            fixed right-0 top-1/2 -translate-y-1/2 z-40
            flex flex-col items-center
            bg-black text-white text-sm font-semibold
            py-4 px-2 shadow-2xl
            cursor-pointer select-none
            hover:bg-gray-900 transition-colors duration-200
            animate-bounce-once-side
          "
          style={{ borderRadius: "4px 0 0 4px" }}
        >
          <button
            aria-label="Close banner"
            onClick={handleStickyClose}
            className="text-gray-400 hover:text-white transition-colors mb-3"
          >
            <FiX size={16} />
          </button>
          <div
            className="flex items-center gap-2"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            <FiTag size={14} className="shrink-0" />
            <span className="tracking-wide">
              {discountBadgeText} {timeRemainingText ? `• ${timeRemainingText}` : "— Claim Now"}
            </span>
          </div>
        </div>
      )}

      {/* ── Modal overlay ─────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
          aria-label="First order discount"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleDismiss}
            aria-hidden="true"
          />

          {/* Card */}
          <div
            className="
              relative z-10 bg-white w-full max-w-sm
              flex flex-col items-center text-center
              p-8 shadow-2xl
              animate-modal-in
            "
            style={{ borderRadius: "2px" }}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              aria-label="Close"
              className="
                absolute top-4 right-4
                text-gray-400 hover:text-black transition-colors
              "
            >
              <FiX size={18} />
            </button>

            {/* Logo */}
            <div className="mb-4">
              <Image
                src={storeSettings?.logo ?? logo.src}
                width={80}
                height={80}
                alt="Store logo"
                className="object-contain mx-auto"
              />
            </div>

            {/* Countdown Badge if End Date is set */}
            {timeRemainingText && (
              <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold tracking-wide animate-pulse">
                <span>⏱</span>
                <span>Limited Time: {timeRemainingText}</span>
              </div>
            )}

            {/* Headline */}
            <h2 className="text-2xl font-bold text-black mb-2 leading-tight">
              {titleText}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {subtitleText}
            </p>

            {/* CTA — Sign up */}
            <button
              id="first-order-claim-btn"
              onClick={handleClaim}
              className="
                w-full bg-black text-white text-sm font-semibold
                py-3.5 mb-3
                hover:bg-gray-900 active:scale-[0.98]
                transition-all duration-150
              "
              style={{ borderRadius: "2px" }}
            >
              Sign up &amp; claim discount
            </button>

            {/* Secondary — No thanks */}
            <button
              id="first-order-dismiss-btn"
              onClick={handleDismiss}
              className="text-sm text-gray-400 hover:text-black underline underline-offset-2 transition-colors"
            >
              No, thanks
            </button>

            {/* Fine print */}
            <p className="mt-4 text-[11px] text-gray-400 leading-relaxed">
              Valid on your first order only. Discount applied automatically at checkout.
            </p>
          </div>
        </div>
      )}

      {/* Keyframe styles */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .animate-modal-in {
          animation: modalIn 0.25s ease-out forwards;
        }
        @keyframes bounceOnceSide {
          0%,100% { transform: translateY(-50%) translateX(0); }
          40%      { transform: translateY(-50%) translateX(-8px); }
        }
        .animate-bounce-once-side {
          animation: bounceOnceSide 0.9s ease 0.4s 1;
        }
      `}</style>
    </>
  );
}
