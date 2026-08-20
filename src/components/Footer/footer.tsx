"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useFooterData } from "@/hooks/useFooterData";
import { Mail, Phone, ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaPinterest, FaTwitter, FaYoutube } from "react-icons/fa";

export default function BaseFooter() {
  const { storeInfo, categories, navigation, newsletter, bottom } = useFooterData();

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <FaFacebook className="w-5 h-5 text-[#1877F2]" />;
      case "instagram":
        return <FaInstagram className="w-5 h-5 text-[#E1306C]" />;
      case "pinterest":
        return <FaPinterest className="w-5 h-5 text-[#BD081C]" />;
      case "twitter":
        return <FaTwitter className="w-5 h-5 text-[#1DA1F2]" />;
      case "youtube":
        return <FaYoutube className="w-5 h-5 text-[#FF0000]" />;
      default:
        return null;
    }
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto text-gray-900">
      {/* Main 4-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto">
        {/* Column 1: Store Information */}
        <div className="flex flex-col space-y-4">
          {storeInfo.logo ? (
            <div className="relative w-32 h-10">
              <Image
                src={storeInfo.logo}
                alt={storeInfo.name}
                fill
                sizes="128px"
                className="object-contain object-left"
              />
            </div>
          ) : (
            <span className="text-xl font-bold tracking-tight text-gray-900">
              {storeInfo.name}
            </span>
          )}

          <p className="text-sm text-gray-600 leading-relaxed">
            {storeInfo.description}
          </p>

          {/* Contact Information */}
          {(storeInfo.email || storeInfo.phone) && (
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
              {storeInfo.email && (
                <a
                  href={`mailto:${storeInfo.email}`}
                  className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{storeInfo.email}</span>
                </a>
              )}
              {storeInfo.phone && (
                <a
                  href={`tel:${storeInfo.phone}`}
                  className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{storeInfo.phone}</span>
                </a>
              )}
            </div>
          )}

          {/* Dynamic Social Icons */}
          {storeInfo.socialLinks.length > 0 && (
            <div className="flex items-center gap-3 pt-2">
              {storeInfo.socialLinks.map(({ platform, url, label }) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:scale-105 transition-all duration-200"
                >
                  {getSocialIcon(platform)}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Categories (Max 6) */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-1">
            {categories.title}
          </h3>
          <ul className="flex flex-col space-y-2.5">
            {categories.items.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={cat.href}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors block truncate"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Footer Navigation (Max 6) */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-1">
            {navigation.title}
          </h3>
          <ul className="flex flex-col space-y-2.5">
            {navigation.items.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.url}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors block truncate"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-1">
            Newsletter
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Subscribe to receive special offers, free giveaways, and once-in-a-lifetime deals.
          </p>

          {newsletter.subscribed ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-medium">
              ✓ Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={newsletter.handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletter.email}
                  onChange={(e) => newsletter.setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={newsletter.loading}
                  className="w-full px-3.5 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={newsletter.loading}
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {newsletter.loading ? (
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
              {newsletter.errorMsg && (
                <p className="text-xs text-red-500">{newsletter.errorMsg}</p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar: Copyright | Privacy Policy | Terms of Service */}
      <div className="border-t border-gray-200 py-6">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-500">
          <p>{bottom.copyright}</p>
          <div className="flex items-center gap-6">
            <Link
              href={bottom.privacyPolicy.href}
              className="hover:text-gray-900 transition-colors"
            >
              {bottom.privacyPolicy.label}
            </Link>
            <Link
              href={bottom.termsOfService.href}
              className="hover:text-gray-900 transition-colors"
            >
              {bottom.termsOfService.label}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
