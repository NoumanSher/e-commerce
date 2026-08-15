import { NextRequest, NextResponse } from "next/server";
import { getStoreSettingServer } from "@/services/settingsService.server";
import { productsService } from "@/services/productsService";
import { getServerOrigin } from "@/utils/url";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") ?? "default";
  const origin = getServerOrigin(host);

  let storeTitle = "Online Store";
  let storeDesc = "High-quality products, fast shipping, and excellent customer service.";
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
    // Graceful fallback
  }

  let categoriesMarkdown = "";
  try {
    const catData = await productsService.fetchAllCategories();
    const categories = catData.categories || [];
    categoriesMarkdown = categories
      .map(
        (c) =>
          `- [${c.name}](${origin}/collections?parentCategorySlug=${encodeURIComponent(
            c.slug
          )}): Browse our curated collection of ${c.name.toLowerCase()}.`
      )
      .join("\n");
  } catch (err) {
    categoriesMarkdown = `- [Collections](${origin}/collections): Explore our entire product catalog.`;
  }

  const content = `# ${storeTitle}

> ${storeDesc}

## Overview
${storeTitle} is a premier online shopping destination offering authentic, top-rated products with nationwide fast delivery, secure payment options (Cash on Delivery & online payments), and customer-first return policies.

## Main Product Categories
${categoriesMarkdown || `- [All Products](${origin}/all-products)`}

## Important Links & Information
- [Collections & Categories](${origin}/collections)
- [All Products Catalog](${origin}/all-products)
- [About Us](${origin}/about-us): Learn our story, mission, and craftsmanship.
- [Contact Support](${origin}/contact-us): Get in touch with our customer service team.
- [Frequently Asked Questions (FAQ)](${origin}/faq): Common questions regarding orders, shipping, and payment.
- [Shipping & Returns Policy](${origin}/shipping-and-returns): Delivery fees, delivery timelines, and return instructions.
- [Privacy Policy](${origin}/privacy-policy)
- [Terms of Service](${origin}/terms-of-service)

## Customer Assistance & Ordering
${contactPhone ? `- **WhatsApp / Phone:** ${contactPhone}` : ""}
${contactEmail ? `- **Email Support:** ${contactEmail}` : ""}
- **Store URL:** ${origin}

---
*Generated for AI Crawlers, LLMs, and Search Indexers. For the full extended context, visit [${origin}/llms-full.txt](${origin}/llms-full.txt).*
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
