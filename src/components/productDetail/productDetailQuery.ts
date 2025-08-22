import { useQuery } from "@tanstack/react-query";
import { relatedProductsByCategoryId } from "./productDetailApi";
import { getProductData } from "@/lib/api/getProductData";
export const useGetProductDetailById = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductData(productId),
    staleTime: 1000 * 60 * 2, // 2 minutes fresh (product details don't change often)
    gcTime: 1000 * 60 * 60, // 1 hour in cache (users often revisit product pages)
    refetchOnMount: "always", // Explicitly ensure fresh data when component mounts
    enabled: !!productId,
  });
};

export const useGetRelatedProductsByCategoryId = (categoryId: string) => {
  return useQuery({
    queryKey: ["relatedProducts", categoryId],
    queryFn: () => relatedProductsByCategoryId(categoryId),
    staleTime: 1000 * 60 * 10, // 10 minutes fresh (category products change less frequently)
    gcTime: 1000 * 60 * 60 * 2, // 2 hours in cache (category pages are common entry points)
    refetchOnMount: "always", // Consistent with product detail behavior
    enabled: !!categoryId,
  });
};
