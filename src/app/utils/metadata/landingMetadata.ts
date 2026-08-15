// utils/metadata/landingMetadata.ts

import { Metadata } from "next";
import { headers } from "next/headers";
import { getStoreSettingServer } from "@/services/settingsService.server";
import { getServerOrigin } from "@/utils/url";
import logo from "@/assets/img/logo.webp";

export async function getLandingMetadata(pageTitle?: string): Promise<Metadata> {
  let host = "default";
  try {
    host = headers().get("host") ?? "default";
    const cleanHost = host.split(":")[0].toLowerCase();
    if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
      host = process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "sandbox.localhost";
    }
  } catch {
    // During `next build` static generation there is no request context.
  }

  const origin = getServerOrigin(host);

  try {
    const storeSettings = await getStoreSettingServer(host);

    const storeName = storeSettings?.title || "PakShipperStore";
    const titleText = pageTitle ? `${pageTitle} | ${storeName}` : storeName;
    const description =
      storeSettings?.description ||
      `Shop high-quality products at ${storeName}. Discover great deals, fast shipping, and friendly customer support.`;
    const faviconUrl = storeSettings?.logo || logo.src;
    const bannerUrl = storeSettings?.bannerImg || faviconUrl;

    return {
      metadataBase: new URL(origin),
      title: {
        default: titleText,
        template: `%s | ${storeName}`,
      },
      description,
      applicationName: storeName,
      authors: [{ name: storeName, url: origin }],
      generator: "Next.js",
      keywords: [
        storeName,
        "online shopping",
        "ecommerce",
        "best prices",
        "fast delivery",
        "Pakistan shopping",
        "buy online",
      ],
      referrer: "origin-when-cross-origin",
      creator: storeName,
      publisher: storeName,
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      alternates: {
        canonical: origin,
      },
      icons: {
        icon: [
          {
            url: faviconUrl,
            type: "image/png",
            sizes: "32x32",
          },
        ],
        shortcut: faviconUrl,
        apple: faviconUrl,
      },
      openGraph: {
        title: titleText,
        description,
        url: origin,
        siteName: storeName,
        images: [
          {
            url: bannerUrl,
            width: 1200,
            height: 630,
            alt: `${storeName} Online Store`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: titleText,
        description,
        images: [bannerUrl],
        creator: `@${storeName.replace(/\s+/g, "")}`,
      },
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      category: "ecommerce",
    };
  } catch (error) {
    console.error("Error generating landing metadata:", (error as any)?.message || error);
    return {
      metadataBase: new URL(origin),
      title: pageTitle ? `${pageTitle} | PakShipperStore` : "PakShipperStore",
      description: "Your favorite online shopping destination.",
    };
  }
}

export function createGenerateMetadata(pageTitle?: string) {
  return async function generateMetadata(): Promise<Metadata> {
    return getLandingMetadata(pageTitle);
  };
}
