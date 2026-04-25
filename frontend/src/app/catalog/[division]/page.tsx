import React from 'react';
import Link from 'next/link';
import { getAllProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import { DIVISION_SEO_CONTENT } from '@/lib/seoContent';

interface DivisionPageProps {
  params: Promise<{ division: string }>;
}

const DIVISION_META: Record<string, { emoji: string; color: string; tagline: string; bg: string }> = {
  'trauma':                { emoji: '🦴', color: '#3b82f6', bg: 'from-blue-950/40 to-[#0A0A0A]',     tagline: 'Fracture Management & Fixation Systems' },
  'joint-replacement':     { emoji: '🦿', color: '#a78bfa', bg: 'from-violet-950/40 to-[#0A0A0A]',   tagline: 'Arthroplasty & Reconstruction Solutions' },
  'cardiovascular':        { emoji: '❤️', color: '#f43f5e', bg: 'from-rose-950/40 to-[#0A0A0A]',     tagline: 'Stents, THV & Cardiac Interventions' },
  'diagnostics':           { emoji: '🧪', color: '#10b981', bg: 'from-emerald-950/40 to-[#0A0A0A]',  tagline: 'IVD Tests, Analyzers & Lab Equipment' },
  'endo-surgical':         { emoji: '🔬', color: '#f59e0b', bg: 'from-amber-950/40 to-[#0A0A0A]',    tagline: 'Staplers, Trocars & Laparoscopic Devices' },
  'endo surgery':          { emoji: '🔬', color: '#f59e0b', bg: 'from-amber-950/40 to-[#0A0A0A]',    tagline: 'Minimally Invasive Surgical Instruments' },
  'infection prevention':  { emoji: '🛡️', color: '#06b6d4', bg: 'from-cyan-950/40 to-[#0A0A0A]',    tagline: 'Antiseptics, Sterilization & Wound Care' },
  'instruments':           { emoji: '✂️', color: '#94a3b8', bg: 'from-slate-800/40 to-[#0A0A0A]',    tagline: 'Precision OT Instruments & Accessories' },
  'sports medicine':       { emoji: '⚡', color: '#f97316', bg: 'from-orange-950/40 to-[#0A0A0A]',   tagline: 'Arthroscopy & Soft Tissue Fixation' },
  'ent':                   { emoji: '👂', color: '#8b5cf6', bg: 'from-purple-950/40 to-[#0A0A0A]',   tagline: 'Ear, Nose & Throat Surgical Systems' },
  'urology':               { emoji: '💧', color: '#0ea5e9', bg: 'from-sky-950/40 to-[#0A0A0A]',      tagline: 'Stents, Stone Management & Endoscopy' },
  'critical care':         { emoji: '🏥', color: '#ef4444', bg: 'from-red-950/40 to-[#0A0A0A]',      tagline: 'ICU Consumables & Life Support Supplies' },
  'peripheral intervention': { emoji: '💉', color: '#14b8a6', bg: 'from-teal-950/40 to-[#0A0A0A]',  tagline: 'Peripheral Stents & Vascular Access Devices' },
  'robotics':              { emoji: '🤖', color: '#e879f9', bg: 'from-fuchsia-950/40 to-[#0A0A0A]',  tagline: 'Surgical Navigation & Robotic Systems' },
  'spine':                 { emoji: '🧬', color: '#84cc16', bg: 'from-lime-950/40 to-[#0A0A0A]',     tagline: 'Fusion Implants & Motion Preservation' },
};

export async function generateStaticParams() {
  const products = await getAllProducts();
  const divisions = new Set(
    products.map((p: any) => p.division_canonical?.toLowerCase().replace(/\s+/g, '-')).filter(Boolean)
  );
  return Array.from(divisions).map((division) => ({ division }));
}

export async function generateMetadata({ params }: DivisionPageProps) {
  const { division } = await params;
  const meta = DIVISION_META[division.toLowerCase()];
  const divisionName = division.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${divisionName} Medical Devices in Telangana | Agile Healthcare`,
    description: `Browse ${divisionName} products from Meril Life Sciences — ${meta?.tagline || 'premium medical devices'}. Authorized distributor across all 33 districts of Telangana.`,
    alternates: { canonical: `https://agileortho.in/catalog/${division}` },
  };
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { division } = await params;
  const products = await getAllProducts();
  const filteredProducts = products.filter(
    (p: any) => p.division_canonical?.toLowerCase().replace(/\s+/g, '-') === division.toLowerCase()
  );

  if (filteredProducts.length === 0) notFound();

  const divisionName = filteredProducts[0].division_canonical;
  const seoData = DIVISION_SEO_CONTENT[division.toLowerCase()];
  const meta = DIVISION_META[division.toLowerCase()] || { emoji: '📦', color: '#fff', bg: 'from-gray-900/40 to-[#0A0A0A]', tagline: 'Medical Devices' };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://agileortho.in' },
            { '@type': 'ListItem', position: 2, name: 'Catalog', item: 'https://agileortho.in/catalog' },
            { '@type': 'ListItem', position: 3, name: divisionName, item: `https://agileortho.in/catalog/${division}` },
          ],
        })}}
      />

      {/* ── DIVISION HERO BANNER ── */}
      <div className={`relative bg-gradient-to-b ${meta.bg} pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden`}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-20"
            style={{ background: meta.color }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex mb-10 text-sm text-white/40" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/catalog" className="hover:text-white transition-colors">Catalog</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{divisionName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              {/* Division badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border mb-6"
                style={{ borderColor: `${meta.color}40`, background: `${meta.color}10` }}>
                <span className="text-2xl">{meta.emoji}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: meta.color }}>
                  Meril Life Sciences · {divisionName}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase mb-4">
                {divisionName}
              </h1>
              <p className="text-lg text-white/50 font-medium">{meta.tagline}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-4xl font-black" style={{ color: meta.color }}>{filteredProducts.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Products</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-4xl font-black" style={{ color: meta.color }}>33</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Districts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick filter strip */}
        <div className="flex items-center justify-between mb-10">
          <p className="text-sm text-white/40">
            Showing <span className="text-white font-bold">{filteredProducts.length}</span> products in {divisionName}
          </p>
          <a
            href={`https://wa.me/917416521222?text=Hi, I need a bulk quote for ${divisionName} products from Agile Healthcare.`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-all"
          >
            WhatsApp Bulk Quote →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product: any) => (
            <Link
              key={product.slug}
              href={`/catalog/products/${product.slug}`}
              className="group relative bg-[#111] border border-white/5 rounded-2xl overflow-hidden flex flex-col hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ ['--hover-color' as any]: meta.color }}
            >
              {/* Image / Icon area */}
              <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden"
                style={{ background: `${meta.color}08` }}>
                {product.images?.[0]?.storage_path ? (
                  <img
                    src={product.images[0].storage_path}
                    alt={product.product_name_display}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
                    {meta.emoji}
                  </span>
                )}
                {/* Category pill */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                  style={{ background: `${meta.color}20`, color: meta.color }}>
                  {product.category?.split(' ').slice(0, 3).join(' ') || divisionName}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-bold text-sm text-white leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
                  {product.product_name_display}
                </h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">
                  {product.brand || product.manufacturer || 'Meril Life Sciences'}
                </p>
                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/20">{product.sku_code || 'MRL-' + division.substring(0,4).toUpperCase()}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1"
                    style={{ color: meta.color }}>
                    View Specs →
                  </span>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background: meta.color }} />
            </Link>
          ))}
        </div>

        {/* ── CLINICAL SEO BLOCK ── */}
        {seoData && (
          <div className="mt-24 pt-16 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] w-12" style={{ background: meta.color }} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: meta.color }}>
                  Clinical Authority
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-white mb-8">{seoData.title}</h2>
              <div className="space-y-5">
                {seoData.content.map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed">{paragraph}</p>
                ))}
              </div>
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/917416521222?text=Hi, I need information about ${divisionName} products from Agile Healthcare, Telangana.`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#25D366] text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  WhatsApp Our {divisionName} Specialist
                </a>
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 text-white/60 font-black text-xs uppercase tracking-widest hover:border-white/30 hover:text-white transition-all"
                >
                  ← Full Catalog
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
