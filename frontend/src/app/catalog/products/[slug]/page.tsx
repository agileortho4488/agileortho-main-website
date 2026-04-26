import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { getProductBySlug, getAllProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductActions from '@/components/ProductActions';
import TechnicalMatrix from '@/components/TechnicalMatrix';
import SizingWizard from '@/components/SizingWizard';
import RelatedProducts from '@/components/RelatedProducts';
import ProductFAQ from '@/components/ProductFAQ';

import PremiumHeader from '@/components/PremiumHeader';
import TrustStrip from '@/components/TrustStrip';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// SSG: Pre-generate all product paths at build time
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products
    .filter((product: any) => product.slug)
    .map((product: any) => ({
      slug: String(product.slug),
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

  const title = `${product.product_name_display} - Meril Authorized Distributor Telangana`;
  const description = `Clinical data and technical matrix for ${product.product_name_display}. Authorized Meril master franchise in Telangana for ${product.division_canonical}. Explore ${product.category} solutions.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://agileortho.in/catalog/products/${slug}`,
      siteName: 'Agile Healthcare',
    },
    alternates: {
      canonical: `https://agileortho.in/catalog/products/${slug}`,
    },
  };
}

// Division-based clinical render mapping (Cool Surgical Blue assets)
const DIVISION_FALLBACK_IMAGES: Record<string, string> = {
  'Trauma': '/assets/renders/trauma_plate_blue.jpg',
  'Joint Replacement': '/assets/renders/knee_implant_blue.jpg',
  'Peripheral Intervention': '/assets/renders/vascular_blue.jpg',
  'Cardiovascular': '/assets/renders/cardiac_blue.jpg',
  'ENT': '/assets/renders/ent_blue.jpg',
};

const DIVISION_LABELS: Record<string, string> = {
  'Trauma': '🔩 Trauma Fixation',
  'Joint Replacement': '🦿 Arthroplasty',
  'Cardiovascular': '❤️ Cardiovascular',
  'ENT': '👂 ENT Solutions',
  'Peripheral Intervention': '🫀 Peripheral Intervention',
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const rawProduct = await getProductBySlug(slug);

  if (!rawProduct) notFound();

  // DEEP AUDIT FIX: Cast to any to bypass strict JSON-inference issues in Next.js 15
  const product = rawProduct as any;

  // Enhanced MedicalDevice JSON-LD for Clinical Authority
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': ['Product', 'MedicalDevice'],
    name: product.product_name_display,
    description: product.description_live || product.description_shadow,
    brand: { '@type': 'Brand', name: product.parent_brand || 'Meril' },
    category: product.category,
    manufacturer: { '@type': 'Organization', name: 'Meril Life Sciences' },
    material: product.materials_canonical || product.material_canonical,
    clinicalCondition: product.clinical_indications?.join(', '),
    isProprietary: true,
    offers: {
      '@type': 'AggregateOffer',
      offerCount: '1',
      lowPrice: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Medical Catalog', item: 'https://agileortho.in/catalog' },
      { '@type': 'ListItem', position: 2, name: product.division_canonical, item: `https://agileortho.in/catalog/${product.division_canonical?.toLowerCase().replace(/\s+/g, '-')}` },
      { '@type': 'ListItem', position: 3, name: product.product_name_display, item: `https://agileortho.in/catalog/products/${slug}` },
    ],
  };

  // Determine visual style based on division
  const isTrauma = product.division_canonical === 'Trauma';
  const visualStyle = (product.visual_style as 'cool_surgical_blue' | 'default') || 
    (isTrauma ? 'cool_surgical_blue' : 'default');

  // Get brochure-verified or fallback image URL
  const primaryImage = product.images?.[0];
  const hasClinicalImage = Boolean(primaryImage?.storage_path);

  // Has brochure-extracted specs?
  // RELAXED REQUIREMENT: If we have specs, show them even if the verified flag is missing.
  const hasTechMatrix = Boolean(
    (product.technical_specifications && Object.keys(product.technical_specifications).length > 0) || 
    (product.features_list && product.features_list.length > 0)
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <PremiumHeader />
      <TrustStrip />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        {/* Breadcrumb */}
        <nav className="flex mb-10 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
          <span className="mx-2">/</span>
          <Link href={`/catalog/${product.division_canonical.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary transition-colors">
            {product.division_canonical}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white truncate max-w-[200px]">{product.product_name_display}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* Product Visual */}
          <div className="relative group">
            <div className={`absolute -inset-4 rounded-full blur-[80px] opacity-20 transition-opacity group-hover:opacity-40 ${
              visualStyle === 'cool_surgical_blue' ? 'bg-blue-500' : 'bg-primary'
            }`} />
            <div className={`relative aspect-square rounded-[40px] border overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#111] to-[#0A0A0A] ${
              visualStyle === 'cool_surgical_blue' ? 'border-blue-500/20' : 'border-white/10'
            }`}>
              {hasClinicalImage ? (
                <Image
                  src={primaryImage.storage_path.startsWith('/') 
                    ? primaryImage.storage_path 
                    : `https://cdn.agileortho.in/${primaryImage.storage_path}`}
                  alt={product.product_name_display}
                  fill
                  className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                /* Premium Clinical Render Placeholder */
                <div className="w-full h-full flex flex-col items-center justify-center p-12">
                  <div className={`w-32 h-32 rounded-full mb-8 flex items-center justify-center text-5xl ${
                    visualStyle === 'cool_surgical_blue' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-primary/10 border border-primary/20'
                  }`}>
                    {isTrauma ? '🔩' : product.division_canonical === 'Cardiovascular' ? '❤️' : '⚕️'}
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${
                    visualStyle === 'cool_surgical_blue' ? 'text-blue-400' : 'text-primary'
                  }`}>
                    {product.brand || product.manufacturer || 'Meril Life Sciences'}
                  </p>
                  <p className="text-white/20 text-xs mt-2 text-center">{product.category}</p>
                </div>
              )}

              {/* Visual Style Badge */}
              {visualStyle === 'cool_surgical_blue' && (
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Cool Surgical Blue</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Division tag */}
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                visualStyle === 'cool_surgical_blue'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'bg-primary/10 border-primary/20 text-primary'
              }`}>
                {DIVISION_LABELS[product.division_canonical] || product.division_canonical}
              </span>
              <span className="text-muted-foreground text-xs font-mono border-l border-white/10 pl-3">
                REF: {product.sku_code || 'MRL-GEN'}
              </span>
              {product.brochure_intelligence_updated && (
                <span className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-black uppercase tracking-widest">
                  ✓ Brochure Verified
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 leading-tight uppercase italic">
              {product.product_name_display}
            </h1>

            <p className={`text-sm font-black uppercase tracking-[0.2em] mb-6 ${
              visualStyle === 'cool_surgical_blue' ? 'text-blue-400' : 'text-primary'
            }`}>
              {product.brand} · {product.category}
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-white/10 pl-6 italic">
              {product.description_shadow || product.description_live}
            </p>

            {/* Material Badge */}
            {(product.materials_canonical || product.material_canonical) && (
              <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl mb-8 border ${
                visualStyle === 'cool_surgical_blue'
                  ? 'bg-blue-500/5 border-blue-500/20'
                  : 'bg-primary/5 border-primary/20'
              }`}>
                <span className={`text-xs font-black uppercase tracking-widest ${
                  visualStyle === 'cool_surgical_blue' ? 'text-blue-400' : 'text-primary'
                }`}>Material</span>
                <span className="text-sm font-bold text-white">
                  {product.materials_canonical || product.material_canonical}
                </span>
              </div>
            )}

            <ProductActions product={product} />
          </div>
        </div>

        {/* FULL TECHNICAL MATRIX — The Big Differentiator */}
        {hasTechMatrix && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className={`h-[2px] flex-1 ${visualStyle === 'cool_surgical_blue' ? 'bg-blue-500/20' : 'bg-primary/20'}`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${
                visualStyle === 'cool_surgical_blue' ? 'text-blue-400' : 'text-primary'
              }`}>Full Technical Matrix</span>
              <div className={`h-[2px] flex-1 ${visualStyle === 'cool_surgical_blue' ? 'bg-blue-500/20' : 'bg-primary/20'}`} />
            </div>
            <TechnicalMatrix
              productName={product.product_name_display}
              specs={product.technical_specifications || {}}
              materials={product.materials_canonical || product.material_canonical}
              features={(product.features_list && product.features_list.length > 0) ? product.features_list : (product.clinical_benefits || [])}
              indications={product.clinical_indications || []}
              surgicalSteps={product.surgical_steps || []}
              contraindications={product.contraindications || []}
              warnings={product.warnings_and_precautions || []}
              fullTranscript={product.full_raw_transcription || ''}
              visualStyle={visualStyle}
            />
          </div>
        )}
        
        {/* ANATOMICAL SIZING WIZARD — Interactive Clinical Tool */}
        {product.sizing_logic && (
          <div className="mb-16 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className={`h-[2px] flex-1 ${visualStyle === 'cool_surgical_blue' ? 'bg-blue-500/20' : 'bg-primary/20'}`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${
                visualStyle === 'cool_surgical_blue' ? 'text-blue-400' : 'text-primary'
              }`}>Anatomical Sizing Wizard</span>
              <div className={`h-[2px] flex-1 ${visualStyle === 'cool_surgical_blue' ? 'bg-blue-500/20' : 'bg-primary/20'}`} />
            </div>
            <SizingWizard
              productName={product.product_name_display}
              sizingData={product.sizing_logic}
              visualStyle={visualStyle}
            />
          </div>
        )}

        {/* DYNAMIC FAQ PAGE (Featured Snippets SEO) */}
        <ProductFAQ product={product} visualStyle={visualStyle} />

        {/* DYNAMIC INTERNAL LINKING ENGINE (Spiderweb) */}
        <RelatedProducts 
          currentProductSlug={product.slug}
          division={product.division_canonical}
          category={product.category}
          visualStyle={visualStyle}
        />
      </div>
    </div>
  );
}
