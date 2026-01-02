// utils/generateProductSchema.ts

export function generateProductSchema(product: any) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: product.productName,
    description: product.seo?.metaDescription,
    sku: product.sku,

    image: product.images?.map((img: any) => img.src),

    brand: {
      "@type": "Brand",
      name: "PakShipperStore",
    },
  };

  /* ------------------ CATEGORY ------------------ */
  if (product.parentCategoryName) {
    schema.category = product.parentCategoryName;
  }

  /* ------------------ AGGREGATE RATING ------------------ */
  if (
    product.ratingStats &&
    product.ratingStats.totalReviews > 0
  ) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.ratingStats.averageRating,
      reviewCount: product.ratingStats.totalReviews,
      bestRating: 5,
      // worstRating: 1,
    };
  }

  /* ------------------ REVIEWS ------------------ */
  if (product.reviews?.length) {
    schema.review = product.reviews.map((review: any) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.userId?.username || "Verified Buyer",
      },
      reviewBody: review.description,
      datePublished: review.createdAt.split("T")[0],
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        // worstRating: 1,
      },
    }));

  }

  /* ------------------ OFFERS ------------------ */
  if (product.isVariant && product.variants?.length) {
    const prices = product.variants.map(
      (v: any) => product.salePrice + v.additionalSalePrice
    );

    const totalStock = product.variants.reduce(
      (sum: number, v: any) => sum + v.stock,
      0
    );

    schema.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "PKR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: product.variants.length,
      availability:
        totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `https://pakshipper.com/product-detail/${product.seo.slug}`,
    };
  } else {
    schema.offers = {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.salePrice,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `https://pakshipper.com/product-detail/${product.seo.slug}`,
      seller: {
        "@type": "Organization",
        name: "PakShipperStore",
      },
    };
  }

  /* ------------------ BADGES ------------------ */
  if (product.isNew || product.isLimited) {
    schema.additionalProperty = [];

    if (product.isNew) {
      schema.additionalProperty.push({
        "@type": "PropertyValue",
        name: "condition",
        value: "New Arrival",
      });
    }

    if (product.isLimited) {
      schema.additionalProperty.push({
        "@type": "PropertyValue",
        name: "availability",
        value: "Limited Edition",
      });
    }
  }

  return schema;
}
