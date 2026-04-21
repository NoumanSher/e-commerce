import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { OrderCreate } from "../api/orderCreateApi";
import { queryKeys } from "@/lib/queryKeys";

interface ApiError {
  message: string;
  statusCode?: number;
  response?: any;
}

export const useOrderCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: OrderCreate,
    onSuccess: (data) => {
      toast.success("Order created successfully!");
      // invalidate orders list so user's orders refresh
      qc.invalidateQueries({ queryKey: queryKeys.orders.all() });
      qc.invalidateQueries({ queryKey: queryKeys.user.all() });
    },
    onError: (error: ApiError) => {
      const message = error?.response?.message || error?.message || "Failed to create order";
      toast.error(message);
    },
  });
};
