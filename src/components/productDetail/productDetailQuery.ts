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




export const useGetProductRelatedInfo = (params: {
  parentCategorySlug?: string;
  childCategorySlug?: string;
  categoryId?: string;
  productId?: string;
}) => {
  return useQuery({
    queryKey: [
      ...queryKeys.products.relatedByCategory(params.parentCategorySlug || ""),
      "unified",
      params.childCategorySlug,
      params.categoryId,
      params.productId,
    ].filter(Boolean),
    queryFn: () => productsService.getProductRelatedInfo(params),
    staleTime: STALE_TIMES.long,
    gcTime: CACHE_TIMES.veryLong,
    enabled: !!(params.parentCategorySlug || params.categoryId),
  });
};
