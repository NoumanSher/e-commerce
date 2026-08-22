"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useGetStoreSettings } from "@/components/Slider/query/storeSettingQuery";
import { useAppUIContext } from "@/context/AppUIContext";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function AquaMistHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { data: storeSettings } = useGetStoreSettings();
  const { updateSelectedCategory } = useAppUIContext();

  const handleHomeClick = useCallback(() => {
    updateSelectedCategory("");
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, updateSelectedCategory]);

  // ── Scroll-shadow effect ──────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Lock body scroll when mobile menu is open ──────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Desktop / Top Navigation ────────────────────────────────────── */}
      <nav
        className={[
          "fixed top-0 left-0 right-0 w-full h-[80px] z-50 transition-all duration-300",
          scrolled
            ? "bg-[#0a0f1e]/95 backdrop-blur-[20px] border-b border-white/15 shadow-lg shadow-black/30"
            : "bg-[#0a0f1e]/80 backdrop-blur-[20px] border-b border-white/10",
        ].join(" ")}
      >
        <div className="flex justify-between items-center px-5 md:px-20 w-full max-w-[1280px] mx-auto h-full">
          {/* Brand */}
          <Link
            href="/"
            onClick={handleHomeClick}
            className="flex items-center h-full max-h-[68px] relative"
          >
            {storeSettings?.logo ? (
              <Image
                src={storeSettings.logo}
                alt={storeSettings.title || "HumidAura Logo"}
                width={260}
                height={80}
                className="object-contain h-[56px] md:h-[68px] w-auto max-w-[260px] transition-transform duration-300 hover:scale-[1.03]"
                unoptimized
              />
            ) : (
              <span className="font-eb-garamond text-3xl font-light text-aq-on-surface tracking-wide hover:text-aq-primary transition-colors duration-300">
                {storeSettings?.title || "HumidAura"}
              </span>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={href === "/" ? handleHomeClick : undefined}
                className={[
                  "font-inter text-[14px] leading-[20px] tracking-[0.1em] font-semibold transition-colors duration-300",
                  isActive(href)
                    ? "text-aq-primary border-b-2 border-aq-primary pb-1"
                    : "text-aq-on-surface/80 hover:text-aq-primary",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Search (Desktop) */}
            <button
              aria-label="Search"
              className="hidden md:block text-aq-on-surface hover:text-aq-primary transition-colors duration-300"
            >
              <span className="material-symbols-outlined text-[22px]">
                search
              </span>
            </button>

            {/* Cart icon with live badge (Mobile & Desktop) */}
            <Link
              href="/cart"
              aria-label="View cart"
              className="relative text-aq-on-surface hover:text-aq-primary transition-colors duration-300 p-1"
            >
              <span className="material-symbols-outlined text-[22px]">
                shopping_cart
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-aq-primary text-aq-on-primary text-[9px] font-inter font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Profile icon (Mobile & Desktop) */}
            <Link
              href="/profile"
              aria-label="Account profile"
              className={[
                "items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-300 hidden lg:flex",
                pathname.startsWith("/profile")
                  ? "bg-aq-primary-container/20 border border-aq-primary text-aq-primary shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                  : "bg-white/5 border border-white/10 text-aq-on-surface hover:bg-white/10 hover:border-white/20 hover:text-aq-primary"
              ].join(" ")}
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                person
              </span>
            </Link>

            {/* Mobile hamburger toggle */}
            <button
              aria-label="Toggle mobile menu"
              className="md:hidden text-aq-on-surface hover:text-aq-primary transition-colors duration-300 p-1 ml-1"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="material-symbols-outlined text-[26px]">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0f1e]/98 backdrop-blur-[24px] flex flex-col pt-[80px]">
          <nav className="flex flex-col px-5 py-10 space-y-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => {
                  if (href === "/") handleHomeClick();
                  setMobileOpen(false);
                }}
                className={[
                  "font-inter text-[18px] tracking-[0.15em] font-semibold transition-colors duration-300",
                  isActive(href)
                    ? "text-aq-primary"
                    : "text-aq-on-surface/70 hover:text-aq-primary",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className={[
                "font-inter text-[18px] tracking-[0.15em] font-semibold transition-colors duration-300",
                pathname.startsWith("/profile")
                  ? "text-aq-primary"
                  : "text-aq-on-surface/70 hover:text-aq-primary",
              ].join(" ")}
            >
              PROFILE
            </Link>
            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
              <button
                aria-label="Search"
                className="text-aq-on-surface hover:text-aq-primary transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-[24px]">
                  search
                </span>
              </button>
              {/* <Link
                href="/cart"
                aria-label="View cart"
                onClick={() => setMobileOpen(false)}
                className="relative text-aq-on-surface hover:text-aq-primary transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-[24px]">
                  shopping_cart
                </span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-aq-primary text-aq-on-primary text-[9px] font-inter font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link> */}
              <Link
                href="/profile"
                aria-label="View profile"
                onClick={() => setMobileOpen(false)}
                className="text-aq-on-surface hover:text-aq-primary transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-[24px]">
                  person
                </span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
