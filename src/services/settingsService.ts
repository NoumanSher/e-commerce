import { get } from "@/lib/apiClient";

export interface StoreInfo {
  // Define based on dto if needed, or just use any for now to avoid circular deps
  [key: string]: any;
}

/**
 * Client-side: fetch store settings.
 * Uses the shared Axios client — the browser supplies the Origin header automatically.
 */
const getStoreSetting = async (): Promise<StoreInfo | null> => {
  const url = "/settings";
  try {
    return await get<StoreInfo>(url);
  } catch (error) {
    console.error("Error fetching store settings:", error);
    return null;
  }
};

export const settingsService = {
  getStoreSetting,
};
