import React, { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import ProductDetailComponet from "@/components/productDetail";
import { ProductCardDataProps ,Image} from "@/data/dataProps";

interface ProductDetailProps {
  params: { productId: string };
}

// Fetch product data from API
async function getProductDataById(productId: string) {
  const response = await fetch(
    `https://e-commerce-backend-seven-xi.vercel.app/api/products/get-product/${productId}`
  );
  const data = await response.json();
  return data.data;
}

// **Next.js Metadata for SEO**
export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const product = await getProductDataById(params.productId);
  // console.log(product)


  interface ImageProps {
    src: string;
    alt: string;
  }


  const metadata: Metadata = {
    title: product?.seo?.metaTitle || product?.productName || "Product Detail",
    description: product?.seo?.metaDescription || product?.description || "Check out this amazing product.",
    keywords: product?.seo?.metaKeywords?.join(", ") || "e-commerce, shopping, online store",
    openGraph: {
      title: product?.seo?.metaTitle || product?.productName,
      description: product?.seo?.metaDescription || product?.description,
      url: `https://e-commerce-pink-iota.vercel.app/pages/product-detail${product?._id}`,
      images: product?.images?.map((img: ImageProps) => ({
        url: img.src,
        alt: img.alt,
      })),
      type: "website",
    },
  };

  return metadata;
}

export default async function ProductDetail({ params: { productId } }: ProductDetailProps) {
  const queryClient = new QueryClient();

  // Prefetch product data
  await queryClient.prefetchQuery({
    queryKey: ["productId", productId],
    queryFn: () => getProductDataById(productId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={".....loading detail"}>
        <ProductDetailComponet productId={productId} />
      </Suspense>
    </HydrationBoundary>
  );
}
