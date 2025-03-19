import { ProductDetailData as createOrderDto } from "@/types";
interface Address {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  zipCode: string; // Stored as string to preserve leading zeros
  phone: string;
  email: string;
}

export interface OrderDto extends createOrderDto {
  userId: string;
  paymentMethod: "cash" | "card" | "online"; // Enumerate possible payment methods
  deliveryFee: number;
  totalPrice: number;
  subTotal: number;
  addressId?: string; // Optional as it's commented in your example
  address: Address;
  isSaved: boolean;
}

export interface OrderResponse {
  message: string;
  data: OrderData;
}

interface OrderData {
  orderId: string;
  user: User;
  items: OrderItem[];
  orderDetails: OrderDetails;
  address: AddressInResponse;
  orderNo: string;
  orderStatus: string;
  formattedDate: string;
}

interface User {
  userId: string;
  username: string;
  email: string;
  phone: string;
}

interface OrderItem {
  productId: string;
  product: string;
  variant: ProductVariant;
  price: number;
  quantity: number;
  lineTotal: number;
}

interface ProductVariant {
  name: string;
  additionalCostPrice: number;
  additionalSalePrice: number;
  stock: number;
  _id: string;
}

interface OrderDetails {
  totalPrice: number;
  subTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryFee: number;
}

interface AddressInResponse extends Address {
  _id: string;

  isFirst: boolean;
}
