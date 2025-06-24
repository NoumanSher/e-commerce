import { NextResponse } from "next/server";

export async function GET() {
  // const baseUrl = "http://localhost:3000";
  const baseUrl = "https://pakshipper.com";
  const response = await fetch(
    "https://e-commerce-backend-seven-xi.vercel.app/api/products/get-all-products"
  );
  const data = await response.json();

  // Escape special XML characters in text content
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

  for (const product of data.data) {
    xml += `<url>
      <loc>${escapeXml(`${baseUrl}/product-detail/${product._id}`)}</loc>`;
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