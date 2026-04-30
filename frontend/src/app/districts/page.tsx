import React from 'react';
import Link from 'next/link';
import { TELANGANA_DISTRICTS } from '@/lib/districts';
import PremiumHeader from '@/components/PremiumHeader';
import { MapPin, ChevronRight, Users, Hospital, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: "Medical Device Supply Across 33 Districts of Telangana | Agile Healthcare",
  description: "Authorized Meril Life Sciences distributor serving all 33 districts of Telangana. Reliable medical device supply, clinical support, and OT assistance across the state.",
};

export default function DistrictsIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://agilehealthcare.in' },
          { '@type': 'ListItem', position: 2, name: 'Districts' }
        ]
      },
      {
        '@type': 'ItemList',
        name: 'Medical Device Supply Districts in Telangana',
        description: 'Comprehensive medical device supply and clinical support across all districts of Telangana.',
        itemListElement: TELANGANA_DISTRICTS.map((d, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `https://agilehealthcare.in/districts/${d.slug}`,
          name: d.name
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30">
      <PremiumHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-6 animate-fade-up">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">State-Wide Presence</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] mb-8 animate-fade-up stagger-1">
              Serving All <br />
              <span className="text-gradient-gold">33 Districts.</span>
            </h1>
            <p className="text-xl text-white/40 max-w-2xl leading-relaxed animate-fade-up stagger-2">
              From our central logistics hub in Hyderabad, we provide 24/7 medical device supply and clinical engineering support to hospitals across the entire Telangana landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Stats / Features Row */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <Users className="w-6 h-6 text-primary" />
             </div>
             <div>
                <div className="text-xl font-black">3.8 Cr+</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Population Served</div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <Hospital className="w-6 h-6 text-primary" />
             </div>
             <div>
                <div className="text-xl font-black">2,500+</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Healthcare Units</div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <ShieldCheck className="w-6 h-6 text-primary" />
             </div>
             <div>
                <div className="text-xl font-black">100%</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Meril Authorized</div>
             </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TELANGANA_DISTRICTS.map((d: any, idx: number) => (
              <Link
                key={d.slug}
                href={`/districts/${d.slug}`}
                className="group p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500 animate-fade-up relative overflow-hidden"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Hover Background Accent */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-black tracking-tight group-hover:text-white transition-colors mb-2 uppercase italic">{d.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-4">{d.tagline}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                    {d.medicalFocus.slice(0, 3).map((f: string) => (
                      <span key={f} className="text-[9px] font-black uppercase tracking-widest text-white/20 bg-white/5 px-2.5 py-1 rounded-full group-hover:text-white/40 group-hover:bg-white/10 transition-colors">{f}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
