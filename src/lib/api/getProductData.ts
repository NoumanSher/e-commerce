import { Product } from "@/components/productDetail/productDetailDto";
import { BASE_URL_LIVE } from "@/appConst/appConst";
export async function getProductData(slug: string): Promise<Product> {
  const endpoint = `${BASE_URL_LIVE}/products/get-product-by-slug/${slug}`;
  const res = await fetch(endpoint, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(
      `getProductData: failed to fetch product ${slug} (status ${res.status})`
    );
  }
  const json = await res.json();
  return json.data;
}
