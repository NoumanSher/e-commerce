import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import type { CreateOrderPayload, OrderResponse } from "@/types";
import { toast } from "react-toastify";
import type { ApiError } from "@/lib/apiClient";

export const useSubmitOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, ApiError, CreateOrderPayload>({
    mutationFn: orderService.createOrder,
    onSuccess: (data) => {
      // Invalidate relevant queries like order history and user profile
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // We don't toast here usually if the component handles routing visually,
      // but if we want a global success:
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit order. Please try again.");
      console.error("Order submission failed:", error);
    },
  });
};
