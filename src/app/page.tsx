import React, { Suspense, lazy } from "react";
// const Footer = lazy(() => import("@/components/Footer/footer"));
const Trending = lazy(() => import("@/components/Trending/trending"));
// const Collection = lazy(() => import("@/components/Collection"));
// const LimitedEdition = lazy(() => import("@/components/Limited"));
const FallbackAutoPlay = lazy(() => import("@/components/auto-play-video"));
import Slider from "@/components/Slider/Slider";
const ShoppingCartModal = lazy(
  () => import("@/components/shoppingCartModal/client/shoppingCartModal")
);
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getStoreSetting } from "@/components/Slider/api/storeSettingApi";
import { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa";
// import FallbackAutoPlay from "@/components/auto-play-video";
// import video from '../assets/video/video1.mp4'
// Tell Next.js to not cache this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LandingPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
      },
    },
  });

  const storeSettings = await queryClient.fetchQuery({
    queryKey: ["settings"],
    queryFn: getStoreSetting,
    staleTime: 0,
  });

  // Force clear cache for this query
  await queryClient.invalidateQueries({ queryKey: ["settings"] });
  const landingWhatsappURL = `https://wa.me/923176872900`;
  return (
    <>
      <Suspense fallback={<div>Loading Slider .........</div>}>
        <ShoppingCartModal />
      </Suspense>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Slider storeSettings={storeSettings} />
      </HydrationBoundary>
      <Suspense fallback={<div>Loading Trending .........</div>}>
        <Trending />
      </Suspense>
      {/* <Suspense fallback={<div>Loading Inside Collection .........</div>}>
        <Collection />
      </Suspense> */}
      {/* <Suspense fallback={<div>Loading Limited Edition .........</div>}>
        <LimitedEdition />
      </Suspense> */}

      <Suspense fallback={<div>Loading video .........</div>}>
        <div className="bg-[#faf9f8]">
          <FallbackAutoPlay />
        </div>{" "}
      </Suspense>

      <a
        href={landingWhatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 animate-bounce"
      >
        <div className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2">
          <FaWhatsapp size={24} />
          <span className="hidden sm:inline font-semibold">WhatsApp Us</span>
        </div>
      </a>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 0,
        },
      },
    });

    const storeSettings = await queryClient.fetchQuery({
      queryKey: ["settings"],
      queryFn: getStoreSetting,
      staleTime: 0,
    });

    return {
      title: storeSettings.title,
      icons: {
        icon: [
          { url: `${storeSettings.logo}`, type: "image/png", sizes: "32x32" },
        ],
      },
      description: storeSettings.description,
      creator: "PakShipper",
      applicationName: "PakShipper",
      generator: "Next.js",
    };
  } catch (error) {
    // Return default metadata in case of an error
    return {
      title: "Error loading metadata",
      description: "An error occurred while loading metadata.",
      creator: "PakShipper",
      applicationName: "Error",
      generator: "Next.js",
    };
  }
}
