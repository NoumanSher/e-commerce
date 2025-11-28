/**
 * Centralized React Query client configuration.
 * Provides a consistent QueryClient setup for both server and client.
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * Default stale times by data type.
 * These define how long data is considered "fresh" before refetching.
 */
export const STALE_TIMES = {
  // Real-time or frequently changing data
  realtime: 0, // always stale
  veryShort: 10 * 1000, // 10 seconds
  short: 30 * 1000, // 30 seconds

  // Standard data (products, categories, etc.)
  default: 60 * 1000, // 1 minute
  medium: 2 * 60 * 1000, // 2 minutes
  long: 10 * 60 * 1000, // 10 minutes

  // Rarely changing data (settings, config)
  infinite: Infinity, // never stale
}

/**
 * Default cache times (gcTime = garbage collection time, formerly cacheTime).
 * Defines how long data persists in memory after being unused.
 */
export const CACHE_TIMES = {
  veryShort: 30 * 1000, // 30 seconds
  short: 60 * 1000, // 1 minute
  default: 5 * 60 * 1000, // 5 minutes
  medium: 30 * 60 * 1000, // 30 minutes
  long: 60 * 60 * 1000, // 1 hour
  veryLong: 2 * 60 * 60 * 1000, // 2 hours
  infinite: Infinity,
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is fresh for 1 minute by default
        staleTime: STALE_TIMES.default,
        // Keep unused data in memory for 5 minutes
        gcTime: CACHE_TIMES.default,
        // Don't refetch on window focus by default
        refetchOnWindowFocus: false,
        // Don't refetch on mount if data is fresh
        refetchOnMount: false,
        // Retry failed requests 3 times
        retry: 3,
        // Wait 1s before first retry, exponential backoff after
        retryDelay: (attemptIndex) =>
          Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Retry mutations 1 time on failure
        retry: 1,
      },
    },
  })
}

export function createServerQueryClient(): QueryClient {
  return createQueryClient()
}
