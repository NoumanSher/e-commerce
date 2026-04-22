import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/productsService";
import { queryKeys } from "@/lib/queryKeys";
import { STALE_TIMES, CACHE_TIMES } from "@/lib/queryClient";
import type { Product } from "./productDetailDto";

export const useGetProductDetailBySlug = (slug: string, initialData?: Product) => {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => productsService.getProductBySlug(slug),
    staleTime: STALE_TIMES.medium, // 2 minutes fresh
    gcTime: CACHE_TIMES.long, // 1 hour in cache
    enabled: !!slug,
    initialData,
  });
};

export const useGetRelatedProductsByCategoryId = (categoryId: string) => {
  return useQuery({
    queryKey: queryKeys.products.relatedByCategory(categoryId),
    queryFn: () => productsService.relatedProductsByCategorySlug(categoryId),
    staleTime: STALE_TIMES.long, // 10 minutes fresh
    gcTime: CACHE_TIMES.veryLong, // 2 hours in cache
    enabled: !!categoryId,
  });
};

export const useGetRecommendedProducts = () => {
  return useQuery({
    queryKey: [...queryKeys.products.all(), "recommended"],
    queryFn: () => productsService.getRecommendedProducts(),
    staleTime: STALE_TIMES.long,
    gcTime: CACHE_TIMES.veryLong,
  });
};
