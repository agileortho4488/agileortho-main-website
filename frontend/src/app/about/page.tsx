"use client";

import React from 'react';
import Image from 'next/image';
import PremiumHeader from '../../components/PremiumHeader';
import PartnershipTimeline from '../../components/PartnershipTimeline';
import CertificationsWall from '../../components/CertificationsWall';
import TrustStrip from '../../components/TrustStrip';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white selection:bg-primary/30 font-body">
      <PremiumHeader />
      <TrustStrip />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
           <Image 
             src="/images/surgeon-team.png" 
             alt="Surgical Infrastructure" 
             fill
             className="object-cover grayscale opacity-20"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-transparent to-[#050816]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-8">Clinical Infrastructure</div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic mb-12">
               The Surgical<br />
               <span className="text-primary">Backbone.</span>
            </h1>
            <p className="max-w-2xl text-2xl text-muted-foreground leading-tight">
               Agile Healthcare collapses the distance between global medtech innovation and district-level operating theatres. 
               Serving as the authorized Master Franchise for Meril Life Sciences across all 33 districts of Telangana.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Operational Philosophy */}
      <section className="py-32 bg-white/[0.02] border-y border-white/5 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
             <div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 italic">Operationally <span className="text-primary">Reliable.</span></h2>
                <p className="text-xl text-white/60 leading-relaxed mb-8">
                   We believe that surgical hardware is only as effective as the logistics network that delivers it. 
                   Our philosophy merges clinical intelligence with an obsession for OT-speed logistics.
                </p>
                <div className="space-y-6">
                   <div className="flex items-start gap-4">
                      <div className="h-2 w-2 rounded-full bg-primary mt-3" />
                      <div>
                        <div className="font-bold uppercase tracking-widest text-sm mb-1">Statewide Integration</div>
                        <div className="text-white/40 text-sm">Deeply embedded in the hospital ecosystem of every district.</div>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="h-2 w-2 rounded-full bg-primary mt-3" />
                      <div>
                        <div className="font-bold uppercase tracking-widest text-sm mb-1">Clinical Governance</div>
                        <div className="text-white/40 text-sm">Strict adherence to international standards and quality control.</div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="relative aspect-square rounded-[40px] overflow-hidden border border-white/5">
                <Image 
                   src="/images/meril-partnership.png" 
                   alt="Strategic Partnership" 
                   fill
                   className="object-cover opacity-60"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 italic">Our <span className="text-primary">Growth.</span></h2>
             <p className="text-white/40">The evolution of a surgical powerhouse.</p>
          </div>
          <PartnershipTimeline />
        </div>
      </section>

      {/* Certifications */}
      <section className="py-32 bg-[#0F172A]/30 px-4">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-24">
             <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 italic">Clinical <span className="text-primary">Governance.</span></h2>
             <p className="text-white/40">Certifications and trust markers validated for hospital procurement.</p>
          </div>
          <CertificationsWall />
        </div>
      </section>

      {/* Global Footer Placeholder */}
      <footer className="py-32 border-t border-white/5 bg-black text-center">
         <div className="text-2xl font-black tracking-tighter uppercase italic text-white/20">Agile Healthcare Infrastructure</div>
      </footer>
    </main>
  );
}
