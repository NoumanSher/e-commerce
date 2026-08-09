import { headers } from "next/headers";
import { unstable_cache } from "next/cache";
import { getStoreSettingServer } from "@/services/settingsService.server";

/**
 * Server-only helper to resolve the active theme dynamically.
 *
 * It extracts the host from headers, retrieves the cached store settings from
 * the database (tenant-isolated), and checks the 'theme' field.
 *
 * Fallback priority:
 * 1. Database settings 'theme' field (configured via admin/merchant panel)
 * 2. NEXT_PUBLIC_ACTIVE_THEME environment variable (developer override)
 * 3. "default" base theme
 */
export async function resolveActiveTheme(): Promise<string> {
  let host = "default";
  try {
    host = headers().get("host") ?? "default";
    const cleanHost = host.split(":")[0].toLowerCase();
    if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
      host = process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "sandbox.localhost";
    }
  } catch {
    // Fail-safe during static generation / next build
  }

  try {
    const getCachedStoreSettings = unstable_cache(
      () => getStoreSettingServer(host),
      [`layout-store-settings-${host}`],
      { revalidate: 300, tags: ["store-settings", host] }
    );

    const settings = await getCachedStoreSettings();
    if (settings?.theme) {
      return settings.theme;
    }
  } catch (error) {
    console.error("[resolveActiveTheme] Failed to resolve theme from DB:", error);
  }

  return process.env.NEXT_PUBLIC_ACTIVE_THEME ?? "default";
}
