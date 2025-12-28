import { get } from "@/lib/apiClient";
import { Product } from "@/components/productDetail/productDetailDto";

export interface Pagination {
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  children?: ChildCategory[]; // Optional array of child categories
}

interface ChildCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  parentCategory: string; // Reference to parent category ID
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ParentCategoriesResponse {
  message: string;
  categories: Category[];
}

export interface ProductsResponse {
  message: string;
  data: Product[];
  pagination: Pagination;
}
export interface RelatedProductsResponse
  extends Omit<ProductsResponse, "pagination"> { }

export interface ApiError {
  message: string;
  statusCode?: number;
  response?: any;
}

export const fetchProducts = async (
  categorySlug?: string,
  childCategorySlug?: string,
  page: number = 1,
  limit: number = 8
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  if (childCategorySlug) params.append("childCategorySlug", childCategorySlug);
  if (categorySlug) params.append("parentCategorySlug", categorySlug);
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  const url = `/products/get-all-products?${params.toString()}`
  try {
    const data = await get<ProductsResponse>(url)
    return data
  } catch (error) {
    // apiClient already normalizes Axios errors to ApiError shape
    throw error
  }
};
export const fetchAllCategories = async (): Promise<ParentCategoriesResponse> => {
  const url = `/categories/all`
  try {
    const data = await get<ParentCategoriesResponse>(url)
    return data
  } catch (error) {
    throw error
  }
};
