import { productsService } from "./productsService";

/**
 * @deprecated categoryService is deprecated. Use productsService.fetchAllCategories() instead.
 * This file is kept only as a compatibility shim and will be removed in the future.
 */
export const categoryService = {
  fetchCategories: () => productsService.fetchAllCategories(),
};

export type { ParentCategoriesResponse as CategoriesResponse, Category } from "./productsService";

