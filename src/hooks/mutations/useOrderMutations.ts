import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import type { CreateOrderPayload, OrderResponse } from "@/types";
import { toast } from "react-toastify";
import type { ApiError } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";

export const useSubmitOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, ApiError, CreateOrderPayload>({
    mutationFn: orderService.createOrder,
    onSuccess: (data) => {
      toast.success("Order created successfully!");
      // Invalidate relevant queries like order history and user profile
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all() });
    },
    onError: (error: ApiError) => {
      const message = error.message || "Failed to submit order. Please try again.";
      toast.error(message);
      console.error("Order submission failed:", error);
    },
  });
};
