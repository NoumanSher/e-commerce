import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getServerOrigin } from "@/utils/url";

export default function robots(): MetadataRoute.Robots {
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

  const origin = getServerOrigin(host);

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/product-detail/",
          "/all-products",
          "/collections",
          "/about-us",
          "/contact-us",
          "/faq",
          "/privacy-policy",
          "/terms-of-service",
          "/shipping-and-returns",
          "/llms.txt",
          "/llms-full.txt",
        ],
        disallow: [
          "/cart",
          "/checkout",
          "/api/",
          "/admin/",
          "/_next/",
          "/account/",
          "/auth/",
        ],
      },
      // AI Search Engine Crawlers - explicitly grant access for organic AI citations (GEO / LLMO)
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "Amazonbot",
          "meta-externalagent",
          "Bytespider",
          "cohere-ai",
        ],
        allow: [
          "/",
          "/product-detail/",
          "/all-products",
          "/collections",
          "/about-us",
          "/contact-us",
          "/faq",
          "/llms.txt",
          "/llms-full.txt",
        ],
        disallow: ["/cart", "/checkout", "/api/", "/admin/"],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
  };
}
