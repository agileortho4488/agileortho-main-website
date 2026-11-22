import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Agile Healthcare',
    short_name: 'Agile Healthcare',
    description: 'Medical devices for hospitals and labs in Telangana.',
    start_url: '/',
    display: 'browser',
    background_color: '#0B0A0A',
    theme_color: '#0B0A0A',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  };
}
