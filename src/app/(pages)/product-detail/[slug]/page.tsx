import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { generateProductSchema } from "./schema";
import { getProductBySlugServer } from "@/services/productsService.server";
import { headers } from "next/headers";
import ProductDetailSkeleton from "@/components/productDetail/components/ProductDetailSkeleton";
import { getMetadata } from "./metadata";
import { notFound } from "next/navigation";
import { AuthModal } from "@/components/AuthModal";
import AquaMistProductDetailPage from "@/themes/aquamist/(pages)/product-detail/[slug]/page";

import { resolveActiveTheme } from "@/utils/theme";

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
  const activeTheme = await resolveActiveTheme();

  if (activeTheme === "aquamist") {
    return <AquaMistProductDetailPage params={{ slug }} />;
  }

  let host = "default";
  try {
    host = headers().get("host") ?? "default";
    const cleanHost = host.split(":")[0].toLowerCase();
    if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
      host = process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "sandbox.localhost";
    }
  } catch {
    // During `next build` static generation there is no request context.
    // Fall back to "default" — the prefetch calls will fail gracefully.
  }

  // Server fetch (cached with revalidate)
  const product = await getProductBySlugServer(slug, host);
  if (!product) {
    // this renders the Next.js 404 page and prevents the error
    return notFound();
  }

  const rawHost = headers().get("host") ?? host;
  const cleanHostName = rawHost.split(":")[0].toLowerCase();
  const origin = (cleanHostName === "localhost" || cleanHostName === "127.0.0.1")
    ? `http://${process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "sandbox.localhost"}`
    : `https://${cleanHostName}`;

  return (
    <>
      {/* JSON‑LD schema: inlined by the server */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema(product, origin)),
        }}
      />

      {/* Only load the heavy React part on the client */}
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailClient slug={slug} initialData={product} />
      </Suspense>
      <AuthModal />

    </>
  );
}
export const generateMetadata = getMetadata;

