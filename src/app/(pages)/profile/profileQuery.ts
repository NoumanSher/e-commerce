import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/orderService'
import { queryKeys } from '@/lib/queryKeys'
import { STALE_TIMES, CACHE_TIMES } from '@/lib/queryClient'

export const useGetOrdersByUserId = (userId: string) => {
  return useQuery({
    queryKey: [...queryKeys.orders.lists(), userId],
    queryFn: () =>
      userId ? orderService.getOrdersByUserId(userId) : Promise.reject(new Error('No user ID provided')),
    staleTime: STALE_TIMES.short, // 30 seconds
    gcTime: CACHE_TIMES.medium, // 30 minutes
    enabled: Boolean(userId),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
}

export const useGetProfileDetailByUserId = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user.detail(userId),
    queryFn: () =>
      userId ? orderService.getUserAddress(userId) : Promise.reject(new Error('No user ID provided')),
    staleTime: STALE_TIMES.long, // 10 minutes
    gcTime: CACHE_TIMES.medium,
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
}

export const useGetOrderDetailByOrderNumber = (orderNumber: string) => {
  const queryResult = useQuery({
    queryKey: queryKeys.orders.detail(orderNumber),
    queryFn: () =>
      orderNumber
        ? orderService.getSingleOrder(orderNumber)
        : Promise.reject(new Error('No order number provided')),
    staleTime: STALE_TIMES.short,
    gcTime: CACHE_TIMES.medium,
    enabled: Boolean(orderNumber),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  const isSettled = ["Delivered", "Cancelled"].includes(queryResult.data?.data?.status || "");

  // Dynamically set refetch interval based on settlement status
  Object.assign(queryResult, {
    refetchInterval: isSettled ? false : 60 * 1000
  });

  return queryResult;
}
