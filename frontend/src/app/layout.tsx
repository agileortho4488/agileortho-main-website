import type { Metadata } from 'next';
import { Sora, Inter, JetBrains_Mono } from 'next/font/google';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import AIChatWidget from '@/components/AIChatWidget';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

import SmoothScroll from '../components/SmoothScroll';

import ClientWidgetWrapper from '../components/ClientWidgetWrapper';
import '../index.css';

export const metadata: Metadata = {
  title: {
    default: 'Agile Healthcare | Meril Life Sciences Distributor Telangana',
    template: '%s | Agile Healthcare',
  },
  description:
    'Authorized Meril Life Sciences master franchise distributor for Telangana. 7,100+ active SKUs across Trauma, General Surgery, OT Solutions, Diagnostics, Sports Medicine, Joint Replacement and 4 more clinical divisions.',
  metadataBase: new URL('https://www.agilehealthcare.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.agilehealthcare.in',
    siteName: 'Agile Healthcare',
    images: [
      {
        url: '/agile_healthcare_logo.png',
        width: 1200,
        height: 630,
        alt: 'Agile Healthcare — Meril Life Sciences Distributor Telangana',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agile Healthcare | Meril Life Sciences Distributor Telangana',
    description:
      'Authorized Meril Life Sciences master franchise distributor for Telangana. 7,100+ active SKUs across 10 clinical divisions.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'MXXC41JFLG',
  },
  alternates: {
    canonical: 'https://agilehealthcare.in',
  },
};

// LocalBusiness JSON-LD — tells Google exactly who you are
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'Agile Healthcare',
  alternateName: 'AgileHealthcare',
  description:
    'Authorized Meril Life Sciences master franchise distributor for all 33 districts of Telangana, India. Specializing in Trauma, Joint Replacement, Cardiovascular, Endo-Surgical, and Diagnostic medical devices.',
  url: 'https://agilehealthcare.in',
  telephone: '+918500204488',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Agile House, H.No 8-2-293/82/A/1261, Road No 36, Jubilee Hills',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500033',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '20.3717',
    longitude: '72.9106'
  },
  areaServed: {
    '@type': 'State',
    name: 'Telangana',
  },
  knowsAbout: [
    'Orthopedic Trauma',
    'Arthroplasty',
    'Interventional Cardiology',
    'Clinical Diagnostics',
    'Endo-Surgery',
    'Dental Implantology',
    'Sleep Apnea Therapy'
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Meril Life Sciences Medical Devices',
    numberOfItems: 7100,
  },
  sameAs: [
    'https://wa.me/917416521222',
    'https://agilehealthcare.in',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrains.variable}`}>
      <head>
        {/* JSON-LD LocalBusiness schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="antialiased font-body">
        <SmoothScroll />
        {children}
        <ClientWidgetWrapper />

        {/* Global Clinical AI Agent for Lead Capture */}
        <AIChatWidget />

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2ET2JES71R"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2ET2JES71R');
          `}
        </Script>

        {/* Meta (Facebook/Instagram) Pixel — activates only when NEXT_PUBLIC_META_PIXEL_ID is set */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <>
            <Script id="meta-pixel" strategy="lazyOnload">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img height="1" width="1" style={{ display: 'none' }} alt=""
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`} />
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}
