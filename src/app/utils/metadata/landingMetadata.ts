// utils/metadata/landingMetadata.ts

import { Metadata } from "next";
import { headers } from "next/headers";
import { getStoreSettingServer } from "@/services/settingsService.server";
import logo from '@/assets/img/logo.webp';

export async function getLandingMetadata(): Promise<Metadata> {
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

  try {
    const storeSettings = await getStoreSettingServer(host);

    if (!storeSettings) throw new Error("Failed to fetch store settings");

    return {
      title: storeSettings.title || "PakshipperStore",
      description:
        storeSettings.description || "Your favorite shopping destination",
      icons: {
        icon: [
          {
            url: storeSettings.logo || logo.src,
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
    console.error("Error generating landing metadata:", (error as any)?.message || error);
    return {
      title: "PakshipperStore",
      description: "Your favorite shopping destination",
    };
  }
}

