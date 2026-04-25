import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://agileortho.in';

  // 1. Static Pages
  const staticPages = [
    '',
    '/catalog',
    '/districts',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }));

  // 2. Division Pages (The 50+ Verticals Clusters)
  const divisions = ['trauma', 'arthroplasty', 'cardiovascular', 'neuro', 'endo-surgical', 'urology', 'aesthetics'];
  const divisionPages = divisions.map((div) => ({
    url: `${baseUrl}/divisions/${div}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Product Pages (1,200+ Programmatic SEO targets)
  const products = await getAllProducts();
  const productPages = products.map((product: any) => ({
    url: `${baseUrl}/catalog/products/${product.slug}`,
    lastModified: new Date(product.last_updated || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...divisionPages, ...productPages];
}
