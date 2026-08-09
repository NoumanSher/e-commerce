import type { Metadata } from "next";
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
import { queryKeys } from "@/lib/queryKeys";
import { SocketProvider } from "@/context/SocketContext";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import dynamic from "next/dynamic";
// Server-only service imports — these use next/headers internally and must
// NOT be imported from Client Components.
import { getStoreSettingServer } from "@/services/settingsService.server";
import { fetchAllCategoriesServer } from "@/services/productsService.server";
import { resolveActiveTheme } from "@/utils/theme";

// Theme layouts
import AquaMistLayout from "@/themes/aquamist/layout";

const FirstOrderBanner = dynamic(
  () => import("@/components/FirstOrderBanner"),
  { ssr: false }
);

// Segment-level revalidation: SSR pages are stale-revalidated every 5 minutes.
export const revalidate = 300;

// Font loaded via <link> tag below (browser-side) — no build-time network call.

import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";
import DynamicStoreHead from "@/components/DynamicStoreHead";

export async function generateMetadata(): Promise<Metadata> {
  return getLandingMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * Multi-tenant SSR cache key isolation
   * ─────────────────────────────────────
   * IMPORTANT: `headers()` MUST be called here in the Server Component scope —
   * NOT inside `unstable_cache` callbacks. Cached functions run in a context
   * without an active request, so `next/headers` would hang or throw inside them.
   *
   * We read `host` once here, then pass it as a plain string parameter to the
   * service functions and as part of the cache key so each tenant gets its own
   * isolated cache entry (prevents Tenant A's data leaking to Tenant B).
   */
  let host = "default";
  try {
    host = headers().get("host") ?? "default";
    const cleanHost = host.split(":")[0].toLowerCase();
    if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
      host = process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "sandbox.localhost";
    }
  } catch {
    // During `next build` static generation there is no request context.
    // Fall back to "default" — the prefetch calls will fail gracefully.
  }

  // Per-tenant unstable_cache wrappers.
  // `host` is a captured string — headers() is NOT called inside these callbacks.
  const getCachedStoreSettings = unstable_cache(
    () => getStoreSettingServer(host),
    [`layout-store-settings-${host}`],
    { revalidate: 300, tags: ["store-settings", host] }
  );

  const getCachedCategories = unstable_cache(
    () => fetchAllCategoriesServer(host),
    [`layout-categories-${host}`],
    { revalidate: 300, tags: ["categories", host] }
  );

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
    // Continue rendering — the client will retry the fetches
  }

  /**
   * Active theme — read from env so the merchant owner can switch
   * themes without a code change.
   *
   * NEXT_PUBLIC_ACTIVE_THEME=aquamist  ← enables the AquaMist theme
   * (default) ← uses the original Navbar / Footer layout
   */
  const activeTheme = await resolveActiveTheme();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts CDN for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Jost font — loaded in the browser, NOT at build time */}
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-jost flex flex-col min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "PakShipper",
              description:
                "E-commerce shopping destination serving Lahore and all over Pakistan.",
              url: "https://pakshipper.com",
              telephone: "+923176872900",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Lahore",
                addressRegion: "Punjab",
                postalCode: "54000",
                addressCountry: "PK",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 31.5204,
                longitude: 74.3587,
              },
              areaServed: {
                "@type": "Country",
                name: "Pakistan",
              },
            }),
          }}
        />
        <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID as string} />

        <Provider>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <StoreTypeProviderWrapper>
              {/*
               * SocketProvider is a no-op stub — WebSockets are disabled because
               * the backend runs on Vercel's free tier which does not support
               * persistent connections. All children using `useSocket()` receive
               * safe empty defaults and continue to function normally.
               */}
              <SocketProvider>
                <ToastContainer
                  autoClose={2000}
                  theme="colored"
                  position="top-right"
                />

                {/* ── Theme-aware chrome ─────────────────────────────── */}
                {activeTheme === "aquamist" ? (
                  // AquaMist has its own Header, Footer and fonts
                  <AquaMistLayout>{children}</AquaMistLayout>
                ) : (
                  // Default theme — original Navbar / Footer
                  <>
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </>
                )}

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
