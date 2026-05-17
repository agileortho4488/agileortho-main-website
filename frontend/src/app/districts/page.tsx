import React from 'react';
import Link from 'next/link';
import { TELANGANA_DISTRICTS } from '@/data/districts';
import PremiumHeader from '@/components/PremiumHeader';
import { MapPin, ChevronRight, Truck } from 'lucide-react';

export const metadata = {
  title: 'Telangana District Logistics Network | Agile Healthcare',
  description: 'Explore Agile Healthcare\'s extensive distribution network across all 33 districts of Telangana. High-performance surgical supply chain for hospitals and surgeons.',
};

export default function DistrictsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white selection:bg-primary/30 font-body">
      <PremiumHeader />
      
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">State-Wide Infrastructure</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
                Logistics <span className="text-primary">Network.</span>
              </h1>
              <p className="text-xl text-white/60 max-w-2xl font-medium leading-relaxed">
                Hyper-local distribution for 33 districts. We've optimized the surgical supply chain to ensure life-saving medical devices are never more than 6 hours away.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="text-3xl font-black font-mono tracking-tighter italic">33/33</div>
                <div className="text-[9px] font-black uppercase tracking-[0.4em]">Districts Active</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TELANGANA_DISTRICTS.map((district) => (
              <Link 
                key={district} 
                href={`/districts/${district.toLowerCase().replace(/ /g, '-')}`}
                className="group relative p-8 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/50 hover:bg-white/10 transition-all flex items-center justify-between overflow-hidden"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <MapPin className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                  <span className="font-bold uppercase tracking-tighter text-lg">{district}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all relative z-10" />
                
                {/* Hover Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 bg-black text-center">
        <div className="text-2xl font-black tracking-tighter uppercase italic mb-4">AGILE <span className="text-primary">HEALTHCARE</span></div>
        <p className="text-white/20 text-xs uppercase tracking-[0.3em]">The Surgical Operating System of Telangana</p>
      </footer>
    </main>
  );
}
