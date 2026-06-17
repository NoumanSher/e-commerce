/**
 * serverApiClient.ts  —  SERVER ONLY
 *
 * Axios factory for Next.js Server Components / Route Handlers.
 *
 * Accepts the tenant `host` as an explicit parameter rather than calling
 * `next/headers` internally. This is intentional — `next/headers` must be
 * called in the Server Component scope (request context), NOT inside
 * `unstable_cache` callbacks where request context is unavailable.
 *
 * Usage:
 *   // In a Server Component (has request context):
 *   const host = headers().get('host') ?? '';
 *   const data = await serverGet('/settings', host);
 *
 * Never import this from Client Components.
 */

import axios, { type AxiosInstance } from "axios";
import { BASE_URL_LIVE } from "@/config/env";

/**
 * Creates a per-request Axios instance that forwards the tenant host
 * as the `Origin` header so the backend's `tenantResolver` can identify
 * which store's database to query.
 *
 * @param host  The incoming request's host (e.g. "watches.pakshipper.com").
 *              Read from `headers().get('host')` in the calling Server Component.
 */
export function createServerApiClient(host: string): AxiosInstance {
  const proto =
    process.env.NODE_ENV === "production" ? "https" : "http";
  const origin = host ? `${proto}://${host}` : "";

  const instance = axios.create({
    baseURL: BASE_URL_LIVE,
    headers: {
      "Content-Type": "application/json",
      // Forward tenant domain so tenantResolver identifies the correct store.
      ...(origin ? { Origin: origin } : {}),
    },
    // Keep timeout short for SSR — a hung backend should not block the page render.
    timeout: 8_000,
  });

  // Strip the massive raw Node.js socket/buffer internals from Axios errors
  // so console.error() produces a clean, readable message instead of 500+ lines.
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const clean = {
        message: error.message || "Unknown error",
        statusCode: error.response?.status,
        response: error.response?.data,
      };
      return Promise.reject(clean);
    }
  );

  return instance;
}

// ─── Typed helpers ────────────────────────────────────────────────────────────

type AxiosConfig = import("axios").AxiosRequestConfig;

export const serverGet = <T = unknown>(
  url: string,
  host: string,
  params?: Record<string, unknown>,
  config?: AxiosConfig
): Promise<T> => {
  const client = createServerApiClient(host);
  return client.get<T>(url, { params, ...config }).then((r) => r.data);
};

export const serverPost = <T = unknown>(
  url: string,
  host: string,
  body?: unknown,
  config?: AxiosConfig
): Promise<T> => {
  const client = createServerApiClient(host);
  return client.post<T>(url, body, config).then((r) => r.data);
};
