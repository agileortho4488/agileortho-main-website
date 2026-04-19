import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Agile Healthcare | Authorized Meril Life Sciences Master Distributor Telangana',
  description: 'Primary master franchise distributor for Meril Life Sciences in Telangana. Serving 33 districts with world-class medical devices in Trauma, Cardiovascular, and 11 other clinical divisions.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-[#B8860B]/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight mb-6">
            <span className="block">Agile</span>
            <span className="text-gradient-gold">Healthcare</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed font-heading">
            Authorized Master Distributor of <span className="text-white font-bold">Meril Life Sciences</span> for Telangana. 
            Empowering hospitals with 967+ world-class medical devices across 13 clinical divisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/catalog" className="btn-primary py-4 px-10 rounded-full font-bold text-sm uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.3)] min-w-[280px]">
              Explore Product Catalog
            </Link>
            <button className="py-4 px-10 rounded-full bg-white/5 border border-white/10 font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all min-w-[280px]">
              Join Distribution Network
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Verified Products', value: '967+' },
            { label: 'Districts Served', value: '33' },
            { label: 'Clinical Divisions', value: '13' },
            { label: 'Authorized Partner', value: 'Meril' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-primary mb-1">{stat.value}</div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Division Teaser */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl text-left">
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Precision Mastery across <span className="text-primary">Medical Divisions</span></h2>
              <p className="text-muted-foreground">From Orthopedics to Cardiovascular, we provide the complete portfolio for healthcare excellence in Telangana.</p>
            </div>
            <Link href="/catalog" className="text-primary text-sm font-bold uppercase tracking-widest flex items-center hover:translate-x-2 transition-transform">
              View All Divisions
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Trauma', desc: 'Anatomical plating systems and intramedullary nails.', icon: '🦴' },
              { title: 'Cardiovascular', desc: 'World-class heart valves and coronary stents.', icon: '❤️' },
              { title: 'Diagnostics', desc: 'Advanced laboratory analyzers and rapid test kits.', icon: '🔬' },
            ].map((div, i) => (
              <div key={i} className="card-premium p-8 rounded-2xl group cursor-pointer text-left">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{div.icon}</div>
                <h3 className="text-xl font-bold mb-3">{div.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{div.desc}</p>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Teaser */}
      <footer className="py-20 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-muted-foreground text-sm mb-4 tracking-widest uppercase">Trusted Partner</p>
            <div className="text-3xl font-black text-white/20 mb-12 tracking-tighter uppercase italic">Meril Life Sciences</div>
            <p className="text-xs text-muted-foreground">© 2026 Agile Healthcare. Authorized Master Franchise Distributor for Telangana.</p>
        </div>
      </footer>
    </main>
  );
}
