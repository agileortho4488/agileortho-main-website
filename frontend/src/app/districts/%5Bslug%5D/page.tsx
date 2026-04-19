"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Truck, ShieldCheck, Zap, ChevronRight, Phone, MessageSquare } from 'lucide-react';
import PremiumHeader from '../../../components/PremiumHeader';
import StatsCounter from '../../../components/StatsCounter';

const DISTRICTS = ["Hyderabad","Rangareddy","Medchal-Malkajgiri","Sangareddy","Nalgonda","Warangal","Karimnagar","Khammam","Nizamabad","Adilabad","Mahabubnagar","Medak","Siddipet","Suryapet","Jagtial","Peddapalli","Kamareddy","Mancherial","Wanaparthy","Nagarkurnool","Vikarabad","Jogulamba Gadwal","Rajanna Sircilla","Kumuram Bheem","Mulugu","Narayanpet","Mahabubabad","Jayashankar","Jangaon","Nirmal","Yadadri","Bhadradri","Hanumakonda"];

export default function DistrictPage() {
  const { slug } = useParams();
  const districtName = slug ? String(slug).charAt(0).toUpperCase() + String(slug).slice(1).replace('-', ' ') : '';
  
  const isValidDistrict = DISTRICTS.some(d => d.toLowerCase() === districtName.toLowerCase());

  if (!isValidDistrict && slug !== 'all') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Location Not Found</h1>
          <p className="text-muted-foreground">We serve all 33 districts of Telangana. Please search for a valid district.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <PremiumHeader />

      <section className="relative pt-44 pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-primary">Regional Logistics Hub</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 italic uppercase leading-tight">
              Surgical <br />
              <span className="text-gradient-gold">Dominance in {districtName}.</span>
            </h1>
            
            <p className="max-w-3xl text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              Agile Healthcare is the Master Distributor for Meril Life Sciences 
              in the <span className="text-white font-bold">{districtName}</span> region. 
              We ensure surgical precision is never delayed by logistics.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
               <button className="bg-primary text-black px-10 py-5 rounded-none font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Request Sample in {districtName}
               </button>
               <button className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-none font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                  Local Partner Inquiry
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Local Logistics Stats */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
           <StatsCounter value={2} label="Dispatch Time" suffix="HRS" />
           <StatsCounter value={100} label="District Coverage" suffix="%" />
           <StatsCounter value={15} label="On-Call Experts" />
           <StatsCounter value={0} label="Master Lead" suffix="Meril" />
        </div>
      </section>

      {/* WHY US IN THE DISTRICT */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
                { title: 'Emergency Dispatch', desc: `Dedicated logistics fleet stationed specifically for ${districtName} hospital emergencies.`, icon: Truck },
                { title: 'Full Inventory', desc: 'Complete range of trauma, cardiovascular, and surgical consumables maintained in local stock.', icon: ShieldCheck },
                { title: 'In-Theater Support', desc: 'Clinical specialists available for scrubbing-in at major hospitals across the district.', icon: Zap }
            ].map((feature, i) => (
                <div key={i} className="p-10 bg-[#111] rounded-[40px] border border-white/5 group hover:border-primary/50 transition-all">
                    <feature.icon className="w-12 h-12 text-primary mb-8 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                        {feature.desc}
                    </p>
                </div>
            ))}
        </div>
      </section>

      {/* District CTA */}
      <section className="py-32 px-4">
         <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary/20 to-transparent p-16 rounded-[48px] border border-primary/20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
                <MapPin className="w-64 h-64" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase italic leading-none relative z-10">
                Are you a Surgeon in {districtName}?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto relative z-10">
                Secure 24/7 access to the Meril ecosystem. From instrumentation to after-case support, 
                we are your direct line to clinical excellence in the district.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
               <button className="flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl hover:bg-primary transition-all">
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp Direct
               </button>
               <button className="flex items-center justify-center gap-3 px-10 py-5 bg-[#CC2020] text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl hover:scale-105 transition-all">
                  <Phone className="w-4 h-4" />
                  Request OT Support
               </button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center px-4">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Authorized Master Distributor: Telangana State</p>
         <div className="mt-8 text-3xl font-black italic tracking-tighter text-white/20">{districtName} Surgical Operations Hub</div>
      </footer>
    </main>
  );
}
