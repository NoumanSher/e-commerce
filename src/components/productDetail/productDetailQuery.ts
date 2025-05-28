import { useQuery } from "@tanstack/react-query";
import { productDetailById } from "./productDetailApi";

export const useGetProductDetailById = (productId:string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => productDetailById(productId),
    staleTime: Infinity,
    refetchOnMount: true,
    enabled: !!productId,
  });
};
