import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { generateProductSchema } from "./schema";
import { productsService } from "@/services/productsService";
import ProductDetailSkeleton from "@/components/productDetail/components/ProductDetailSkeleton";
import { getMetadata } from "./metadata";
import { notFound } from "next/navigation";
// Dynamically load your client‐side heavy component:
const ProductDetailClient = dynamic(
  () => import("@/components/productDetail"),
  {
    loading: () => <ProductDetailSkeleton />,
  }
);

interface generateMetadataProps {
  params: {
    slug: string;
  };
}

export default async function Page({
  params: { slug },
}: generateMetadataProps) {
  // Server fetch (cached with revalidate)
  const product = await productsService.getProductBySlug(slug);
  if (!product) {
    // this renders the Next.js 404 page and prevents the error
    return notFound();
  }
  return (
    <>
      {/* JSON‑LD schema: inlined by the server */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema(product)),
        }}
      />

      {/* Only load the heavy React part on the client */}
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailClient slug={slug} initialData={product} />
      </Suspense>
    </>
  );
}
export const generateMetadata = getMetadata;
