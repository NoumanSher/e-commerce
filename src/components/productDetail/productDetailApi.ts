import axios from "axios";
import { BASE_URL_LIVE } from "@/appConst/appConst";
import { ProductDetailApiResponse,Product } from "./productDetailDto";
const productDetailById = async (
  productId: string
): Promise<Product> => {
  debugger
  const res = await axios.get<Product>(
    `${BASE_URL_LIVE}/products/get-product/${productId}`
  );
  debugger
  return res.data;
};

export { productDetailById };
