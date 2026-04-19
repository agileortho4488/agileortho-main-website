import React from 'react';
import Link from 'next/link';
import { TELANGANA_DISTRICTS } from '@/lib/districts';

export const metadata = {
  title: "Medical Device Supply Across 33 Districts of Telangana",
  description: "Agile Ortho serves hospitals, clinics, and diagnostic centers across all 33 districts of Telangana with authorized Meril Life Sciences medical devices. Find your district for localized supply and support.",
};

export default function DistrictsIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL || 'https://agileortho.in' },
      { '@type': 'ListItem', position: 2, name: 'Districts' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="bg-[#0D0D0D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <nav className="flex items-center gap-1.5 text-sm text-white/45 mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">Districts</span>
          </nav>

          <div className="max-w-3xl">
            <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Pan-Telangana Coverage</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-heading">
              Medical Device Supply Across All 33 Districts
            </h1>
            <p className="mt-5 text-lg text-white/35 leading-relaxed max-w-2xl">
              Authorized Meril Life Sciences distributor serving hospitals, clinics, and diagnostic centers across every district in Telangana with fast dispatch from Hyderabad.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TELANGANA_DISTRICTS.map((d: any) => (
              <Link
                key={d.slug}
                href={`/districts/${d.slug}`}
                className="group bg-[#0A0A0A] border border-white/[0.06] rounded-xl p-6 hover:border-[#2DD4BF]/20 hover:shadow-[0_0_15px_rgba(45,212,191,0.1)] transition-all flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center text-xl">
                    📍
                  </div>
                  <span className="text-xs font-bold text-white/45 bg-white/5 px-2.5 py-1 rounded-full">
                    {d.population}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg group-hover:text-[#2DD4BF] transition-colors">{d.name}</h3>
                <p className="text-xs text-[#2DD4BF] font-medium mt-1 mb-4">{d.tagline}</p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {d.medicalFocus.slice(0, 3).map((f: string) => (
                    <span key={f} className="text-[10px] font-medium text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                  {d.medicalFocus.length > 3 && (
                    <span className="text-[10px] font-medium text-white/45 bg-white/5 px-2 py-0.5 rounded-full">+{d.medicalFocus.length - 3} more</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
