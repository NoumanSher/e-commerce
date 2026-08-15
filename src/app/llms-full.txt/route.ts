import { NextRequest, NextResponse } from "next/server";
import { getStoreSettingServer } from "@/services/settingsService.server";
import { productsService } from "@/services/productsService";
import { getServerOrigin } from "@/utils/url";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") ?? "default";
  const origin = getServerOrigin(host);

  let storeTitle = "Online Store";
  let storeDesc = "High-quality products, fast shipping, and friendly customer service.";
  let contactPhone = "";
  let contactEmail = "";

  try {
    const storeSettings = await getStoreSettingServer(host);
    if (storeSettings) {
      storeTitle = storeSettings.title || storeTitle;
      storeDesc = storeSettings.description || storeDesc;
      contactPhone = storeSettings.mobile || "";
      contactEmail = storeSettings.email || "";
    }
  } catch (err) {
    // Fallback
  }

  let productsMarkdown = "";
  try {
    const catData = await productsService.fetchAllCategories();
    const categories = catData.categories || [];

    for (const category of categories.slice(0, 8)) {
      productsMarkdown += `\n### Category: ${category.name}\n`;
      try {
        const prodData = await productsService.fetchProducts({
          categorySlug: category.slug,
          page: 1,
          limit: 12,
          mode: "seo",
        });
        const prods = prodData.data || [];
        if (prods.length > 0) {
          prods.forEach((p) => {
            const priceStr = p.salePrice ? ` (PKR ${p.salePrice})` : "";
            const skuStr = p.sku ? ` [SKU: ${p.sku}]` : "";
            const url = `${origin}/product-detail/${p.seo?.slug || p._id}`;
            productsMarkdown += `- [${p.productName}](${url})${priceStr}${skuStr}\n`;
          });
        } else {
          productsMarkdown += `- Visit [${category.name} Collection](${origin}/collections?parentCategorySlug=${encodeURIComponent(category.slug)})\n`;
        }
      } catch (err) {
        // Skip
      }
    }
  } catch (err) {
    // Skip
  }

  const content = `# Full Knowledge Base: ${storeTitle}

> ${storeDesc}

## About ${storeTitle}
${storeTitle} is an e-commerce platform dedicated to offering curated, premium products with top-tier customer satisfaction.

## Products & Inventory Catalog
${productsMarkdown || `Visit [${origin}/collections](${origin}/collections) to explore current stock.`}

## Key Policies
- **Shipping & Delivery:** Nationwide delivery across Pakistan. Free shipping available on qualifying order thresholds.
- **Payment Methods:** Cash on Delivery (COD), Online Card Payments, and Bank Transfers.
- **Customer Support:** Direct WhatsApp ordering and phone support ${contactPhone ? `(${contactPhone})` : ""} available daily.
- **Returns & Exchanges:** Hassle-free replacement for defective or damaged items reported within the return window.

## Official Canonical URLs
- Storefront Home: ${origin}
- Collections: ${origin}/collections
- All Products: ${origin}/all-products
- FAQ: ${origin}/faq
- Contact: ${origin}/contact-us
- About: ${origin}/about-us

---
*Comprehensive Context Generated for AI Search Engines & LLM Citation Agents.*
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
