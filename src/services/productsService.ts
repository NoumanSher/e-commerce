import axios from "axios";
import { BASE_URL } from "@/constants";
export interface Product {
  id: string;
  parentCategoryID: string;
  childCategoryID: string;
  productName: string;
  description: string;
  salePrice: number;
  stock: number;
  discount: number;
  sku: string;
  isNew: boolean;
  images: Array<{
    src: string;
    alt: string;
    isThumbnail: boolean;
    _id: string;
  }>;
  options: Array<{
    title: string;
    values: string[];
    _id: string;
  }>;
  variants: Array<{
    name: string;
    additionalCostPrice: number;
    additionalSalePrice: number;
    stock: number;
    _id: string;
  }>;
  seo: {
    metaTitle: string;
    slug: string;
    metaDescription: string;
    metaKeywords: string[];
  };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

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
