// utils/generateProductSchema.ts

export function generateProductSchema(
  product: any,
  origin: string = "https://pakshipper.com",
  storeName: string = "PakShipperStore"
) {
  const cleanOrigin = origin.replace(/\/+$/, "");
  const productUrl = product.seo?.slug
    ? `${cleanOrigin}/product-detail/${product.seo.slug}`
    : cleanOrigin;

  // 1. Core Product Schema
  const productSchema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.productName,
    description:
      product.seo?.metaDescription ||
      product.description?.replace(/<[^>]*>/g, "").substring(0, 250),
    sku: product.sku,
    image: product.images?.map((img: any) => img.src) || [],
    brand: {
      "@type": "Brand",
      name: storeName,
    },
    url: productUrl,
    offers: {},
  };

  if (product.parentCategoryName) {
    productSchema.category = product.parentCategoryName;
  }

  if (product.ratingStats && product.ratingStats.totalReviews > 0) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.ratingStats.averageRating,
      reviewCount: product.ratingStats.totalReviews,
      bestRating: 5,
      worstRating: 1,
    };

    if (product.reviews?.length) {
      productSchema.review = product.reviews.map((review: any) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.userId?.username || "Anonymous",
        },
        reviewBody: review.description,
        datePublished:
          review.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },
        publisher: {
          "@type": "Organization",
          name: storeName,
        },
      }));
    }
  }

  const availabilityUrl = (stock: number) =>
    stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";

  if (product.isVariant && product.variants?.length) {
    const prices = product.variants.map((v: any) => {
      const basePlusExtra = product.salePrice + (v.additionalSalePrice || 0);
      return product.discount > 0
        ? Math.round(basePlusExtra * (1 - product.discount / 100))
        : basePlusExtra;
    });

    const totalStock = product.variants.reduce(
      (sum: number, v: any) => sum + (v.stock || 0),
      0
    );

    productSchema.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "PKR",
      lowPrice: Math.min(...prices).toString(),
      highPrice: Math.max(...prices).toString(),
      offerCount: product.variants.length.toString(),
      availability: availabilityUrl(totalStock),
      url: productUrl,
      seller: {
        "@type": "Organization",
        name: storeName,
      },
      itemCondition: "https://schema.org/NewCondition",
    };
  } else {
    const finalPrice =
      product.discount > 0
        ? Math.round(product.salePrice * (1 - product.discount / 100))
        : product.salePrice;

    productSchema.offers = {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: finalPrice.toString(),
      availability: availabilityUrl(product.stock || 0),
      itemCondition: "https://schema.org/NewCondition",
      url: productUrl,
      seller: {
        "@type": "Organization",
        name: storeName,
      },
    };
  }

  // 2. BreadcrumbList Schema
  const breadcrumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: cleanOrigin,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Collections",
      item: `${cleanOrigin}/collections`,
    },
  ];

  if (product.parentCategoryName) {
    breadcrumbs.push({
      "@type": "ListItem",
      position: 3,
      name: product.parentCategoryName,
      item: `${cleanOrigin}/collections?parentCategorySlug=${encodeURIComponent(
        product.parentCategorySlug || product.parentCategoryName
      )}`,
    });
    breadcrumbs.push({
      "@type": "ListItem",
      position: 4,
      name: product.productName,
      item: productUrl,
    });
  } else {
    breadcrumbs.push({
      "@type": "ListItem",
      position: 3,
      name: product.productName,
      item: productUrl,
    });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs,
  };

  return [productSchema, breadcrumbSchema];
}