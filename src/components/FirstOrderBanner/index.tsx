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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show popup after 3 s for non-logged-in users who haven't dismissed it
  useEffect(() => {
    if (!mounted) return;
    if (authToken) return; // already logged in — hide everything
    if (isDismissed()) {
      setShowStickyBar(true); // still show the sticky hint
      return;
    }
    const t = setTimeout(() => setShowModal(true), 3000);
    return () => clearTimeout(t);
  }, [mounted, authToken]);

  // Show sticky bar when modal is closed (or already dismissed)
  useEffect(() => {
    if (!mounted || authToken) {
      setShowStickyBar(false);
      return;
    }
    if (!showModal) setShowStickyBar(true);
  }, [showModal, mounted, authToken]);

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

  if (!mounted || authToken) return null;

  return (
    <>
      {/* ── Sticky bar ───────────────────────────────────────────── */}
      {showStickyBar && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Get 5% off your first order"
          onClick={handleStickyOpen}
          onKeyDown={(e) => e.key === "Enter" && handleStickyOpen()}
          className="
            fixed bottom-6 left-1/2 -translate-x-1/2 z-40
            flex items-center gap-2
            bg-black text-white text-sm font-semibold
            px-5 py-2.5 shadow-2xl
            cursor-pointer select-none
            hover:bg-gray-900 transition-colors duration-200
            animate-bounce-once
          "
          style={{ borderRadius: "2px" }}
        >
          <FiTag size={14} className="shrink-0" />
          <span>5% OFF your first order — claim now</span>
          <button
            aria-label="Close banner"
            onClick={handleStickyClose}
            className="ml-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={14} />
          </button>
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
            <div className="mb-6">
              <Image
                src={storeSettings?.logo ?? logo.src}
                width={90}
                height={90}
                alt="Store logo"
                className="object-contain mx-auto"
              />
            </div>

            {/* Headline */}
            <h2 className="text-2xl font-bold text-black mb-2 leading-tight">
              Get 5% OFF your first order
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Sign up and unlock your instant discount.
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
              Valid on your first order only. Discount applied automatically at
              checkout.
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
        @keyframes bounceOnce {
          0%,100% { transform: translateX(-50%) translateY(0); }
          40%      { transform: translateX(-50%) translateY(-8px); }
        }
        .animate-bounce-once {
          animation: bounceOnce 0.9s ease 0.4s 1;
        }
      `}</style>
    </>
  );
}
