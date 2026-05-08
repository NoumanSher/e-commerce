import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AuthModal } from "@/components/AuthModal";
import { settingsService } from "@/services/settingsService";
import { FaWhatsapp } from "react-icons/fa";
import Slider from "@/components/Slider/Slider";
import { unstable_cache } from "next/cache";
import ScrollReveal from "@/components/common/ScrollReveal";

import { StoreInfo } from "@/components/Slider/dto/storeSettingDto";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";
import { createQueryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

// Use the same cached fetchers as layout so both share one server-side response.
const getCachedStoreSettings = unstable_cache(
  () => settingsService.getStoreSetting(),
  ["layout-store-settings"],
  { revalidate: 300, tags: ["store-settings"] }
);

const PromoGrid = dynamic(() => import("@/components/PromoGrid/PromoGrid"), { ssr: false });

const TrendingSkeleton = () => (
  <div className="bg-[#faf9f8] px-4 md:px-6 mx-auto pt-7 pb-10">
    {/* Category pills skeleton */}
    <div className="flex justify-center gap-6 mb-6 mt-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
      ))}
    </div>
    {/* Product grid skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 xl:max-w-[1440px] mx-auto">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded overflow-hidden shadow-sm">
          <div className="aspect-square w-full bg-gray-200 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PromoGridSkeleton = () => (
  <div className="bg-[#faf9f8] px-4 md:px-6 py-10">
    <div className="xl:max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="w-full aspect-square bg-gray-200 animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

// Dynamic imports — only load when needed to reduce initial bundle size
const Trending = dynamic(() => import("@/components/Trending/trending"), {
  ssr: false,
  loading: TrendingSkeleton,
});



const ShoppingCartModal = dynamic(
  () => import("@/components/shoppingCartModal/client/shoppingCartModal"),
  { ssr: false }
);

const FAQ = dynamic(() => import("@/components/FAQ"), {
  ssr: false,
});

// Cache settings: revalidate this server page every 5 minutes (matches layout cache)
export const revalidate = 300;

export default async function LandingPage() {
  const queryClient = createQueryClient();

  const storeSettings = (await queryClient.ensureQueryData({
    queryKey: queryKeys.store.settings(),
    queryFn: getCachedStoreSettings,
  })) as StoreInfo | undefined;

  const whatsappPhone =
    storeSettings?.mobile ??
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ??
    "923176872900";
  const whatsappURL = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent("hey, I need help")}`;

  return (
    <>
      <AuthModal />
      <ShoppingCartModal />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Slider storeSettings={storeSettings} />

        {/* Trending — below the fold; reserve ~700px to prevent CLS */}
        <ScrollReveal fallback={<TrendingSkeleton />} minHeight="700px">
          <Trending />
        </ScrollReveal>

        {/* PromoGrid — reserve ~600px for 2-col square grid */}
        <ScrollReveal fallback={<PromoGridSkeleton />} minHeight="600px">
          <PromoGrid promoCards={storeSettings?.promoCards || []} />
        </ScrollReveal>

        {storeSettings?.bannerImg && (
          <ScrollReveal
            fallback={<div className="w-full h-[200px] md:h-[600px] bg-gray-100 animate-pulse mb-12" />}
            minHeight="200px"
          >
            <div className="w-full pb-12">
              <div className="relative w-full overflow-hidden group">
                {storeSettings.bannerImgLink ? (
                  <Link href={storeSettings.bannerImgLink}>
                    <Image
                      src={storeSettings.bannerImg}
                      alt={storeSettings.title || "Promotional Banner"}
                      width={1920}
                      height={600}
                      className="w-full h-auto transition-transform duration-700 ease-in-out group-hover:scale-[1.01]"
                      sizes="100vw"
                      loading="lazy"
                    />
                  </Link>
                ) : (
                  <Image
                    src={storeSettings.bannerImg}
                    alt={storeSettings.title || "Promotional Banner"}
                    width={1920}
                    height={600}
                    className="w-full h-auto transition-transform duration-700 ease-in-out group-hover:scale-[1.01]"
                    sizes="100vw"
                    loading="lazy"
                  />
                )}
                {/* Subtle overlay for consistent aesthetic */}
                <div className="absolute inset-0 bg-black/5 pointer-events-none" />
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* FAQ — reserve ~300px */}
        <ScrollReveal fallback={<div className="w-full h-[300px] bg-white animate-pulse" />} minHeight="300px">
          <FAQ />
        </ScrollReveal>
      </HydrationBoundary>

      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-2 md:bottom-4 right-6 z-40 group"
        aria-label="Contact us on WhatsApp"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-green-400 opacity-60 animate-ping" aria-hidden="true" />
        <div className="relative bg-green-500 hover:bg-green-600 active:scale-95 text-white pl-4 pr-5 py-3 rounded-full shadow-xl flex items-center gap-2.5 transition-all duration-200 group-hover:shadow-green-300/50 group-hover:shadow-lg">
          <FaWhatsapp size={22} />
          {/* <span className="text-sm font-semibold tracking-wide">WhatsApp Us</span> */}
        </div>
      </a>
    </>
  );
}

export const generateMetadata = getLandingMetadata;
