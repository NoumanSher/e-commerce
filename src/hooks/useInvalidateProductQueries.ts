// src/hooks/useInvalidateProductQueries.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/context/storeContext";
import { useCart } from "@/components/hooks/useCart";
import { queryKeys } from "@/lib/queryKeys";

export const useInvalidateProductQueries = (
  isSuccess: boolean,
  section: string | null,
  orderNo: string | undefined,
  checkValidation: () => void
) => {
  const { clearCart } = useCart();

  const { productDetail, cartItems, setOrderNumber } = useStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSuccess) return;

    // Invalidate ALL product queries (details, lists, related) so stock
    // is refreshed everywhere without a manual reload.
    queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });

    // Invalidate user profile queries so the address saved during order
    // creation is reflected on the profile page immediately.
    queryClient.invalidateQueries({ queryKey: queryKeys.user.all() });

    if (section !== "checkout") {
      if (isSuccess) {
        setTimeout(() => clearCart(), 3000);
      }
    }

    if (orderNo) setOrderNumber(orderNo);
    checkValidation();
  }, [
    isSuccess,
    productDetail,
    cartItems,
    queryClient,
    section,
    clearCart,
    setOrderNumber,
    orderNo,
    checkValidation,
  ]);
};

