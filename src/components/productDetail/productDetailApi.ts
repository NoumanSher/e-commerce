import axios from "axios";
import { BASE_URL_LIVE } from "@/appConst/appConst";
import { ProductDetailApiResponse } from "./productDetailDto";
const productDetailById = async (
  productId: string
): Promise<ProductDetailApiResponse> => {
  debugger
  const res = await axios.get<ProductDetailApiResponse>(
    `${BASE_URL_LIVE}/products/get-product/${productId}`
  );
  debugger
  return res.data;
};

export { productDetailById };
