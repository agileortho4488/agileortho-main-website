import type { Metadata } from 'next';
import Script from 'next/script';
import '../index.css';
import ClientSideWidgets from '../components/ClientSideWidgets';
import AgileAIWidget from '../components/AgileAIWidget';

export const metadata: Metadata = {
  title: {
    default: 'Agile Healthcare | Meril Life Sciences Distributor Telangana',
    template: '%s | Agile Healthcare',
  },
  description:
    'Authorized Meril Life Sciences master franchise distributor for Telangana. 967+ medical devices across Trauma, Joint Replacement, Cardiovascular, Diagnostics & 9 more clinical divisions.',
  metadataBase: new URL('https://agilehealthcare.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://agilehealthcare.in',
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
      'Authorized Meril Life Sciences master franchise distributor for Telangana. 967+ medical devices across 13 clinical divisions.',
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
    streetAddress: 'Meril Park, Survey No. 135/2/B',
    addressLocality: 'Vapi',
    addressRegion: 'Gujarat',
    postalCode: '396191',
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
    numberOfItems: 1224,
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
    <html lang="en">
      <head>
        {/* Preconnect for Google Fonts (already in CSS, but speeds up first paint) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD LocalBusiness schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <ClientSideWidgets />
        <AgileAIWidget />

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2ET2JES71R"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2ET2JES71R');
          `}
        </Script>
      </body>
    </html>
  );
}
