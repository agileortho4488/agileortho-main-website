import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/content/site';
import { departments } from '@/content/departments';
import { devicePages } from '@/content/devices';

export const dynamic = 'force-static';

// A fixed content date, not the build time (a date that moves on every build teaches search engines to ignore it).
// Change it when the page content changes.
const UPDATED = '2026-11-22';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '/', '/devices', '/how-we-deliver', '/about', '/contact', '/privacy', '/terms',
    ...departments.map(d => `/departments/${d.slug}`),
    ...devicePages.map(d => `/devices/${d.slug}`),
  ];
  return pages.map(p => ({ url: p === '/' ? SITE_URL : `${SITE_URL}${p}`, lastModified: UPDATED }));
}
