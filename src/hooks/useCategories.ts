/**
 * useCategories — unified categories hook.
 * All category data now comes from a single endpoint (/categories/all)
 * and is cached under a single query key ["categories"].
 *
 * Previously this hook called /categories/all-parent with a different key,
 * causing a split cache. This is now fixed by delegating to useCategoriesQuery.
 */
export { useCategoriesQuery as useCategories } from "./useProductsQuery";
export type { ParentCategoriesResponse as CategoriesResponse } from "@/services/productsService";
