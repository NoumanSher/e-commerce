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
// import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next";
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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jost.className} flex flex-col min-h-screen`}>
        <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID as string} />
        {/* <Analytics /> */}
        {/* <SpeedInsights /> */}
        <Provider>
          <StoreTypeProviderWrapper>
            <ToastContainer
              autoClose={2000}
              theme="colored"
              position="top-right"
            />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ReactQueryDevtools initialIsOpen={false} />
          </StoreTypeProviderWrapper>
        </Provider>
      </body>
    </html>
  );
}
