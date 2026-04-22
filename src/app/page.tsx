import React from "react";
import dynamic from "next/dynamic";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AuthModal } from "@/components/AuthModal";
import { settingsService } from "@/services/settingsService";
import { FaWhatsapp } from "react-icons/fa";
import Slider from "@/components/Slider/Slider";

import { StoreInfo } from "@/components/Slider/dto/storeSettingDto";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";
import { createQueryClient } from "@/lib/queryClient";
import PromoGrid from "@/components/PromoGrid/PromoGrid";

// Dynamic imports — only load when needed to reduce initial bundle size
const Trending = dynamic(() => import("@/components/Trending/trending"), {
  loading: () => (
    <div className="bg-[#faf9f8] px-4 md:px-6 mx-auto pt-7">
      {/* Category pills skeleton */}
      <div className="flex justify-center gap-6 mb-6 mt-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 xl:max-w-[1440px] mx-auto">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded overflow-hidden shadow-sm">
            <div className="aspect-[3/4] w-full bg-gray-200 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});

const FallbackAutoPlay = dynamic(
  () => import("@/components/auto-play-video"),
  {
    loading: () => (
      <div className="w-full max-w-4xl mx-auto mb-10 aspect-video bg-gray-200 animate-pulse rounded-lg" />
    ),
  }
);

const ShoppingCartModal = dynamic(
  () => import("@/components/shoppingCartModal/client/shoppingCartModal"),
  { ssr: false }
);

const FAQ = dynamic(() => import("@/components/FAQ"), {
  ssr: false,
});

// Cache settings: revalidate this server page every 60 seconds
export const revalidate = 60;

export default async function LandingPage() {
  const queryClient = createQueryClient();

  const storeSettings = (await queryClient.ensureQueryData({
    queryKey: ["settings"],
    queryFn: () => settingsService.getStoreSetting(),
  })) as StoreInfo | null;

  const whatsappPhone =
    (storeSettings as any)?.whatsappPhone ??
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ??
    "923176872900";
  const whatsappURL = `https://wa.me/${whatsappPhone}`;

  return (
    <>
      <AuthModal />
      <ShoppingCartModal />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Slider storeSettings={storeSettings as any} />
      </HydrationBoundary>

      <Trending />

      <PromoGrid promoCards={(storeSettings as any)?.promoCards || []} />

      <div className="bg-[#faf9f8] px-4 md:px-6 py-10">
        <div className="text-center mb-6">
          <h2 className="text-[26px] xl:text-[32px] font-light leading-[1.2em] tracking-wide">
            Watch Our Story
          </h2>
          <div className="flex justify-center mt-1">
            <span className="block w-10 h-[2px] bg-black rounded-full" />
          </div>
        </div>
        <FallbackAutoPlay />
      </div>

      <FAQ />

      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-6 right-6 z-40 group"
        aria-label="Contact us on WhatsApp"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-green-400 opacity-60 animate-ping" aria-hidden="true" />
        <div className="relative bg-green-500 hover:bg-green-600 active:scale-95 text-white pl-4 pr-5 py-3 rounded-full shadow-xl flex items-center gap-2.5 transition-all duration-200 group-hover:shadow-green-300/50 group-hover:shadow-lg">
          <FaWhatsapp size={22} />
          <span className="text-sm font-semibold tracking-wide">WhatsApp Us</span>
        </div>
      </a>
    </>
  );
}

export const generateMetadata = getLandingMetadata;
