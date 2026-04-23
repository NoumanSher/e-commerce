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

// const jost = Jost({ subsets: ["latin"] }); // Load the Jost font

const jost = Jost({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Specify weights if needed
  style: ["normal", "italic"], // Optional: Include both normal and italic styles
});

export const metadata: Metadata = {
  title: "PakShipperStore - E-commerce",
  description: "Your favorite shopping destination",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = createQueryClient();

  // Prefetch global settings (used by Navbar, Footer, policy pages)
  await queryClient.prefetchQuery({
    queryKey: queryKeys.store.settings(),
    queryFn: () => settingsService.getStoreSetting(),
  });

  // Prefetch categories (used by Trending, All Products, Wishlist, Navbar category tabs)
  await queryClient.prefetchQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: () => productsService.fetchAllCategories(),
  });

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
              <ToastContainer
                autoClose={2000}
                theme="colored"
                position="top-right"
              />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <OfflineIndicator />
              <ReactQueryDevtools initialIsOpen={false} />
            </StoreTypeProviderWrapper>
          </HydrationBoundary>
        </Provider>
      </body>
    </html>
  );
}
