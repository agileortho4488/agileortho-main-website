import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://agilehealthcare.in';
  const products = await getAllProducts();

  // 1. Static Core Pages
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

  // 2. Dynamic Division Pages (Auto-extracted from Database)
  const uniqueDivisions = [...new Set(products.map((p: any) => 
    p.division_canonical?.toLowerCase().replace(/\s+/g, '-')
  ))].filter(Boolean);

  // Add common aliases to ensure full indexing
  if (!uniqueDivisions.includes('arthroplasty')) uniqueDivisions.push('arthroplasty');

  const divisionPages = uniqueDivisions.map((div) => ({
    url: `${baseUrl}/catalog/${div}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Product Pages (1,200+ Clinical Specs)
  const productPages = products
    .filter((p: any) => p.slug)
    .map((product: any) => ({
      url: `${baseUrl}/catalog/products/${product.slug}`,
      lastModified: new Date(product.last_updated || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // 4. District Pages (Local SEO Hubs)
  const districts = [
    'hyderabad', 'warangal', 'nizamabad', 'karimnagar', 'khammam', 'mahbubnagar', 
    'adilabad', 'bhadradri-kothagudem', 'hanumakonda', 'jagtial', 'jangaon', 
    'jayashankar-bhupalpally', 'jogulamba-gadwal', 'kamareddy', 'kumuram-bheem-asifabad', 
    'mahabubabad', 'mancherial', 'medak', 'medchal-malkajgiri', 'mulugu', 
    'nagarkurnool', 'nalgonda', 'narayanpet', 'nirmal', 'peddapalli', 
    'rajanna-sircilla', 'rangareddy', 'sangareddy', 'siddipet', 'suryapet', 
    'vikarabad', 'wanaparthy', 'yadadri-bhuvanagiri'
  ];
  
  const districtPages = districts.map((district) => ({
    url: `${baseUrl}/districts/${district}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...divisionPages, ...productPages, ...districtPages];
}
