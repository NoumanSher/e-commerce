import { Product } from "@/components/productDetail/productDetailDto";
import { BASE_URL_LIVE } from "@/appConst/appConst";
export async function getProductData(productId: string): Promise<Product> {
  const endpoint = `${BASE_URL_LIVE}/products/get-product/${productId}`;
  const res = await fetch(endpoint, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(
      `getProductData: failed to fetch product ${productId} (status ${res.status})`
    );
  }
  const json = await res.json();
  return json.data;
}
