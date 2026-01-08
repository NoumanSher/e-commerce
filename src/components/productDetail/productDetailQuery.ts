import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/productsService";
import { queryKeys } from "@/lib/queryKeys";
import { STALE_TIMES, CACHE_TIMES } from "@/lib/queryClient";

export const useGetProductDetailBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => productsService.getProductBySlug(slug),
    staleTime: STALE_TIMES.medium, // 2 minutes fresh
    gcTime: CACHE_TIMES.long, // 1 hour in cache
    enabled: !!slug,
  });
};

export const useGetRelatedProductsByCategoryId = (categoryId: string) => {
  return useQuery({
    queryKey: queryKeys.products.relatedByCategory(categoryId),
    queryFn: () => productsService.relatedProductsByCategoryId(categoryId),
    staleTime: STALE_TIMES.long, // 10 minutes fresh
    gcTime: CACHE_TIMES.veryLong, // 2 hours in cache
    enabled: !!categoryId,
  });
};
