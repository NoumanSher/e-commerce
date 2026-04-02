import { get, post } from "@/lib/apiClient";
import type { OrderResponse, CreateOrderPayload } from "@/types";

export const orderService = {
  getUserAddress: (userId: string): Promise<unknown> =>
    get(`/order/userAddress/${userId}`), // Fixed typo: was "/userAdress/"

  getSingleOrder: (orderNumber: string): Promise<OrderResponse> =>
    get<OrderResponse>(`/order/user-single-order/${orderNumber}`),

  createOrder: (payload: CreateOrderPayload): Promise<OrderResponse> =>
    post<OrderResponse>("/order", payload),

  getOrdersByUserId: (userId: string): Promise<unknown> =>
    get(`/order/user-all-orders/${userId}`),
};
