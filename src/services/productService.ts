import { get } from '@/lib/apiClient'

export interface Product {
  // Define product properties here
}

export interface Category {
  _id: string;
  name: string;
  childCategories: ChildCategory[];
}

export interface ChildCategory {
  products: Product[];
}

export interface ProductsResponse {
  data: Category[];
}

export const fetchProductsByCategory = async (
  parentCategoryID: string
): Promise<ProductsResponse> => {
  const url = '/products/get-all-products'
  const data = await get<ProductsResponse>(url, { parentCategoryID })
  return data
}
