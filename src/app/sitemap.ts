import type { MetadataRoute } from 'next';
import { productsService } from '@/services/productsService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  try {
    // ✅ 2. Fetch categories
    const categoryData = await productsService.fetchAllCategories();
    const categories = categoryData.categories || [];

    for (const category of categories) {
      urls.push({
        url: `${baseUrl}/all-products?parentCategorySlug=${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });

      // ✅ 3. Fetch products in this category
      try {
        const productData = await productsService.fetchProducts({ categorySlug: category.slug, page: 1, limit: 100, mode: 'seo' });
        const products = productData.data || [];
        for (const product of products) {
          urls.push({
            url: `${baseUrl}/product-detail/${product.seo.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      } catch (productError) {
        console.error(`Error fetching products for category ${category.slug} during sitemap generation:`, productError);
        // Continue with other categories
      }
    }
  } catch (error) {
    console.error("Error generating dynamic sitemap paths during build:", error);
    // Return at least the static paths which are already in `urls`
  }

  return urls;
}
