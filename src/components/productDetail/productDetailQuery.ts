import { useQuery } from "@tanstack/react-query";
import { productDetailById } from "./productDetailApi";

export const useGetProductDetailById = (productId:string) => {
  return useQuery({
    queryKey: ["productId", productId],
    queryFn: () => productDetailById(productId),
    staleTime: Infinity,
    enabled: !!productId,
    // refetchOnWindowFocus: true,
  });
};
