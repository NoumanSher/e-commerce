export interface ProductDetailData {
  productName?: string;
  userId: string;
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
