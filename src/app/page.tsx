import React from "react";
import dynamic from "next/dynamic";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getStoreSetting } from "@/components/Slider/api/storeSettingApi";
import { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa";
import Slider from "@/components/Slider/Slider";
import { auth } from "@/auth";
import StoreError from "./StoreError";
import { StoreInfo } from "@/components/Slider/dto/storeSettingDto";

// Dynamic imports with loading states
const Trending = dynamic(() => import("@/components/Trending/trending"), {
  suspense: true,
  loading: () => <div>Loading Trending...</div>,
});

const FallbackAutoPlay = dynamic(() => import("@/components/auto-play-video"), {
  suspense: true,
  loading: () => <div>Loading video...</div>,
});

const ShoppingCartModal = dynamic(
  () => import("@/components/shoppingCartModal/client/shoppingCartModal"),
  {
    suspense: true,
    ssr: false, // Disable SSR for modal since it's client-side only
  }
);

// Shared query client configuration
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute cache
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });

// Cache settings for 1 minute (adjust as needed)
export const revalidate = 60;

export default async function LandingPage() {
  const sesion = await auth();
    console.log(sesion);

  const queryClient = createQueryClient();
  const landingWhatsappURL = `https://wa.me/923176872900`;

// Try to get from cache first
let storeSettings = queryClient.getQueryData<StoreInfo>(["settings"]);

if (!storeSettings) {
  storeSettings = await queryClient.fetchQuery({
    queryKey: ["settings"],
    queryFn: getStoreSetting,
  });
}
 if (!storeSettings) {
    return <StoreError message="Unable to load store settings. Please check your connection or try again later." />;
  }
  return (
    <>
      <ShoppingCartModal />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Slider storeSettings={storeSettings} />
      </HydrationBoundary>

      <Trending />

      <div className="bg-[#faf9f8]">
        <FallbackAutoPlay />
      </div>

      <a
        href={landingWhatsappURL}
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

// Shared metadata generation
export async function generateMetadata(): Promise<Metadata> {
  const queryClient = createQueryClient();

  try {
    const storeSettings = await queryClient.fetchQuery({
      queryKey: ["settings"],
      queryFn: getStoreSetting,
    });

    return {
      title: storeSettings?.title || "Pakshipper",
      description:
        storeSettings?.description || "Your favorite shopping destination",
      icons: {
        icon: [
          {
            url: storeSettings?.logo || "/default-logo.png",
            type: "image/png",
            sizes: "32x32",
          },
        ],
      },
      creator: "Blazlogic",
      applicationName: "PakShipperStore",
      generator: "Next.js",
    };
  } catch (error) {
    return {
      title: "Pakshipper",
      description: "Your favorite shopping destination",
    };
  }
}
