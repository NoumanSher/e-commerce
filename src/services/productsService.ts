import { get, post } from "@/lib/apiClient";
import type { Product } from "@/components/productDetail/productDetailDto";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Pagination {
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ProductsResponse {
  message: string;
  data: Product[];
  pagination: Pagination;
}

export interface RelatedProductsResponse extends Omit<ProductsResponse, "pagination"> {}

export interface ProductFilters {
  categorySlug?: string;
  childCategorySlug?: string;
  page?: number;
  limit?: number;
  mode?: string;
}

export interface ChildCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  parentCategory: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  children?: ChildCategory[];
}

export interface ParentCategoriesResponse {
  message: string;
  categories: Category[];
}

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * Fetch paginated products with optional category/child-category filters.
 */
const fetchProducts = ({
  categorySlug,
  childCategorySlug,
  page = 1,
  limit = 8,
  mode = "full",
}: ProductFilters = {}): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  if (childCategorySlug) params.set("childCategorySlug", childCategorySlug);
  if (categorySlug) params.set("parentCategorySlug", categorySlug);
  params.set("page", String(page));
  params.set("limit", String(limit));
  params.set("mode", mode);
  return get<ProductsResponse>(`/products/get-all-products?${params}`);
};

/**
 * Fetch related products by parent category slug.
 */
const relatedProductsByCategorySlug = (
  slug: string
): Promise<RelatedProductsResponse> =>
  get<RelatedProductsResponse>(
    `/products/get-products-by-category-priority?parentCategorySlug=${slug}`
  );

/**
 * Fetch all parent categories with their children.
 * Client-side: browser sends Origin automatically.
 */
const fetchAllCategories = (): Promise<ParentCategoriesResponse> =>
  get<ParentCategoriesResponse>("/categories/all");

/**
 * Get a single product by its URL slug.
 */
const getProductBySlug = (slug: string): Promise<Product> =>
  get<{ data: Product }>(`/products/get-product-by-slug/${slug}`).then(
    (r) => r.data
  );

/**
 * Fetch recommended products.
 */
const getRecommendedProducts = (categoryId?: string): Promise<RelatedProductsResponse> => {
  const query = categoryId ? `?categoryId=${categoryId}` : '';
  return get<RelatedProductsResponse>(`/products/get-recommended-products${query}`);
};

/**
 * Fetch both related and recommended products in one call.
 */
const getProductRelatedInfo = (params: {
  parentCategorySlug?: string;
  childCategorySlug?: string;
  categoryId?: string;
  productId?: string;
}): Promise<{
  data: {
    related: Product[];
    recommended: Product[];
  };
}> => {
  const query = new URLSearchParams();
  if (params.parentCategorySlug) query.set("parentCategorySlug", params.parentCategorySlug);
  if (params.childCategorySlug) query.set("childCategorySlug", params.childCategorySlug);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.productId) query.set("productId", params.productId);
  
  return get<{
    data: {
      related: Product[];
      recommended: Product[];
    };
  }>(`/products/get-product-related-info?${query}`);
};


/**
 * Upload multiple images. Uses apiClient so the auth interceptor applies.
 */
const uploadImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  const response = await post<{ imageUrls: string[] }>(
    "/image/upload-multiple",
    formData
  );
  return response.imageUrls;
};

export const productsService = {
  fetchProducts,
  relatedProductsByCategorySlug,
  fetchAllCategories,
  getProductBySlug,
  getRecommendedProducts,
  getProductRelatedInfo,
  uploadImages,
};
