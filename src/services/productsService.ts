import { get } from "@/lib/apiClient";
import { Product } from "@/components/productDetail/productDetailDto";
import { BASE_URL_LIVE } from "@/appConst/appConst";

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

const fetchProducts = async (
  categorySlug?: string,
  childCategorySlug?: string,
  page: number = 1,
  limit: number = 8,
  mode: string = "full"
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  if (childCategorySlug) params.append("childCategorySlug", childCategorySlug);
  if (categorySlug) params.append("parentCategorySlug", categorySlug);
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (mode) params.append("mode", mode);
  const url = `/products/get-all-products?${params.toString()}`;
  debugger
  return await get<ProductsResponse>(url);
};

const fetchProductsByCategory = async (
  parentCategoryID: string
): Promise<any> => {
  const url = '/products/get-all-products'
  return await get<any>(url, { parentCategoryID })
}

const relatedProductsByCategoryId = async (
  categoryId: string
): Promise<RelatedProductsResponse> => {
  const url = `/products/get-products-by-category-priority?parentCategorySlug=${categoryId}`
  return await get<RelatedProductsResponse>(url)
};

const fetchAllCategories = async (): Promise<ParentCategoriesResponse> => {
  const url = `/categories/all`
  return await get<ParentCategoriesResponse>(url)
};

const getProductBySlug = async (slug: string): Promise<Product> => {
  const url = `/products/get-product-by-slug/${slug}`;
  const response = await get<any>(url);
  return response.data;
}

const uploadImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await fetch(`${BASE_URL_LIVE}/image/upload-multiple`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error uploading images: ${response.statusText}`);
  }

  const data = await response.json();
  return data.imageUrls;
}

export const productsService = {
  fetchProducts,
  fetchProductsByCategory,
  relatedProductsByCategoryId,
  fetchAllCategories,
  getProductBySlug,
  uploadImages
};
