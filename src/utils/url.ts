/**
 * Tenant-aware URL utility.
 *
 * Multi-tenant storefronts each run on their own domain
 * (e.g. alrehman.pakshipper.com, zeeshmart.pakshipper.com).
 * Never hardcode "pakshipper.com" — always derive the origin dynamically
 * from the browser location (client) or Next.js request headers (server).
 */

// ── Client-side helpers (safe in "use client" components) ──────────────────

/**
 * Returns the current page's full origin, e.g. "https://alrehman.pakshipper.com".
 * Falls back to NEXT_PUBLIC_SITE_URL env var when window is unavailable (SSR safety).
 */
export function getClientOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "https://pakshipper.com";
}

/**
 * Builds an absolute product detail URL for the current tenant.
 * Use this in WhatsApp buttons, share links, social media shares, etc.
 */
export function getProductUrl(slug: string): string {
  return `${getClientOrigin()}/product-detail/${slug}`;
}

/**
 * Returns the current page's full URL.
 * Prefer this over hardcoded domain strings.
 */
export function getCurrentPageUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.href;
  }
  return getClientOrigin();
}

// ── Server-side helper (for use in generateMetadata / server components) ───

/**
 * Derives the origin from the incoming request's Host header.
 * Call this inside `generateMetadata`, `getServerSideProps`, or server components.
 *
 * @param hostHeader - The raw `host` header value (e.g. "alrehman.pakshipper.com" or "localhost:3001")
 * @returns Full origin string like "https://alrehman.pakshipper.com"
 */
export function getServerOrigin(hostHeader: string): string {
  const cleanHost = hostHeader.split(":")[0].toLowerCase();

  // Local development: resolve to the configured dev host or default
  if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
    const devHost = process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "sandbox.localhost";
    return `http://${devHost}`;
  }

  // Production: always HTTPS
  return `https://${cleanHost}`;
}
