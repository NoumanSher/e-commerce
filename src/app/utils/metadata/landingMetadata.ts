// utils/metadata/landingMetadata.ts

import { Metadata } from "next";
import { settingsService } from "@/services/settingsService";
import logo from '@/assets/img/logo.webp'

export async function getLandingMetadata(): Promise<Metadata> {
  try {
    const storeSettings = await settingsService.getStoreSetting();

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
    console.error("Error generating landing metadata:", error);
    return {
      title: "PakshipperStore",
      description: "Your favorite shopping destination",
    };
  }
}
