// app/product-detail/[productId]/metadata.ts
import { Metadata } from "next";
import { headers } from "next/headers";
import { getProductBySlugServer } from "@/services/productsService.server";
import { getStoreSettingServer } from "@/services/settingsService.server";

interface GenerateMetadataProps {
  params: { slug: string };
}

export async function getMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
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

  const [product, storeSettings] = await Promise.all([
    getProductBySlugServer(params.slug, host),
    getStoreSettingServer(host),
  ]);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product does not exist.",
    };
  }

  const urlBase = "https://pakshipper.com/product-detail";
  const productUrl = `${urlBase}/${product.seo?.slug || params.slug}`;
  const title = product.seo?.metaTitle ?? product.productName;
  const description = product.seo?.metaDescription ?? product.description;

  // Narrow out the optional logo into a concrete string (or undefined)
  const logoUrl = storeSettings?.logo;


  return {
    title,
    description,
    keywords: product.seo?.metaKeywords?.join(", "),
    // Only include icons if we actually have a string logoUrl
    ...(logoUrl
      ? {
        icons: {
          icon: [
            {
              url: logoUrl,
              type: "image/png",
              sizes: "32x32",
            },
          ],
        },
      }
      : {}),
    alternates: { canonical: productUrl },

    openGraph: {
      title,
      description,
      url: productUrl,
      type: "website",
      siteName: "PakShipperStore",
      images: product.images.map((img: { src: string; alt: string }) => ({
        url: img.src,
        alt: product.productName,
        width: 1200,
        height: 630,
      })),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images.map((img: { src: string; alt: string }) => img.src),
    },


  };
}
