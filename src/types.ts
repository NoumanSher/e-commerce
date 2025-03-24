import { Product } from "@/components/productDetail/productDetailDto";

export interface ProductDetailData {
  productName?: string;
  items: item[];
  deliveryFee: number;
  totalPrice: number;
  subTotal: number;
}

interface item {
  productId: string;
  quantity: number;
  variantId?: string;
  price: number;
  lineTotal: number;
}

 export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
  variantID?: string;
}