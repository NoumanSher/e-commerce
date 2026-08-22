/**
 * productsService.server.ts
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
import type { Product } from "@/components/productDetail/productDetailDto";
import type { ParentCategoriesResponse } from "@/services/productsService";

/**
 * Fetch all categories for the current tenant.
 * Wrapped with React cache() to deduplicate multiple calls with the same host within a single request.
 *
 * @param host  Value of headers().get('host') from the calling Server Component.
 */
export const fetchAllCategoriesServer = cache(async (
  host: string
): Promise<ParentCategoriesResponse> => {
  return serverGet<ParentCategoriesResponse>("/categories/all", host);
});

/**
 * Fetch a product by its URL slug for the current tenant.
 * Wrapped with React cache() to deduplicate multiple calls with the same slug/host within a single request.
 *
 * @param slug  The product slug.
 * @param host  Value of headers().get('host') from the calling Server Component.
 */
export const getProductBySlugServer = cache(async (
  slug: string,
  host: string
): Promise<Product | null> => {
  try {
    const response = await serverGet<{ data: Product }>(
      `/products/get-product-by-slug/${slug}`,
      host
    );
    return response.data;
  } catch (error) {
    console.error(`[SSR] Error fetching product by slug ${slug}:`, (error as any)?.message || error);
    return null;
  }
});

