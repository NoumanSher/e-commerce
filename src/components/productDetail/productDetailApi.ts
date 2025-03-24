import axios from "axios";
import { BASE_URL_LIVE } from "@/appConst/appConst";
import { ProductDetailApiResponse,Product } from "./productDetailDto";
const productDetailById = async (productId: string): Promise<ProductDetailApiResponse> => {
  debugger
  const res = await axios.get<ProductDetailApiResponse>(
    `${BASE_URL_LIVE}/products/get-product/${productId}`
  );
  return res.data;
};

export { productDetailById };
