// src/hooks/useInvalidateProductQueries.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/Context/storeContext";
import { useCart } from "@/components/hooks/useCart";

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

    const ids = new Set<string>();

    if (section === "checkout" && productDetail?.items[0]?.productId) {
      ids.add(productDetail.items[0].productId);
    } else {
      cartItems.forEach((item) => {
        if (item.product._id) ids.add(item.product._id);
      });
    }

    ids.forEach((id) =>
      queryClient.invalidateQueries({ queryKey: ["product", id] })
    );

    if (section !== "checkout") clearCart();

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
