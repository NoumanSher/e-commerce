/**
 * Products Query Hooks
 * Demonstrates standardized React Query patterns with centralized config.
 */

import { useQuery } from '@tanstack/react-query'
import { productsService } from '@/services/productsService'
import { queryKeys } from '@/lib/queryKeys'
import { STALE_TIMES, CACHE_TIMES } from '@/lib/queryClient'

/**
 * Fetch paginated products with optional filters.
 * @example
 *   const { data, isLoading, error } = useProductsQuery({
 *     categoryId: 'cat-1',
 *     page: 1,
 *     limit: 12
 *   })
 */
export function useProductsQuery(
  filters?: {
    categoryId?: string
    childCategoryID?: string
    page?: number
    limit?: number
    mode?: string
  }
) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () =>
      productsService.fetchProducts(
        filters?.categoryId,
        filters?.childCategoryID,
        filters?.page ?? 1,
        filters?.limit ?? 8,
        filters?.mode
      ),
    staleTime: STALE_TIMES.medium, // Products fresh for 2 minutes
    gcTime: CACHE_TIMES.medium, // Keep in cache for 30 minutes
    enabled: true, // Can be disabled based on conditions
  })
}

/**
 * Fetch all available categories.
 * Cached indefinitely since categories rarely change.
 */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: () => productsService.fetchAllCategories(),
    staleTime: STALE_TIMES.infinite, // Never stale
    gcTime: CACHE_TIMES.infinite, // Cache indefinitely
  })
}
