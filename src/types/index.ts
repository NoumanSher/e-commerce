import { Product } from "@/components/productDetail/productDetailDto";

// ─── Cart & Order ────────────────────────────────────────────────────────────

export interface ProductDetailData {
  productName?: string;
  items: OrderItem[];
  deliveryFee: number;
  totalPrice: number;
  subTotal: number;
}

/** A single line-item within an order payload. */
export interface OrderItem {
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

export interface CreateOrderPayload extends ProductDetailData {
  address: OrderAddress;
  paymentMethod: string;
  userId: string;
}

// ─── Order Response ───────────────────────────────────────────────────────────

export interface OrderAddress {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
}

export interface OrderStatusHistory {
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | string;
  statusDesc: string;
  updatedAt: string;
}

export interface OrderResponseData {
  _id: string;
  orderNo: string;
  totalPrice: number;
  paymentMethod: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | string;
  orderStatuses?: OrderStatusHistory[];
  address: OrderAddress;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: OrderResponseData;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  username: string;
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export interface Review {
  _id: string;
  userId: User;
  productId: string;
  rating: number;
  description: string;
  status: "approved" | "pending" | "rejected";
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  helpfulBy: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ReviewsPagination {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ReviewsStats {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: ReviewsPagination;
  stats: ReviewsStats;
  canReview: boolean;
  isReviewed: boolean;
}

export interface MarkHelpfulResponse {
  message: string;
  helpfulCount: number;
  helpfulBy: string[];
}

export interface CreateReviewPayload {
  userId: string;
  productId: string;
  rating: string;
  description: string;
  images: string[];
}

export type SortOption = "recent" | "oldest" | "highest" | "lowest" | "helpful";
