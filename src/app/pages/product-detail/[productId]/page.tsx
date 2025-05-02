import React, { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import ProductDetailComponet from "@/components/productDetail";
import { getStoreSetting } from "@/components/Slider/api/storeSettingApi";


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
  interface ImageProps {
    src: string;
    alt: string;
  }
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
      },
    },
  }); 
  
  const storeSettings = await queryClient.fetchQuery({
    queryKey: ["settings"],
    queryFn: getStoreSetting,
    staleTime: 0,
  });


  const metadata: Metadata = {
    title: product?.seo?.metaTitle || product?.productName || "Product Detail",
    description: product?.seo?.metaDescription || product?.description || "Check out this amazing product.",
    keywords: product?.seo?.metaKeywords?.join(", ") || "e-commerce, shopping, online store",
    icons: {
      icon: [{ url: `${storeSettings.logo}`, type: 'image/png', sizes: '100x100' }],
    },
    openGraph: {
      title: product?.seo?.metaTitle || product?.productName,
      description: product?.seo?.metaDescription || product?.description,
      url: `https://e-commerce-pink-iota.vercel.app/pages/product-detail/${product?._id}`,
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
    queryKey: ["productId", productId, Date.now()],
    queryFn: () => getProductDataById(productId),
  });

  const product = await getProductDataById(productId);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.productName,
            "image": product.images?.[0]?.src,
            "description": product.description,
            "offers": {
              "@type": "Offer",
              "price": product.salePrice,
              "priceCurrency": "PKR"
            }
          })
        }}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={".....loading detail"}>
          <ProductDetailComponet productId={productId} />
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
