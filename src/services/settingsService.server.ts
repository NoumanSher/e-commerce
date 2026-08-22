/**
 * settingsService.server.ts
 *
 * SERVER-ONLY — safe to import only from Server Components and Route Handlers.
 *
 * Functions accept `host` as an explicit parameter (not read from next/headers
 * internally). The caller must read the host from next/headers in the Server
 * Component scope and pass it down.
 *
 * Do NOT import this from Client Components.
 */

import { cache } from "react";
import { serverGet } from "@/lib/serverApiClient";
import type { StoreInfo } from "@/services/settingsService";

/**
 * Fetch store settings for the current tenant.
 * Wrapped with React cache() to deduplicate multiple calls with the same host within a single request.
 *
 * @param host  Value of headers().get('host') from the calling Server Component.
 */
export const getStoreSettingServer = cache(async (
  host: string
): Promise<StoreInfo | null> => {
  try {
    return await serverGet<StoreInfo>("/settings", host);
  } catch (error) {
    console.error("[SSR] Error fetching store settings:", (error as any)?.message || error);
    return null;
  }
});
