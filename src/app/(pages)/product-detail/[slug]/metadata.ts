// app/product-detail/[productId]/metadata.ts
import { Metadata } from "next";
import { productsService } from "@/services/productsService";
import { settingsService } from "@/services/settingsService";

interface GenerateMetadataProps {
  params: { slug: string };
}

export async function getMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const [product, storeSettings] = await Promise.all([
    productsService.getProductBySlug(params.slug),
    settingsService.getStoreSetting(),
  ]);

  const urlBase = "https://pakshipper.com/product-detail";
  const productUrl = `${urlBase}/${product.seo.slug}`;
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
        alt: img.alt,
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
