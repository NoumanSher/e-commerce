import axios from "axios";
import { BASE_URL_LIVE } from "@/appConst/appConst";
import { Product } from "./productDetailDto";
const productDetailById = async (productId: string): Promise<Product> => {
  const res = await axios.get<Product>(
    `${BASE_URL_LIVE}/products/get-product/${productId}`
  );
  return res.data;
};

export { productDetailById };
