import { get } from '@/lib/apiClient'

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CategoriesResponse {
  message: string;
  categories: Category[];
}

export const fetchCategories = async (): Promise<CategoriesResponse> => { 
  const url = '/categories/all-parent'
  const data = await get<CategoriesResponse>(url)
  return data
};
