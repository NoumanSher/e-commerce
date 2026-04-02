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
 * Fetch all available categories.
 * Cached indefinitely since categories rarely change.
 */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: () => productsService.fetchAllCategories(),
    staleTime: STALE_TIMES.infinite,
    gcTime: CACHE_TIMES.infinite,
  });
}
