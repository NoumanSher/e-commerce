import { useQuery } from '@tanstack/react-query'
import {
  getUserDetailById,
  getOrderDeatilsByOrderNumber,
  getOrdersDetailByUserId,
} from './profileApis'
import { queryKeys } from '@/lib/queryKeys'
import { STALE_TIMES, CACHE_TIMES } from '@/lib/queryClient'

export const useGetOrdersByUserId = (userId: string) => {
  return useQuery({
    queryKey: [...queryKeys.orders.lists(), userId],
    queryFn: () =>
      userId ? getOrdersDetailByUserId(userId) : Promise.reject(new Error('No user ID provided')),
    staleTime: STALE_TIMES.short, // 30 seconds
    gcTime: CACHE_TIMES.medium, // 30 minutes
    enabled: Boolean(userId),
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

export const useGetProfileDetailByUserId = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user.detail(userId),
    queryFn: () =>
      userId ? getUserDetailById(userId) : Promise.reject(new Error('No user ID provided')),
    staleTime: STALE_TIMES.short,
    gcTime: CACHE_TIMES.medium,
    enabled: Boolean(userId),
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

export const useGetOrderDetailByOrderNumber = (orderNumber: string) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderNumber),
    queryFn: () =>
      orderNumber
        ? getOrderDeatilsByOrderNumber(orderNumber)
        : Promise.reject(new Error('No order number provided')),
    staleTime: STALE_TIMES.short,
    gcTime: CACHE_TIMES.medium,
    enabled: Boolean(orderNumber),
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  })
}
