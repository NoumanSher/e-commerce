import { useQuery } from "@tanstack/react-query";
import { orderConfirmation } from "../api/orderConfirmationApi";
import { queryKeys } from "@/lib/queryKeys";
import { STALE_TIMES } from "@/lib/queryClient";

export const useGetOrderDetailByorderNumber = (orderNumber: string) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderNumber),
    queryFn: () => orderConfirmation(orderNumber),
    staleTime: STALE_TIMES.infinite, // Order details don't change after creation
    enabled: !!orderNumber,
  });
};
