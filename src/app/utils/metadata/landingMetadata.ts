// utils/metadata/landingMetadata.ts

import { Metadata } from "next";
import { StoreInfo } from "@/components/Slider/dto/storeSettingDto";
import { BASE_URL_LIVE } from "@/appConst/appConst";

export async function getLandingMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${BASE_URL_LIVE}/settings`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch store settings");

    const storeSettings: StoreInfo = await res.json();

    return {
      title: storeSettings.title || "Pakshipperr",
      description: storeSettings.description || "Your favorite shopping destination",
      icons: {
        icon: [
          {
            url: storeSettings.logo || "/default-logo.png",
            type: "image/png",
            sizes: "32x32",
          },
        ],
      },
      creator: "Blazlogic",
      applicationName: "PakShipperStore",
      generator: "Next.js",
    };
  } catch {
    return {
      title: "Pakshipper",
      description: "Your favorite shopping destination",
    };
  }
}
