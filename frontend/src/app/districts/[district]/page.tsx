import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { TELANGANA_DISTRICTS } from '@/data/districts';
import PremiumHeader from '@/components/PremiumHeader';
import { MapPin, Truck, Zap, ShieldCheck, ArrowLeft, Heart, Activity, Stethoscope } from 'lucide-react';

interface Props {
  params: Promise<{ district: string }>;
}

export async function generateStaticParams() {
  return TELANGANA_DISTRICTS.map((district) => ({
    district: district.toLowerCase().replace(/ /g, '-'),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { district: districtSlug } = await params;
  const districtName = TELANGANA_DISTRICTS.find(
    (d) => d.toLowerCase().replace(/ /g, '-') === districtSlug
  ) || districtSlug;

  return {
    title: `${districtName} Surgical Supplies & Logistics`,
    description: `Agile Healthcare is the leading medical device distributor in ${districtName}, providing fast OT dispatch and clinical support for Meril Life Sciences products.`,
    keywords: [`${districtName} surgical supplies`, `${districtName} medical devices`, `orthopedic implants ${districtName}`, `Meril distributor ${districtName}`],
  };
}

export default async function DistrictPage({ params }: Props) {
  const { district: districtSlug } = await params;
  const districtName = TELANGANA_DISTRICTS.find(
    (d) => d.toLowerCase().replace(/ /g, '-') === districtSlug
  ) || districtSlug;

  return (
    <main className="min-h-screen bg-[#050816] text-white selection:bg-primary/30 font-body">
      <PremiumHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-20" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-12 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Network
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">District Logistics Hub</span>
              </div>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">
                {districtName}
              </h1>
              <p className="text-xl text-white/60 max-w-2xl font-medium">
                Official Clinical Distribution Node for <span className="text-white">Meril Life Sciences</span>. 
                Full-spectrum surgical intelligence and OT logistics deployed in {districtName}.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl md:min-w-[300px]">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Status: Active</div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-black font-mono tracking-tighter">
                      {districtName === 'Hyderabad' ? '~2 HOURS' : 'SAME-DAY'}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-white/40">Dispatch ETA</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-black font-mono tracking-tighter">24/7 LIVE</div>
                    <div className="text-[9px] uppercase tracking-widest text-white/40">Clinical Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logistics Details */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-10 bg-black/40 border border-white/5 rounded-3xl hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tighter mb-4">Quality Assurance</h3>
              <p className="text-white/40 leading-relaxed text-sm">
                Every implant delivered to {districtName} hospitals undergoes a triple-point inspection at our central hub before dispatch.
              </p>
            </div>
            
            <div className="p-10 bg-black/40 border border-white/5 rounded-3xl hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tighter mb-4">On-Site Scrub Support</h3>
              <p className="text-white/40 leading-relaxed text-sm">
                Our clinical intelligence team provides in-theatre technical guidance for complex orthopedic and cardiovascular procedures.
              </p>
            </div>
            
            <div className="p-10 bg-black/40 border border-white/5 rounded-3xl hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tighter mb-4">Inventory Telemetry</h3>
              <p className="text-white/40 leading-relaxed text-sm">
                Real-time stock monitoring ensures that rare implant sizes and specialized instrumentation are always ready for {districtName}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Division Showcase for District */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-6">Available <span className="text-primary">Clinical Solutions</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto">Procurement-ready infrastructure for {districtName}'s healthcare ecosystem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/catalog/trauma" className="relative group overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-12 hover:border-primary/50 transition-all">
              <div className="flex justify-between items-start mb-12">
                <Activity className="w-12 h-12 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Division 01</span>
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Trauma & Fracture</h3>
              <p className="text-white/40 text-sm max-w-xs mb-8">Comprehensive plating and nailing systems for acute skeletal injury management.</p>
              <div className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                View Local Catalog <ArrowLeft className="w-4 h-4 rotate-180" />
              </div>
            </Link>
            
            <Link href="/catalog/arthroplasty" className="relative group overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-12 hover:border-primary/50 transition-all">
              <div className="flex justify-between items-start mb-12">
                <Stethoscope className="w-12 h-12 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Division 02</span>
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Joint Replacement</h3>
              <p className="text-white/40 text-sm max-w-xs mb-8">Advanced hip and knee reconstructive solutions with wear-reduction technology.</p>
              <div className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                View Local Catalog <ArrowLeft className="w-4 h-4 rotate-180" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Hub */}
      <section className="py-32 bg-primary text-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic mb-12 leading-none">
            Scale Your<br />Hospital in {districtName}.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link 
              href="https://wa.me/917416216262"
              className="px-12 py-6 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all"
            >
              Contact Local Manager
            </Link>
            <Link 
              href="/catalog"
              className="px-12 py-6 bg-transparent border border-black text-black font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-all"
            >
              Request Price List
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 bg-black text-center">
        <div className="text-2xl font-black tracking-tighter uppercase italic mb-4">AGILE <span className="text-primary">HEALTHCARE</span></div>
        <p className="text-white/20 text-xs uppercase tracking-[0.3em]">Serving the {districtName} region since 2016</p>
      </footer>
    </main>
  );
}
