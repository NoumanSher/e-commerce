import { useQuery } from "@tanstack/react-query";
import { fetchCategories, CategoriesResponse } from "@/services/categoryService";

export const useCategories = () => {
  return useQuery<CategoriesResponse, Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};
