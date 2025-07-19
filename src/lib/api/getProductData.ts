import { Product } from "@/components/productDetail/productDetailDto";

export async function getProductData(productId: string): Promise<Product> {
  const endpoint = `https://e-commerce-backend-seven-xi.vercel.app/api/products/get-product/${productId}`;
  const res = await fetch(endpoint, { next: { revalidate: 60 } });
  if (!res.ok) {
    // make sure we catch 4xx/5xx before trying to parse JSON
    throw new Error(
      `getProductData: failed to fetch product ${productId} (status ${res.status})`
    );
  }
  const json = await res.json();
  return json.data;
}
