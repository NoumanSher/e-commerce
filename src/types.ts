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


export interface User {
  _id: string;
  username: string;
}

export interface Review {
  _id: string;
  userId: User;
  productId: string;
  rating: number;
  description: string;
  status: 'approved' | 'pending' | 'rejected';
  isVerifiedPurchase: boolean;
  helpfulCount: number;
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
}

export interface CreateReviewPayload {
  userId: string;
  productId: string;
  rating: string;
  description: string;
}

export type SortOption = 'recent' | 'oldest' | 'highest' | 'lowest' | 'helpful';