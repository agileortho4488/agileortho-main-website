import React from 'react';
import Link from 'next/link';
import { getAllProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import { DIVISION_SEO_CONTENT } from '@/lib/seoContent';

interface DivisionPageProps {
  params: Promise<{ division: string }>;
}

// SSG: Pre-generate all 13 clinical division paths
export async function generateStaticParams() {
  const products = await getAllProducts();
  const divisions = new Set(products.map((p: any) => p.division_canonical?.toLowerCase().replace(/\s+/g, '-')).filter(Boolean));
  return Array.from(divisions).map((division) => ({
    division,
  }));
}

export async function generateMetadata({ params }: DivisionPageProps) {
  const { division } = await params;
  const divisionName = division.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${divisionName} | Agile Healthcare Meril Products`,
    description: `Browse the full catalog of Meril Life Sciences ${divisionName} medical devices available in Telangana through Agile Healthcare.`,
    alternates: {
      canonical: `https://agileortho.in/catalog/${division}`,
    },
  };
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { division } = await params;
  const products = await getAllProducts();
  const filteredProducts = products.filter(
    (p: any) => p.division_canonical?.toLowerCase().replace(/\s+/g, '-') === division.toLowerCase()
  );

  if (filteredProducts.length === 0) {
    notFound();
  }

  const divisionName = filteredProducts[0].division_canonical;
  const seoData = DIVISION_SEO_CONTENT[division.toLowerCase()];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://agileortho.in' },
            { '@type': 'ListItem', position: 2, name: 'Catalog', item: 'https://agileortho.in/catalog' },
            { '@type': 'ListItem', position: 3, name: divisionName, item: `https://agileortho.in/catalog/${division}` },
          ]
        })}}
      />
      <div className="max-w-7xl mx-auto">
        <nav className="flex mb-8 text-sm text-muted-foreground">
          <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{divisionName}</span>
        </nav>

        <header className="mb-12">
          <h1 className="text-4xl font-bold font-heading text-gradient-gold mb-4">
            {divisionName}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Showing {filteredProducts.length} high-precision products from the {divisionName} division of Meril Life Sciences.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <Link 
              key={product.slug} 
              href={`/catalog/products/${product.slug}`}
              className="group card-premium p-4 rounded-xl flex flex-col h-full"
            >
              <div className="aspect-square rounded-lg bg-white/5 mb-4 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
                {product.division_canonical === 'Cardiovascular' ? '❤️' : 
                 product.division_canonical === 'Trauma' ? '🦴' : 
                 product.division_canonical === 'Joint Replacement' ? '🦿' :
                 product.division_canonical === 'Endo-Surgical' ? '🔬' :
                 product.division_canonical === 'Diagnostics' ? '🧪' :
                 product.division_canonical === 'Infection Prevention' ? '🛡️' :
                 product.division_canonical === 'Surgical Instruments' ? '✂️' :
                 product.division_canonical === 'Sports Medicine' ? '⚡' :
                 product.division_canonical === 'ENT' ? '👂' :
                 product.division_canonical === 'Urology' ? '💧' :
                 product.division_canonical === 'Critical Care' ? '🏥' :
                 product.division_canonical === 'Peripheral Intervention' ? '💉' : '📦'}
              </div>
              <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {product.product_name_display}
              </h2>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                {product.brand || product.manufacturer}
              </p>
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">SKU: {product.sku_code || 'MRL-GEN'}</span>
                <span className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Detail
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CLINICAL SEO BLOCK */}
        {seoData && (
          <div className="mt-24 pt-12 border-t border-white/10 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-heading text-white mb-6">
              {seoData.title}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              {seoData.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
