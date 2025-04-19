export interface OrderResponse {
  message: string;
  data: Order[];
}
export interface OrderResponseByOrderNumber {
  message: string;
  data: Order;
}


export interface Order {
  orderId: string;
  user: User;
  items: OrderItem[];
  totalPrice: number;
  subTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryFee: number;
  address: Address;
  orderNo: string;
  orderStatus: string;
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

interface Address {
  _id: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  isFirst: boolean;
}