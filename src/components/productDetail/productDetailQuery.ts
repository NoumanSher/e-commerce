import { useQuery } from "@tanstack/react-query";
import {
  productDetailById,
  relatedProductsByCategoryId,
} from "./productDetailApi";

export const useGetProductDetailById = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => productDetailById(productId),
    staleTime: Infinity,
    refetchOnMount: true,
    enabled: !!productId,
  });
};
export const useGetRelatedProductsByCategoryId = (categoryId: string) => {
  return useQuery({
    queryKey: ["relatedProducts", categoryId],
    queryFn: () => relatedProductsByCategoryId(categoryId),
    refetchOnMount: true,
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 min (data is fresh)
    gcTime: 1000 * 60 * 30, // 30 min in cache
  });
};
