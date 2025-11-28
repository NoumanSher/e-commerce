import { useQuery } from "@tanstack/react-query";
import { fetchCategories, CategoriesResponse } from "@/services/categoryService";
import { queryKeys } from '@/lib/queryKeys'
import { STALE_TIMES, CACHE_TIMES } from '@/lib/queryClient'
export const useCategories = () => {
  return useQuery<CategoriesResponse, Error>({
    queryKey: queryKeys.categories.all(),
       queryFn: fetchCategories,
       staleTime: STALE_TIMES.infinite, // Never stale
       gcTime: CACHE_TIMES.infinite, // Cache indefinitely
  });
};

