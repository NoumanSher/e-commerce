export interface OrderResponse {
  message: string;
  data: Order[];
}
export interface OrderResponseByOrderNumber {
  message: string;
  data: Order;
}

interface orderStatus {
  status: string;
  statusDesc: string;
  createdAt: string;
  _id: string;
}

interface OrderDetails {
  totalPrice: number;
  subTotal: number;
  paymentMethod: 'cash' | 'card' | 'digital wallet' | string; // Union type with string fallback
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded' | string; // Common statuses
  deliveryFee: number;
}


export interface Order {
  orderId: string;
  user: User;
  items: OrderItem[];
  orderDetails: OrderDetails;
  subTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryFee: number;
  address: Address;
  orderNo: string;
  orderStatuses: orderStatus[];
  createdAt: string;
}

interface User {
  username: string;
  email: string;
  phone: string;
}

interface OrderItem {
  productId: string;
  product: string;
  variant: Variant;
  price: number;
  quantity: number;
  lineTotal: number;
}

interface Variant {
  name: string;
  additionalCostPrice: number;
  additionalSalePrice: number;
  stock: number;
  _id: string;
}

export interface Address {
  _id: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  zipCode?: string;
  phone: string;
  email: string;
  isFirst: boolean;
}

export interface AddressResponse {
    message: string;
    address: Address;
}