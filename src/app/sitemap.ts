import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pakshipper.com';
  const urls: MetadataRoute.Sitemap = [];

  // ✅ 1. Static paths
  const staticPaths = ['', '/about-us', '/contact-us'];
  staticPaths.forEach((path) => {
    urls.push({
      url: `${baseUrl}${path === '' ? '' : `/pages${path}`}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'weekly' : 'monthly',
      priority: path === '' ? 1.0 : 0.8,
    });
  });

  // ✅ 2. Fetch categories
  const categoriesRes = await fetch('https://e-commerce-backend-seven-xi.vercel.app/api/categories/all-parent');
  const categoryData = await categoriesRes.json();
  const categories = categoryData.categories;

  for (const category of categories) {
    urls.push({
      url: `${baseUrl}/pages/all-products?parent-category-id=${category._id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // ✅ 3. Fetch products in this category
    const productsRes = await fetch(`https://e-commerce-backend-seven-xi.vercel.app/api/products/get-all-products?parentCategoryID=${category._id}`);
    const productData = await productsRes.json();

    for (const product of productData.data) {
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
