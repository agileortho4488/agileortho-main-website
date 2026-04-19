import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/data';
import { TELANGANA_DISTRICTS } from '@/lib/districts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agileortho.in';

  // 1. Static Pages
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/catalog',
    '/districts',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Fetch all products
  const products = await getAllProducts();

  // 3. Product Pages (967+)
  const productRoutes = products.map((product: any) => ({
    url: `${baseUrl}/catalog/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // 4. Division Pages (13)
  const divisions = new Set(
    products.map((p: any) => p.division_canonical?.toLowerCase()).filter(Boolean)
  );
  
  const divisionRoutes = Array.from(divisions).map((division) => ({
    url: `${baseUrl}/catalog/${division}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 5. District Pages (33)
  const districtRoutes = TELANGANA_DISTRICTS.map((d: any) => ({
    url: `${baseUrl}/districts/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...divisionRoutes, ...productRoutes, ...districtRoutes];
}
