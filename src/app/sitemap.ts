// app/sitemap.ts (Next.js 13+)
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pakshipper.com';
  const urls: MetadataRoute.Sitemap = [];

  // 1. Add homepage and static pages
  const staticPaths = ['', '/about-us', '/contact-us'];
  staticPaths.forEach((path) => {
    urls.push({
      url: `${baseUrl}/pages${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'weekly' : 'monthly',
      priority: path === '' ? 1.0 : 0.8,
    });
  });

  // 2. Fetch all parent categories
  const categories = await fetch(
    'https://e-commerce-backend-seven-xi.vercel.app/api/categories/all-parent'
  ).then(res => res.json());

  for (const category of categories) {
    // 3. Add each category page (assuming route /category/[id])
    urls.push({
      url: `${baseUrl}/pages/all-products?parent-category-id=${encodeURIComponent(category._id)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // 4. Fetch products for this category
    const products = await fetch(
      `https://e-commerce-backend-seven-xi.vercel.app/api/products/get-all-products?parentCategoryID=${category._id}`
    ).then(res => res.json());

    // 5. Add each product page (route /product/[productId])
    for (const product of products) {
      urls.push({
        url: `${baseUrl}/pages/product-detail/${product._id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return urls;
}
