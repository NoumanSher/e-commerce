"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useGetStoreSettings } from "@/components/Slider/query/storeSettingQuery";
import { useCategoriesQuery } from "@/hooks/useProductsQuery";

import { subscribeNewsletter } from "@/services/newsletterService";

export default function AquaMistFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { data: storeSettings } = useGetStoreSettings();
  const { data: categoriesResponse } = useCategoriesQuery();

  // Dynamic categories from the database — only active ones
  const categories = useMemo(
    () => (categoriesResponse?.categories || []).filter((c) => c.isActive !== false),
    [categoriesResponse]
  );

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setErrorMsg("");
    try {
      await subscribeNewsletter(email.trim());
      setSubscribed(true);
      setEmail("");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Social links from settings
  const socialLinks = [
    {
      href: storeSettings?.facebookUrl,
      label: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      href: storeSettings?.instagramUrl,
      label: "Instagram",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      href: storeSettings?.pinterestUrl,
      label: "Pinterest",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      ),
    },
  ].filter((s) => !!s.href);

  return (
    <footer className="w-full py-12 bg-[#0a0f1e]/85 backdrop-blur-[16px] border-t border-white/10">
      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-5 md:px-20 max-w-[1280px] mx-auto">

        {/* Brand Column */}
        <div className="flex flex-col space-y-4">
          <span className="font-eb-garamond text-2xl font-light text-aq-on-surface">
            {storeSettings?.title || "HumidAura"}
          </span>
          <p className="font-inter text-sm text-aq-on-surface-variant leading-relaxed">
            {storeSettings?.description ||
              "Elevating your atmosphere through innovative design and atmospheric luxury."}
          </p>

          {/* Contact info — clickable and readable */}
          {(storeSettings?.email || storeSettings?.mobile) && (
            <div className="flex flex-col space-y-2 pt-3 border-t border-white/5">
              {storeSettings?.email && (
                <a
                  href={`mailto:${storeSettings.email}`}
                  className="font-inter text-sm text-aq-on-surface-variant hover:text-aq-primary transition-colors duration-300 flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {storeSettings.email}
                </a>
              )}
              {storeSettings?.mobile && (
                <a
                  href={`tel:${storeSettings.mobile}`}
                  className="font-inter text-sm text-aq-on-surface-variant hover:text-aq-primary transition-colors duration-300 flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.5a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {storeSettings.mobile}
                </a>
              )}
            </div>
          )}

          {/* Social icons */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-aq-on-surface-variant hover:text-aq-primary hover:border-aq-primary/40 hover:bg-aq-primary/10 transition-all duration-300"
                >
                  {icon}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Shop Links — dynamic from database */}
        <div className="flex flex-col space-y-3">
          <span className="font-eb-garamond text-lg text-aq-on-surface mb-2">
            Shop
          </span>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/collections?parentCategorySlug=${cat.slug}`}
                className="font-inter text-sm text-aq-on-surface-variant hover:text-aq-primary transition-colors duration-300"
              >
                {cat.name}
              </Link>
            ))
          ) : (
            // Fallback while loading or if empty
            ["Collections"].map((item) => (
              <Link
                key={item}
                href="/collections"
                className="font-inter text-sm text-aq-on-surface-variant hover:text-aq-primary transition-colors duration-300"
              >
                {item}
              </Link>
            ))
          )}
        </div>

        {/* Support Links */}
        <div className="flex flex-col space-y-3">
          <span className="font-eb-garamond text-lg text-aq-on-surface mb-2">
            Support
          </span>
          {[
            { label: "FAQ", href: "/faq" },
            { label: "Shipping & Returns", href: "/shipping-and-returns" },
            { label: "Contact Us", href: "/contact" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="font-inter text-sm text-aq-on-surface-variant hover:text-aq-primary transition-colors duration-300"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="flex flex-col space-y-4">
          <span className="font-eb-garamond text-lg text-aq-on-surface mb-2">
            Newsletter
          </span>
          <p className="font-inter text-sm text-aq-on-surface-variant">
            Subscribe for updates and serene inspiration.
          </p>
          {subscribed ? (
            <p className="font-inter text-sm text-aq-primary animate-fadeIn flex items-center gap-1.5 font-medium">
              <span>✓</span> You&apos;re subscribed to our newsletter!
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-1.5">
              <div className="flex items-end gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  disabled={loading}
                  className="bg-transparent border-b border-white/20 focus:border-aq-primary-container focus:outline-none text-aq-on-surface text-sm py-2 px-0 w-full placeholder-aq-on-surface/40 transition-colors duration-300 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Subscribe"
                  className="text-aq-primary-container hover:text-aq-primary transition-colors duration-300 shrink-0 pb-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-aq-primary-container border-t-transparent rounded-full animate-spin mb-0.5" />
                  ) : (
                    <span className="material-symbols-outlined text-[22px]">
                      arrow_forward
                    </span>
                  )}
                </button>
              </div>
              {errorMsg && (
                <p className="text-xs text-rose-400 font-inter mt-1">{errorMsg}</p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-16 pt-8 border-t border-white/10 px-5 md:px-20 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-inter text-aq-on-surface-variant">
        <p>© {new Date().getFullYear()} {storeSettings?.title || "HumidAura"}. All rights reserved.</p>
        <div className="flex gap-6">
          <Link
            href="/privacy-policy"
            className="hover:text-aq-primary transition-colors duration-300"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="hover:text-aq-primary transition-colors duration-300"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
