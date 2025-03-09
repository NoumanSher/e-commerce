import axios from 'axios';

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

export const fetchProductsByCategory = async (parentCategoryID: string): Promise<ProductsResponse> => {
  const response = await axios.get<ProductsResponse>(`https://e-commerce-backend-seven-xi.vercel.app/api/products/get-all-products?parentCategoryID=${parentCategoryID}`);
  return response.data;
};
