import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { getProductBySlug, getAllProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductActions from '@/components/ProductActions';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// SSG: Pre-generate all 967+ product paths at build time
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product: any) => ({
    slug: product.slug,
  }));
}

// SEO: Dynamic Metadata generation
export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.seo_meta_title || `${product.product_name_display} | Agile Healthcare`,
    description: product.seo_meta_description || product.description_live,
    openGraph: {
      title: product.seo_meta_title,
      description: product.seo_meta_description,
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // JSON-LD for Richest Search Results
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.product_name_display,
    image: product.images?.[0]?.storage_path,
    description: product.description_live || product.description_shadow,
    brand: {
      '@type': 'Brand',
      name: product.parent_brand || 'Meril',
    },
    category: product.category,
    manufacturer: {
      '@type': 'Organization',
      name: product.manufacturer || 'Meril Life Sciences',
    },
    offers: {
      '@type': 'AggregateOffer',
      offerCount: '1',
      lowPrice: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <nav className="flex mb-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{product.division_canonical}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Section */}
          <div className="relative group">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 overflow-hidden flex items-center justify-center">
               {/* Using a placeholder-style design that looks premium for now */}
               <div className="text-center p-8">
                 <div className="text-8xl mb-4 group-hover:scale-110 transition-transform duration-500">
                    {product.division_canonical === 'Cardiovascular' ? '❤️' : 
                     product.division_canonical === 'Trauma' ? '🦴' : '📦'}
                 </div>
                 <p className="text-muted-foreground text-sm uppercase tracking-widest">
                   {product.brand || product.manufacturer}
                 </p>
               </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-5xl font-bold font-heading mb-2 text-gradient-gold">
              {product.product_name_display}
            </h1>
            
            <p className="text-xl font-medium text-primary/80 mb-6 font-heading tracking-wide uppercase text-sm">
              {product.clinical_subtitle || `${product.brand} ${product.division_canonical} System`}
            </p>

            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                {product.division_canonical}
              </span>
              <span className="text-muted-foreground text-xs font-mono border-l border-white/10 pl-4">
                REF: {product.sku_code || 'MRL-GEN-001'}
              </span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-primary/30 pl-6 italic">
              {product.description_live || product.description_shadow}
            </p>

            {/* Technical Specifications Hub */}
            <div className="mb-10">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-4 flex items-center">
                <span className="w-8 h-[1px] bg-primary mr-3"></span>
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.technical_specifications || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-sm font-medium">
                      {Array.isArray(value) 
                        ? value.join(', ') 
                        : (typeof value === 'object' && value !== null 
                            ? Object.entries(value).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(' | ') 
                            : String(value))}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-muted-foreground">Manufacturer</span>
                  <span className="text-sm font-medium">{product.manufacturer}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-muted-foreground">Material</span>
                  <span className="text-sm font-medium">{product.material_canonical || "Medical Grade"}</span>
                </div>
              </div>
            </div>

            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
