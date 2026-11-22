import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import { SITE_URL, site, OG } from '@/content/site';
import { Header, Footer } from '@/components/SiteChrome';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${site.name} | Medical devices for hospitals and labs in Telangana`, template: `%s | ${site.name}` },
  description: 'Agile Healthcare supplies medical devices to hospitals and labs in Telangana, from Hyderabad, since 2020.',
  applicationName: site.name,
  icons: { icon: [{ url: '/favicon.ico', sizes: '48x48' }, { url: '/icon.svg', type: 'image/svg+xml' }], apple: '/apple-icon.png' },
  openGraph: OG,
  twitter: { card: 'summary_large_image' },
  verification: { google: 'MXXC41JFLG' },
};

export const viewport: Viewport = { themeColor: '#0B0A0A' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${interTight.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
