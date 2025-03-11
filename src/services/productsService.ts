import axios from "axios";
import { BASE_URL } from "@/constants";

import { Product } from "@/components/productDetail/productDetailDto";


export interface Pagination {
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ProductsResponse {
  message: string;
  data: Product[];
  pagination?: Pagination;
}

export const fetchProducts = async (
  categoryId?: string,
  page: number = 1,
  limit: number = 8
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();

  if (categoryId) params.append("parentCategoryID", categoryId);
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());

  const { data } = await axios.get(
    `${BASE_URL}/products/get-all-products?${params.toString()}`
  );
  debugger
  console.log(data);

  return data;
};
