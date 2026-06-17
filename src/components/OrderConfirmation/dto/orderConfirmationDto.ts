interface Variant {
  name: string;
  additionalCostPrice: number;
  additionalSalePrice: number;
  stock: number;
  _id: string;
}

interface Item {
  productId: string;
  product: string;
  variant: Variant;
  price: number;
  quantity: number;
  lineTotal: number;
}

interface User {
  username: string;
  email: string;
  phone: string;
}

interface Address {
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

interface OrderData {
  orderId: string;
  user: User;
  items: Item[];
  subTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryFee: number;
  address: Address;
  orderDetails: {
    totalPrice: number;
    subTotal: number;
    paymentMethod: string;
    paymentStatus: string;
    deliveryFee: number;
    discountAmount: number;
    discountType: string | null;
  };
  total: number;
  discountAmount: number;
  orderNo: string;
  orderStatus: string;
  createdAt: string;
}

export interface OrderResponse {
  message: string;
  data: OrderData;
}
