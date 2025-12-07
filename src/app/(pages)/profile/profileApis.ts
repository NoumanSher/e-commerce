import { get } from '@/lib/apiClient'
import { OrderResponse, OrderResponseByOrderNumber, AddressResponse } from './profileDtos'

const getUserDetailById = async (userId: string): Promise<AddressResponse> => {
  const url = `/order/userAdress/${userId}`
  return get<AddressResponse>(url)
}

const getOrdersDetailByUserId = async (userId: string): Promise<OrderResponse> => {
  const url = `/order/user-all-orders/${userId}`
  return get<OrderResponse>(url)
}

const getOrderDeatilsByOrderNumber = async (
  orderNumber: string
): Promise<OrderResponseByOrderNumber> => {
  const url = `/order/user-single-order/${orderNumber}`
  return get<OrderResponseByOrderNumber>(url)
}

export { getUserDetailById, getOrderDeatilsByOrderNumber, getOrdersDetailByUserId }
