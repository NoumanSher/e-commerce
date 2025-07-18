import { useQuery } from "@tanstack/react-query";
import { getUserDetailById,getOrderDeatilsByOrderNumber,getOrdersDetailByUserId } from "./profileApis";

export const useGetOrdersByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["ordersDetails", userId],
    queryFn: () => userId ? getOrdersDetailByUserId(userId) : Promise.reject(new Error("No user ID provided")),
    staleTime: 30 * 1000, // 30 seconds - data becomes stale quickly for order status
    gcTime: 10 * 60 * 1000, // 10 minutes - keeps recent data available but not too long
    enabled: Boolean(userId),
    refetchInterval: 60 * 1000, // Optional: auto-refresh every minute
    refetchOnWindowFocus: true // Optional: refresh when user returns to tab
  });
};
export const useGetProfileDetailByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["profileDetails", userId],
    queryFn: () => userId ? getUserDetailById(userId) : Promise.reject(new Error("No user ID provided")),
    staleTime: 30 * 1000, // 30 seconds - data becomes stale quickly for order status
    gcTime: 10 * 60 * 1000, // 10 minutes - keeps recent data available but not too long
    enabled: Boolean(userId),
    refetchInterval: 60 * 1000, // Optional: auto-refresh every minute
    refetchOnWindowFocus: true // Optional: refresh when user returns to tab
  });
};

export const useGetOrderDetailByOrderNumber = (orderNumber: string) => {
  return useQuery({
    queryKey: ["OrderDetails", orderNumber],
    queryFn: () => orderNumber ? getOrderDeatilsByOrderNumber(orderNumber) : Promise.reject(new Error("No user ID provided")),
    staleTime: 30 * 1000, // 30 seconds - data becomes stale quickly for order status
    gcTime: 10 * 60 * 1000, // 10 minutes - keeps recent data available but not too long
    enabled: Boolean(orderNumber),
    refetchInterval: 60 * 1000, // Optional: auto-refresh every minute
    refetchOnWindowFocus: true // Optional: refresh when user returns to tab
  });
};
