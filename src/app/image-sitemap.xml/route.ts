// app/image-sitemap.xml/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://pakshipper.com";
  const response = await fetch(
    "https://e-commerce-backend-seven-xi.vercel.app/api/products/get-all-products"
  );
  const data = await response.json();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  for (const product of data.data) {
    xml += `<url>
      <loc>${baseUrl}/pages/product-detail/${product._id}</loc>`;
    for (const img of product.images) {
      xml += `
        <image:image>
          <image:loc>${img.src}</image:loc>
          <image:title>${product.productName}</image:title>
          <image:caption>${img.alt}</image:caption>
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
// This code generates an XML sitemap specifically for images of products in an e-commerce application.