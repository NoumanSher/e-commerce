import { useQuery } from "@tanstack/react-query";
import { categoryService, CategoriesResponse } from "@/services/categoryService";
import { queryKeys } from '@/lib/queryKeys'
import { STALE_TIMES, CACHE_TIMES } from '@/lib/queryClient'
export const useCategories = () => {
  return useQuery<CategoriesResponse, Error>({
    queryKey: queryKeys.categories.allPC(),
    queryFn: () => categoryService.fetchCategories(),
    staleTime: STALE_TIMES.infinite, // Never stale
    gcTime: CACHE_TIMES.infinite, // Cache indefinitely
  });
};

