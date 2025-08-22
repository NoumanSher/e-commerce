import axios from "axios";
import { BASE_URL_LIVE } from "@/appConst/appConst";
// import { ProductDetailApiResponse } from "./productDetailDto";
import { RelatedProductsResponse } from "@/services/productsService";
// const productDetailById = async (
//   productId: string
// ): Promise<ProductDetailApiResponse> => {
//   const res = await axios.get<ProductDetailApiResponse>(
//     `${BASE_URL_LIVE}/products/get-product/${productId}`
//   );
//   return res.data;
// };
const relatedProductsByCategoryId = async (
  categoryId: string
): Promise<RelatedProductsResponse> => {
  
  const res = await axios.get<RelatedProductsResponse>(
    `${BASE_URL_LIVE}/products/get-products-by-category-priority?parentCategoryID=${categoryId}`
  );
  return res.data;
};

export {  relatedProductsByCategoryId };
