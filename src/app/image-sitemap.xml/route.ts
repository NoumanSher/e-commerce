import { NextResponse } from "next/server";
import { productsService } from "@/services/productsService";

export async function GET() {
  const baseUrl = "https://pakshipper.com";
  // Fetching all products (limit 100 for sitemap)
  const productData = await productsService.fetchProducts(undefined, undefined, 1, 100, 'images');
  const escapeXml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  for (const product of productData.data) {
    xml += `<url>
      <loc>${escapeXml(`${baseUrl}/product-detail/${product.seo.slug}`)}</loc>`;
    for (const img of product.images) {
      xml += `
        <image:image>
          <image:loc>${escapeXml(img.src)}</image:loc>
          <image:title>${escapeXml(product.productName)}</image:title>
          <image:caption>${escapeXml(img.alt || '')}</image:caption>
        </image:image>`;
    }
    xml += `</url>`;
  }

  xml += `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}