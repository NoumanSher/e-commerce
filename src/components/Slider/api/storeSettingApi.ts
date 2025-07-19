// src/components/Slider/api/storeSettingApi.ts
import { StoreInfo } from "../dto/storeSettingDto";
import { BASE_URL_LIVE } from "@/appConst/appConst";

export async function getStoreSetting(): Promise<StoreInfo | null> {
  try {
    const res = await fetch(`${BASE_URL_LIVE}/settings`, {
      // Next.js ISR cache config
      next: { revalidate: 60 }, // revalidate every 60 seconds
      // optional: make sure fresh response is pulled
    });

    if (!res.ok) {
      console.error(`Failed to fetch settings: ${res.status}`);
      return null;
    }

    const data: StoreInfo = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching store settings:", error);
    return null;
  }
}
