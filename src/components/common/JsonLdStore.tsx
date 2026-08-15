import React from "react";
import { StoreInfo } from "@/components/Slider/dto/storeSettingDto";

interface JsonLdStoreProps {
  origin: string;
  storeSettings?: StoreInfo;
}

export default function JsonLdStore({ origin, storeSettings }: JsonLdStoreProps) {
  const storeName = storeSettings?.title || "PakShipper Store";
  const storeLogo = storeSettings?.logo || `${origin}/favicon.ico`;
  const storeDesc =
    storeSettings?.description ||
    `Shop high-quality products at ${storeName}. Free shipping and instant customer support.`;

  const structuredData = [
    // 1. WebSite Schema with Sitelinks Searchbox
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: origin,
      name: storeName,
      description: storeDesc,
      publisher: {
        "@id": `${origin}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${origin}/all-products?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    // 2. OnlineStore / Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      "@id": `${origin}/#organization`,
      name: storeName,
      url: origin,
      logo: storeLogo,
      image: storeLogo,
      description: storeDesc,
      priceRange: "$$",
      currenciesAccepted: "PKR",
      paymentAccepted: "Cash, Credit Card, Debit Card, Cash on Delivery",
      telephone: storeSettings?.mobile || undefined,
      email: storeSettings?.email || undefined,
      contactPoint: storeSettings?.mobile
        ? [
            {
              "@type": "ContactPoint",
              telephone: storeSettings.mobile,
              contactType: "customer service",
              availableLanguage: ["English", "Urdu"],
            },
          ]
        : undefined,
      sameAs: [
        storeSettings?.facebookUrl,
        storeSettings?.instagramUrl,
        storeSettings?.twitterUrl,
        storeSettings?.youtubeUrl,
        storeSettings?.pinterestUrl,
      ].filter(Boolean),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
