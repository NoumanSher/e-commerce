import { get, post } from "@/lib/apiClient";
import type {
  OrderResponse,
  CreateOrderPayload,
  UserAddressResponse,
  OrdersListResponse,
} from "@/types";

export const orderService = {
  getUserAddress: (userId: string): Promise<UserAddressResponse> =>
    get<UserAddressResponse>(`/order/userAddress/${userId}`),

  getSingleOrder: (orderNumber: string): Promise<OrderResponse> =>
    get<OrderResponse>(`/order/user-single-order/${orderNumber}`),

  createOrder: (payload: CreateOrderPayload): Promise<OrderResponse> =>
    post<OrderResponse>("/order/create-order", payload),

  getOrdersByUserId: (userId: string): Promise<OrdersListResponse> =>
    get<OrdersListResponse>(`/order/user-all-orders/${userId}`),
};

