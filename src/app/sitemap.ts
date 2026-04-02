import type { MetadataRoute } from 'next';
import { productsService } from '@/services/productsService';
import { categoryService } from '@/services/categoryService';

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

  // ✅ 2. Fetch categories
  const categoryData = await categoryService.fetchCategories();
  const categories = categoryData.categories;

  for (const category of categories) {
    urls.push({
      url: `${baseUrl}/all-products?parentCategorySlug=${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // ✅ 3. Fetch products in this category
    // productsService doesn't have a direct fetch with mode=seo in the current wrapper, 
    // but fetchProducts handles it. Let's use fetchProducts or add a specific one.
    // Actually, fetchProducts returns ProductsResponse which has .data
    const productData = await productsService.fetchProducts({ categorySlug: category.slug, page: 1, limit: 100, mode: 'seo' });
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
