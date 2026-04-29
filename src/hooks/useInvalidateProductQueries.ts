// src/hooks/useInvalidateProductQueries.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/hooks/useCart";
import { queryKeys } from "@/lib/queryKeys";

export const useInvalidateProductQueries = (
  isSuccess: boolean,
  section: string | null,
  orderNo: string | undefined,
  checkValidation: () => void
) => {
  const { clearCart, setOrderNumber } = useCart();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSuccess) return;

    // Invalidate ALL product queries (details, lists, related) so stock
    // is refreshed everywhere without a manual reload.
    queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });

    // Invalidate user profile queries so the address saved during order
    // creation is reflected on the profile page immediately.
    queryClient.invalidateQueries({ queryKey: queryKeys.user.all() });

    // Invalidate first order discount to prevent reuse on next immediate order
    queryClient.invalidateQueries({ queryKey: ["firstOrderDiscount"] });

    if (section !== "checkout") {
      setTimeout(() => clearCart(), 3000);
    }

    if (orderNo) setOrderNumber(orderNo);
    checkValidation();
  }, [
    isSuccess,
    queryClient,
    section,
    clearCart,
    setOrderNumber,
    orderNo,
    checkValidation,
  ]);
};
