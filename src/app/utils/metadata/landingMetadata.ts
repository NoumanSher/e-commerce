// utils/metadata/landingMetadata.ts

import { Metadata } from "next";
import { headers } from "next/headers";
import { getStoreSettingServer } from "@/services/settingsService.server";
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

  try {
    const storeSettings = await getStoreSettingServer(host);

    const storeName = storeSettings?.title || "PakShipperStore";
    const titleText = pageTitle ? `${pageTitle} | ${storeName}` : storeName;
    const faviconUrl = storeSettings?.logo || logo.src;

    return {
      title: titleText,
      description:
        storeSettings?.description || "Your favorite shopping destination",
      icons: {
        icon: [
          {
            url: faviconUrl,
          },
        ],
        shortcut: faviconUrl,
        apple: faviconUrl,
      },
      creator: storeName,
      applicationName: storeName,
      generator: "Next.js",
    };
  } catch (error) {
    console.error("Error generating landing metadata:", (error as any)?.message || error);
    return {
      title: pageTitle ? `${pageTitle} | PakShipperStore` : "PakShipperStore",
      description: "Your favorite shopping destination",
    };
  }
}

export function createGenerateMetadata(pageTitle?: string) {
  return async function generateMetadata(): Promise<Metadata> {
    return getLandingMetadata(pageTitle);
  };
}
