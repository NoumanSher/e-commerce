// app/product-detail/[productId]/metadata.ts
import { Metadata } from "next";
import { headers } from "next/headers";
import { getProductBySlugServer } from "@/services/productsService.server";
import { getStoreSettingServer } from "@/services/settingsService.server";
import { getServerOrigin } from "@/utils/url";

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

  // Derive the actual tenant origin dynamically from the request host
  const origin = getServerOrigin(headers().get("host") ?? host);
  const productUrl = `${origin}/product-detail/${product.seo?.slug || params.slug}`;
  const storeName = storeSettings?.title || "PakShipperStore";
  const title = product.seo?.metaTitle || `${product.productName} | ${storeName}`;

  // Clean HTML from description for WhatsApp and search engines
  const rawDescription = product.seo?.metaDescription || product.description || "";
  const cleanDescription = rawDescription
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);

  const logoUrl = storeSettings?.logo;

  // Build high-res OpenGraph images for WhatsApp link previews
  const ogImages =
    product.images && product.images.length > 0
      ? product.images.map((img: { src: string; alt?: string }) => ({
          url: img.src,
          alt: img.alt || product.productName,
          width: 800,
          height: 800,
        }))
      : logoUrl
      ? [{ url: logoUrl, alt: storeName, width: 600, height: 600 }]
      : [];

  return {
    title,
    description: cleanDescription,
    keywords: product.seo?.metaKeywords?.join(", "),
    metadataBase: new URL(origin),
    alternates: { canonical: productUrl },

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
            shortcut: logoUrl,
            apple: logoUrl,
          },
        }
      : {}),

    openGraph: {
      title: product.productName,
      description: cleanDescription,
      url: productUrl,
      type: "website",
      siteName: storeName,
      images: ogImages,
    },

    twitter: {
      card: "summary_large_image",
      title: product.productName,
      description: cleanDescription,
      images: ogImages.map((img) => img.url),
    },
  };
}
