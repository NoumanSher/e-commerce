import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { productsService } from "@/services/productsService";
import { getServerOrigin } from "@/utils/url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let host = "default";
  try {
    host = headers().get("host") ?? "default";
    const cleanHost = host.split(":")[0].toLowerCase();
    if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
      host = process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "sandbox.localhost";
    }
  } catch {
    // Fallback
  }

  const baseUrl = getServerOrigin(host);
  const urls: MetadataRoute.Sitemap = [];

  // 1. Core High-Priority Pages
  const corePages = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/collections", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/all-products", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/about-us", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/contact-us", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/faq", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/privacy-policy", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/terms-of-service", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/shipping-and-returns", changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  for (const page of corePages) {
    urls.push({
      url: `${baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  try {
    // 2. Fetch all Categories
    const categoryData = await productsService.fetchAllCategories();
    const categories = categoryData.categories || [];

    for (const category of categories) {
      if (!category.slug) continue;

      urls.push({
        url: `${baseUrl}/collections?parentCategorySlug=${encodeURIComponent(category.slug)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      });

      // 3. Fetch products in this category
      try {
        const productData = await productsService.fetchProducts({
          categorySlug: category.slug,
          page: 1,
          limit: 100,
          mode: "seo",
        });

        const products = productData.data || [];
        for (const product of products) {
          const productSlug = product.seo?.slug;
          if (!productSlug) continue;

          urls.push({
            url: `${baseUrl}/product-detail/${productSlug}`,
            lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          });
        }
      } catch (productError) {
        console.error(
          `Error fetching products for category ${category.slug} during sitemap:`,
          productError
        );
      }
    }
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
  }

  return urls;
}
