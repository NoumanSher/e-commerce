import React from "react";
import dynamic from "next/dynamic";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AuthModal } from "@/components/AuthModal";
import { settingsService } from "@/services/settingsService";
import { FaWhatsapp } from "react-icons/fa";
import Slider from "@/components/Slider/Slider";
import StoreError from "./StoreError";
import { StoreInfo } from "@/components/Slider/dto/storeSettingDto";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";
import { createQueryClient } from "@/lib/queryClient";

// Dynamic imports — only load when needed to reduce initial bundle size
const Trending = dynamic(() => import("@/components/Trending/trending"), {
  loading: () => <div>Loading Trending...</div>,
});

const FallbackAutoPlay = dynamic(
  () => import("@/components/auto-play-video"),
  { loading: () => <div>Loading video...</div> }
);

const ShoppingCartModal = dynamic(
  () => import("@/components/shoppingCartModal/client/shoppingCartModal"),
  { ssr: false }
);

// Cache settings: revalidate this server page every 60 seconds
export const revalidate = 60;

export default async function LandingPage() {
  const queryClient = createQueryClient();

  let storeSettings: StoreInfo | undefined;
  try {
    storeSettings = await queryClient.ensureQueryData({
      queryKey: ["settings"],
      queryFn: () => settingsService.getStoreSetting(),
    });
  } catch {
    return (
      <StoreError message="Unable to load store settings. Please check your connection or try again later." />
    );
  }

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
        <Slider storeSettings={storeSettings} />
      </HydrationBoundary>

      <Trending />

      <div className="bg-[#faf9f8]">
        <FallbackAutoPlay />
      </div>

      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 animate-bounce"
        aria-label="Contact us on WhatsApp"
      >
        <div className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2">
          <FaWhatsapp size={24} />
          <span className="hidden sm:inline font-semibold">WhatsApp Us</span>
        </div>
      </a>
    </>
  );
}

export const generateMetadata = getLandingMetadata;
