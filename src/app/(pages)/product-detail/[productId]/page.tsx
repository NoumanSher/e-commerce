import React, { Suspense } from "react";
import { QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import ProductDetailComponet from "@/components/productDetail";
import { getStoreSetting } from "@/components/Slider/api/storeSettingApi";
import ProductDetailSkeleton from "@/components/productDetail/components/ProductDetailSkeleton";
interface ProductDetailProps {
  params: { productId: string };
}

interface ImageProps {
  src: string;
  alt: string;
}

// Shared query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute cache
    },
  },
});

// Memoized product data fetcher
async function getProductData(productId: string) {
  const response = await fetch(
    `https://e-commerce-backend-seven-xi.vercel.app/api/products/get-product/${productId}`,
    { next: { revalidate: 60 } } // ISR with 60-second revalidation
  );
  return response.json().then(data => data.data);
}

// Parallel data fetching for metadata
async function getPageData(productId: string) {
  const [product, storeSettings] = await Promise.all([
    getProductData(productId),
    queryClient.fetchQuery({
      queryKey: ["settings"],
      queryFn: getStoreSetting,
    }),
  ]);
  return { product, storeSettings };
}

export async function generateMetadata({
  params,
}: ProductDetailProps): Promise<Metadata> {
  const { product, storeSettings } = await getPageData(params.productId);

  const baseUrl = "https://pakshipper.com/product-detail";
  const productUrl = `${baseUrl}/${product._id}`;
  const title = product?.seo?.metaTitle || product?.productName || "Product Detail";
  const description = product?.seo?.metaDescription || product?.description || "Check out this amazing product.";
  const keywords = product?.seo?.metaKeywords?.join(", ") || "e-commerce, shopping, online store";

  return {
    title,
    description,
    keywords,
    icons: {
      icon: [{ url: storeSettings ? storeSettings.logo : '', type: "image/png", sizes: "32x32" }],
    },
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description,
      url: productUrl,
      images: product?.images?.map((img: ImageProps) => ({
        url: img.src,
        alt: img.alt,
      })),
      type: "website",
      siteName: "Pakshipper",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product?.images?.map((img: ImageProps) => img.src),
    },
  };
}

function generateProductSchema(product: any) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.productName,
    image: product.images?.map((img: any) => img.src),
    description: product.seo.metaDescription,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Pakshipper",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.salePrice,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.stock !== 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://pakshipper.com/product-detail/${product._id}`,
    },
  };
}

export default async function ProductDetail({
  params: { productId },
}: ProductDetailProps) {
  const { product } = await getPageData(productId);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema(product)),
        }}
      />

      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailComponet productId={productId}  />
      </Suspense>
    </>
  );
}