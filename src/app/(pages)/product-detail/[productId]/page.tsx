import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { generateProductSchema } from "./schema";
import { getProductData } from "@/lib/api/getProductData";
import ProductDetailSkeleton from "@/components/productDetail/components/ProductDetailSkeleton";
import { getMetadata } from "./metadata";
import { notFound } from "next/navigation";
import Head from "next/head";
// Dynamically load your client‐side heavy component:
const ProductDetailClient = dynamic(
  () => import("@/components/productDetail"),
  {
    ssr: false,
    loading: () => <ProductDetailSkeleton />,
  }
);

interface generateMetadataProps {
  params: {
    productId: string;
  };
}

export default async function Page({
  params: { productId },
}: generateMetadataProps) {
  // Server fetch (cached with revalidate)
  const product = await getProductData(productId);
  if (!product) {
    // this renders the Next.js 404 page and prevents the error
    return notFound();
  }
  return (
    <>
      <Head>
        <link
          rel="preconnect"
          href="https://e-commerce-backend-seven-xi.vercel.app"
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* JSON‑LD schema: inlined by the server */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema(product)),
        }}
      />

      {/* Only load the heavy React part on the client */}
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailClient productId={productId} />
      </Suspense>
    </>
  );
}
export const generateMetadata = getMetadata;
