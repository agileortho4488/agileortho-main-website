import React from 'react';
import { Metadata } from 'next';
import PremiumHeader from '@/components/PremiumHeader';
import { ShieldCheck, MapPin, Phone, Hospital } from 'lucide-react';
import Link from 'next/link';

interface DistrictPageProps {
  params: Promise<{ slug: string }>;
}

const DISTRICT_DATA: Record<string, any> = {
  'hyderabad': { name: 'Hyderabad', hub: 'Central Logistics Hub', clinics: 450 },
  'warangal': { name: 'Warangal', hub: 'Regional North Hub', clinics: 120 },
  'nizamabad': { name: 'Nizamabad', hub: 'North Gateway Center', clinics: 85 },
  'karimnagar': { name: 'Karimnagar', hub: 'Industrial Care Unit', clinics: 95 },
  'khammam': { name: 'Khammam', hub: 'East Boundary Logistics', clinics: 70 },
};

export async function generateStaticParams() {
  const districts = ['hyderabad', 'warangal', 'nizamabad', 'karimnagar', 'khammam'];
  return districts.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DistrictPageProps): Promise<Metadata> {
  const { slug } = await params;
  const district = DISTRICT_DATA[slug] || { name: slug.charAt(0).toUpperCase() + slug.slice(1) };
  
  return {
    title: `Meril Life Sciences Authorized Distributor in ${district.name} | Agile Healthcare`,
    description: `Authorized Meril master franchise distributor for ${district.name}, Telangana. Supplying 967+ medical devices for Trauma, Cardio, and Arthroplasty to hospitals in ${district.name}.`,
  };
}

export default async function DistrictPage({ params }: DistrictPageProps) {
  const { slug } = await params;
  const district = DISTRICT_DATA[slug] || { name: slug.charAt(0).toUpperCase() + slug.slice(1), hub: 'Active Distribution Zone', clinics: 'Multiple' };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <PremiumHeader />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4">
           <div className="mb-20">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Regional Operations: Telangana</span>
              </div>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none mb-8">
                {district.name} <br />
                <span className="text-gradient-gold">Network.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                Empowering healthcare in {district.name} with Meril's world-class medical technology. 
                Our {district.hub} ensures 24/7 delivery for emergency surgical requirements.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="p-10 rounded-[40px] bg-white/5 border border-white/10">
                 <Hospital className="w-10 h-10 text-primary mb-6" />
                 <h3 className="text-2xl font-black uppercase italic mb-4">Local Coverage</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">
                    Supporting {district.clinics}+ hospitals and surgical centers across the {district.name} district.
                 </p>
              </div>
              <div className="p-10 rounded-[40px] bg-white/5 border border-white/10">
                 <ShieldCheck className="w-10 h-10 text-primary mb-6" />
                 <h3 className="text-2xl font-black uppercase italic mb-4">Authorized Service</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">
                    Full technical support and OT assistance provided by Meril-certified clinical engineers.
                 </p>
              </div>
              <div className="p-10 rounded-[40px] bg-primary text-black">
                 <Phone className="w-10 h-10 mb-6" />
                 <h3 className="text-2xl font-black uppercase italic mb-4">Immediate Order</h3>
                 <p className="font-bold text-sm leading-relaxed mb-6">
                    Contact our {district.name} regional coordinator for priority fulfillment.
                 </p>
                 <button className="w-full py-4 rounded-2xl bg-black text-white font-black uppercase tracking-widest text-xs">
                    Contact Regional Hub
                 </button>
              </div>
           </div>

           <div className="border-t border-white/5 pt-20">
              <h2 className="text-3xl font-black uppercase italic mb-12">Available in {district.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {['Trauma', 'Arthroplasty', 'Cardiovascular', 'Endo-Surgery'].map((cat) => (
                   <div key={cat} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                      <span className="text-sm font-bold uppercase tracking-widest text-white/60">{cat}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
