/**
 * Products Query Hooks
 * Standardized React Query patterns with centralized config.
 */

import { useQuery } from "@tanstack/react-query";
import { productsService, type ProductFilters } from "@/services/productsService";
import { queryKeys } from "@/lib/queryKeys";
import { STALE_TIMES, CACHE_TIMES } from "@/lib/queryClient";

/**
 * Fetch paginated products with optional filters.
 * @example
 *   const { data, isLoading, error } = useProductsQuery({ categorySlug: 'shoes', page: 1 })
 */
export function useProductsQuery(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productsService.fetchProducts(filters),
    staleTime: STALE_TIMES.medium,
    gcTime: CACHE_TIMES.medium,
  });
}

/**
 * Fetch all parent categories with their child categories.
 * Uses a single unified cache key ["categories"] shared across the entire app.
 * Previously split between allPC() and all() — now merged to fix child-category reload bug.
 */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: () => productsService.fetchAllCategories(),
    staleTime: STALE_TIMES.infinite,
    gcTime: CACHE_TIMES.infinite,
  });
}

/**
 * Fetch products with infinite scroll support.
 * Used for category and shop pages.
 */
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteProductsQuery(
  parentSlug: string | null,
  childSlug: string | null,
  options?: { enabled?: boolean }
) {
  return useInfiniteQuery({
    queryKey: ["products", { parent: parentSlug, child: childSlug }],
    queryFn: ({ pageParam = 1 }) =>
      productsService.fetchProducts({
        categorySlug: parentSlug ?? undefined,
        childCategorySlug: childSlug ?? undefined,
        page: pageParam as number,
        limit: 10,
        mode: "client",
      }),
    initialPageParam: 1,
    placeholderData: (prev) => prev,
    getNextPageParam: (lastPage) => {
      const current = lastPage?.pagination?.currentPage;
      const total = lastPage?.pagination?.totalPages;
      return current != null && total != null && current < total
        ? current + 1
        : undefined;
    },
    enabled: options?.enabled,
    staleTime: STALE_TIMES.medium,
    gcTime: CACHE_TIMES.medium,
  });
}
