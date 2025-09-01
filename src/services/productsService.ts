import axios, { AxiosError } from "axios";
import { BASE_URL } from "@/constants";
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
  extends Omit<ProductsResponse, "pagination"> {}

export interface ApiError {
  message: string;
  statusCode?: number;
  response?: any;
}

export const fetchProducts = async (
  categoryId?: string,
  childCategoryID?: string,
  page: number = 1,
  limit: number = 8
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  if (childCategoryID) params.append("childCategoryID", childCategoryID);
  if (categoryId) params.append("parentCategoryID", categoryId);
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());

  try {
    const { data } = await axios.get(
      `${BASE_URL}/products/get-all-products?${params.toString()}`
    );

    return data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
    throw {
      message: err.message,
      statusCode: err.response?.status,
      response: err.response?.data,
    } satisfies ApiError;
  }
};
export const fetchAllCategories = async (): Promise<ParentCategoriesResponse> => {


  try {
    const { data } = await axios.get(
      `${BASE_URL}/categories/all`
    );

    return data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
    throw {
      message: err.message,
      statusCode: err.response?.status,
      response: err.response?.data,
    } satisfies ApiError;
  }
};
