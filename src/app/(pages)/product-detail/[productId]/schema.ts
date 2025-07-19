// Server utility: JSON‑LD schema only
export function generateProductSchema(product: any) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.productName,
    image: product.images.map((img: any) => img.src),
    description: product.seo.metaDescription,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "PakShipperSore",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.salePrice,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `https://pakshipper.com/product-detail/${product._id}`,
    },
  };
}
