import { get } from "@/lib/apiClient";

export interface StoreInfo {
  // Define based on dto if needed, or just use any for now to avoid circular deps
  [key: string]: any;
}

/**
 * Client-side: fetch store settings.
 * Uses the shared Axios client — the browser supplies the Origin header automatically.
 */
const getStoreSetting = async (): Promise<StoreInfo> => {
  const url = "/settings";
  return await get<StoreInfo>(url);
};

export const settingsService = {
  getStoreSetting,
};
