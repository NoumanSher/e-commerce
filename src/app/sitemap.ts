import type { MetadataRoute } from 'next';
import { BASE_URL_LIVE } from '@/appConst/appConst';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // const baseUrl = "http://localhost:3000";

  const baseUrl = 'https://pakshipper.com';
  const urls: MetadataRoute.Sitemap = [];

  // ✅ 1. Static paths
  const staticPaths = ['', '/about-us', '/contact-us'];
  staticPaths.forEach((path) => {
    urls.push({
      url: `${baseUrl}${path === '' ? '' : `${path}`}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'weekly' : 'monthly',
      priority: path === '' ? 1.0 : 0.8,
    });
  });

  // ✅ 2. Fetch categories
  const categoriesRes = await fetch(`${BASE_URL_LIVE}/categories/all-parent`);
  const categoryData = await categoriesRes.json();
  const categories = categoryData.categories;

  for (const category of categories) {
    urls.push({
      url: `${baseUrl}/all-products?parentCategorySlug=${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // ✅ 3. Fetch products in this category
    const productsRes = await fetch(`${BASE_URL_LIVE}/products/get-all-products?parentCategorySlug=${category.slug}`);
    const productData = await productsRes.json();

    for (const product of productData.data) {
      urls.push({
        url: `${baseUrl}/product-detail/${product.seo.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return urls;
}
