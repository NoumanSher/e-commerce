import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer/footer";
import StoreTypeProviderWrapper from "@/context/StoreTypeProviderWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Provider from "@/context/react-query-provider";
import OfflineIndicator from "@/components/OfflineIndicator";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/queryClient";
import { settingsService } from "@/services/settingsService";
import { productsService } from "@/services/productsService";
import { queryKeys } from "@/lib/queryKeys";
import { SocketProvider } from "@/context/SocketContext";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";

const FirstOrderBanner = dynamic(
  () => import("@/components/FirstOrderBanner"),
  { ssr: false }
);

// Cache the layout-level prefetches for 5 minutes across all requests.
// This means clicking the logo won't re-hit the backend on every navigation.
export const revalidate = 300;

const getCachedStoreSettings = unstable_cache(
  () => settingsService.getStoreSetting(),
  ["layout-store-settings"],
  { revalidate: 300, tags: ["store-settings"] }
);

const getCachedCategories = unstable_cache(
  () => productsService.fetchAllCategories(),
  ["layout-categories"],
  { revalidate: 300, tags: ["categories"] }
);

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Only the weights actually used
  display: "swap", // Prevents invisible text during font load (FOIT)
});

export const metadata: Metadata = {
  title: "PakShipperStore - E-commerce",
  description: "Your favorite shopping destination",
  other: {
    "p:domain_verify": "c9fe3fb877e373bceb51284b8fa11ffa",
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = createQueryClient();

  // Prefetch global settings and categories using cached fetchers.
  // unstable_cache ensures these API calls are served from the server cache
  // instead of hitting the backend on every page navigation.
  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.store.settings(),
        queryFn: getCachedStoreSettings,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.categories.all(),
        queryFn: getCachedCategories,
      }),
    ]);
  } catch (error) {
    console.error("Layout prefetching failed:", error);
    // Continue rendering - the client will retry the fetches
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jost.className} flex flex-col min-h-screen`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "PakShipper",
              description: "E-commerce shopping destination serving Lahore and all over Pakistan.",
              url: "https://pakshipper.com",
              telephone: "+923176872900",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Lahore",
                addressRegion: "Punjab",
                postalCode: "54000",
                addressCountry: "PK"
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 31.5204,
                longitude: 74.3587
              },
              areaServed: {
                "@type": "Country",
                name: "Pakistan"
              }
            })
          }}
        />
        <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID as string} />

        <Provider>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <StoreTypeProviderWrapper>
              <SocketProvider>
                <ToastContainer
                  autoClose={2000}
                  theme="colored"
                  position="top-right"
                />
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <FirstOrderBanner />
                <OfflineIndicator />
                <ReactQueryDevtools initialIsOpen={false} />
              </SocketProvider>
            </StoreTypeProviderWrapper>
          </HydrationBoundary>
        </Provider>
      </body>
    </html>
  );
}
