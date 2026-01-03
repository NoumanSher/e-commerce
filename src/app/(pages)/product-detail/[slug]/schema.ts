// utils/generateProductSchema.ts

export function generateProductSchema(product: any) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.productName,
    description: product.seo?.metaDescription || product.description?.replace(/<[^>]*>/g, '').substring(0, 250),
    sku: product.sku,
    image: product.images?.map((img: any) => img.src),
    brand: {
      "@type": "Brand",
      name: "PakShipperStore",
    },
    offers: {}, // Will be populated below
  };

  /* ------------------ CATEGORY ------------------ */
  if (product.parentCategoryName) {
    schema.category = product.parentCategoryName;
  }

  /* ------------------ URL (IMPORTANT) ------------------ */
  if (product.seo?.slug) {
    schema.url = `https://pakshipper.com/product-detail/${product.seo.slug}`;
  }

  /* ------------------ AGGREGATE RATING (FIXED STRUCTURE) ------------------ */
  if (
    product.ratingStats &&
    product.ratingStats.totalReviews > 0
  ) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.ratingStats.averageRating,
      reviewCount: product.ratingStats.totalReviews,
      bestRating: 5,
      worstRating: 1, // Add this for completeness
    };

    /* ------------------ REVIEWS (CORRECT PLACEMENT) ------------------ */
    if (product.reviews?.length) {
      // Use "review" (singular) array inside the Product schema
      schema.review = product.reviews.map((review: any) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.userId?.username || "Anonymous",
        },
        reviewBody: review.description,
        datePublished: review.createdAt.split("T")[0],
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },
        // Add these optional fields for better SEO
        publisher: {
          "@type": "Organization",
          name: "PakShipperStore"
        }
      }));
    }
  }

  /* ------------------ OFFERS (WITH CORRECT AVAILABILITY URLS) ------------------ */
  const availabilityUrl = (stock: number) =>
    stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";

  if (product.isVariant && product.variants?.length) {
    const prices = product.variants.map(
      (v: any) => product.salePrice + (v.additionalSalePrice || 0)
    );

    const totalStock = product.variants.reduce(
      (sum: number, v: any) => sum + (v.stock || 0),
      0
    );

    schema.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "PKR",
      lowPrice: Math.min(...prices).toString(),
      highPrice: Math.max(...prices).toString(),
      offerCount: product.variants.length.toString(),
      availability: availabilityUrl(totalStock),
      url: schema.url,
      seller: {
        "@type": "Organization",
        name: "PakShipperStore",
      },
      itemCondition: "https://schema.org/NewCondition",
    };
  } else {
    schema.offers = {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.salePrice.toString(),
      availability: availabilityUrl(product.stock || 0),
      itemCondition: "https://schema.org/NewCondition",
      url: schema.url,
      seller: {
        "@type": "Organization",
        name: "PakShipperStore",
      },
    };
  }

  /* ------------------ ADDITIONAL PROPERTIES ------------------ */
  const additionalProperties = [];

  if (product.isNew) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "condition",
      value: "New Arrival",
    });
  }

  if (product.isLimited) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "availability",
      value: "Limited Edition",
    });
  }

  // Add fabric and other details
  if (product.description?.includes("Polyester")) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "fabric",
      value: "84% Polyester, 16% Spandex",
    });
  }

  if (additionalProperties.length > 0) {
    schema.additionalProperty = additionalProperties;
  }

  return schema;
}