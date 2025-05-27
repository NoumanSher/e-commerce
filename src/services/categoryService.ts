import axios from "axios";
import { BASE_URL } from "@/constants";

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
    debugger
  const { data } = await axios.get(`${BASE_URL}/categories/all-parent`);
  return data;
};
