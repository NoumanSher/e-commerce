import { useQuery } from "@tanstack/react-query";
import { orderConfirmation } from "../api/orderConfirmationApi";

export const useGetOrderDetailByorderNumber = (orderNumber: string) => {
  return useQuery({
    queryKey: ["orderDetailByOrderNumber", orderNumber],
    queryFn: () => orderConfirmation(orderNumber),
    staleTime: Infinity,
    enabled: !!orderNumber,
    // refetchOnWindowFocus: true,
  });
};
