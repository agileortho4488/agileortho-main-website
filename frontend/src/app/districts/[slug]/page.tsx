import React from 'react';
import { Metadata } from 'next';
import PremiumHeader from '@/components/PremiumHeader';
import { ShieldCheck, MapPin, Phone, Hospital, ChevronRight, Activity, Zap, Box } from 'lucide-react';
import Link from 'next/link';
import { TELANGANA_DISTRICTS, getDistrictBySlug } from '@/lib/districts';

interface DistrictPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TELANGANA_DISTRICTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: DistrictPageProps): Promise<Metadata> {
  const { slug } = await params;
  const district = getDistrictBySlug(slug);
  
  if (!district) return { title: 'District Not Found' };

  return {
    title: `Meril Life Sciences Authorized Distributor in ${district.name} | Agile Healthcare`,
    description: `Authorized Meril master franchise distributor for ${district.name}, Telangana. Supplying ${district.medicalFocus.join(', ')} medical devices to hospitals like ${district.hospitals.slice(0, 3).join(', ')}.`,
    alternates: {
      canonical: `https://agilehealthcare.in/districts/${slug}`,
    },
  };
}

export default async function DistrictPage({ params }: DistrictPageProps) {
  const { slug } = await params;
  const district = getDistrictBySlug(slug);

  if (!district) return <div>District not found</div>;

  // Generate LocalBusiness JSON-LD for local SEO
  const localSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": `Agile Healthcare - ${district.name} Regional Hub`,
    "description": `Authorized Meril master franchise distributor in ${district.name}, Telangana. Specializing in ${district.medicalFocus.join(', ')}.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": district.name,
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    },
    "telephone": "+918500204488",
    "areaServed": district.name,
    "brand": {
      "@type": "Brand",
      "name": "Meril Life Sciences"
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30 selection:text-white">
      <PremiumHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />
      
      <main className="pt-32 pb-24 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-6">
           {/* Hero Section */}
           <div className="mb-24">
              <div className="flex items-center gap-2 mb-8 animate-fade-up">
                <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Authorized Distribution Network</span>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12 items-end">
                <div>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] mb-8 animate-fade-up stagger-1">
                    {district.name} <br />
                    <span className="text-gradient-gold">Solutions.</span>
                  </h1>
                  <p className="text-lg md:text-xl text-white/40 max-w-xl leading-relaxed animate-fade-up stagger-2">
                    {district.description}
                  </p>
                </div>
                
                <div className="flex flex-col gap-6 animate-fade-up stagger-3">
                  <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                    <div className="text-center border-r border-white/10 pr-6">
                      <div className="text-3xl font-black text-primary">{district.population}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Population</div>
                    </div>
                    <div className="text-center px-6 border-r border-white/10">
                      <div className="text-3xl font-black text-white">{district.hospitals.length}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Hospitals</div>
                    </div>
                    <div className="text-center pl-6">
                      <div className="text-3xl font-black text-teal-400">24h</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Dispatch</div>
                    </div>
                  </div>
                </div>
              </div>
           </div>

           {/* Hospital Network */}
           <div className="grid lg:grid-cols-3 gap-8 mb-24">
              <div className="lg:col-span-2">
                <div className="p-10 rounded-[40px] bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Hospital className="w-64 h-64 -mr-20 -mt-20" />
                  </div>
                  
                  <h2 className="text-3xl font-black uppercase italic mb-10 flex items-center gap-3">
                    <Activity className="text-primary w-8 h-8" />
                    Hospital Network
                  </h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {district.hospitals.map((hospital: string) => (
                      <div key={hospital} className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-white/[0.05] transition-all group/item">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">
                          <ShieldCheck className="w-4 h-4 text-white/40 group-hover/item:text-primary" />
                        </div>
                        <span className="font-bold text-white/70 group-hover/item:text-white transition-colors">{hospital}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div className="p-10 rounded-[40px] bg-primary text-black flex flex-col h-full relative overflow-hidden group">
                  <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <Phone className="w-48 h-48" />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic mb-4">Direct Order</h3>
                  <p className="font-bold text-sm leading-relaxed mb-10 opacity-80">
                    Contact our regional coordinator for {district.name} for prioritized surgical fulfillment and OT support.
                  </p>
                  <div className="mt-auto">
                    <a 
                      href="tel:+918500204488" 
                      className="inline-flex items-center justify-center w-full py-5 rounded-2xl bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
                    >
                      Call Regional Hub
                    </a>
                  </div>
                </div>
              </div>
           </div>

            {/* Local Advantage & Catalog */}
            <div className="border-t border-white/5 pt-24">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                 <div>
                   <h2 className="text-4xl font-black uppercase italic mb-4">Local Advantage</h2>
                   <p className="text-white/30 font-medium max-w-2xl">
                     Agile Healthcare maintains specialized inventory for {district.name} surgeons, 
                     ensuring that every hospital from {district.hospitals.slice(0, 2).join(' to ')} 
                     receives life-saving implants within 2-4 hours.
                   </p>
                 </div>
                 <Link href="/catalog" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2 group">
                   Clinical Catalog <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                 </Link>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {district.medicalFocus.map((focus: string, idx: number) => (
                    <Link 
                      href={`/catalog/${focus.toLowerCase().replace(/\s+/g, '-')}`}
                      key={focus} 
                      className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1"
                    >
                       <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                         {idx % 3 === 0 ? <Box className="w-5 h-5 text-primary" /> : idx % 3 === 1 ? <Zap className="w-5 h-5 text-primary" /> : <Activity className="w-5 h-5 text-primary" />}
                       </div>
                       <h4 className="font-black uppercase tracking-widest text-sm text-white group-hover:text-primary transition-colors">{focus}</h4>
                       <p className="text-[10px] text-white/30 mt-3 leading-relaxed">Authorized supply for {district.name} hospitals. Guaranteed sterility and clinical precision.</p>
                    </Link>
                  ))}
               </div>
            </div>
        </div>
      </main>
    </div>
  );
}
