import { post } from '@/lib/apiClient'
import { OrderDto, OrderResponse } from '../dto/orderCreateDto'

const OrderCreate = (values: OrderDto): Promise<OrderResponse> => {
  // use centralized api client; it will use BASE_URL from `src/constants.ts`
  return post<OrderResponse>('/order/create-order', values)
}

export { OrderCreate }
