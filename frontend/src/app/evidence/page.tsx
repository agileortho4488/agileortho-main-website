"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Activity, Microscope, ExternalLink, Download, Award, Beaker } from 'lucide-react';
import PremiumHeader from '../components/PremiumHeader';

const STUDIES = [
  {
    title: "BioMime™ DES Clinical Outcomes",
    focus: "Interventional Cardiology",
    result: "Demonstrates 98.2% procedural success rate in multi-center clinical trials.",
    type: "Peer-Reviewed Study"
  },
  {
    title: "TiNbN Coating Wear Analysis",
    focus: "Orthopedics & Trauma",
    result: "60% reduction in ion release compared to standard CrCo implants.",
    type: "Laboratory Safety Profile"
  },
  {
    title: "Freedom Knee Survival Rate",
    focus: "Joint Replacement",
    result: "99.1% implant survivorship recorded at 5-year follow-up intervals.",
    type: "Clinical Registry Data"
  }
];

export default function EvidenceHub() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <PremiumHeader />

      <section className="relative pt-44 pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-0 w-[50%] h-[50%] bg-primary/20 rounded-full blur-[160px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-primary">Evidence-Based Medicine</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-none">
                    Clinical <br />
                    <span className="text-gradient-gold">Authority Hub.</span>
                </h1>
                
                <p className="max-w-3xl mx-auto text-xl text-muted-foreground leading-relaxed">
                    Access peer-reviewed studies, material safety profiles, and long-term outcome data 
                    supporting the Meril surgical ecosystem.
                </p>
            </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01]">
         <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-12 opacity-40">
            <div className="flex items-center gap-3"><Award /> <span className="text-[10px] font-black uppercase tracking-widest">CDSCO LICENSED</span></div>
            <div className="flex items-center gap-3"><Beaker /> <span className="text-[10px] font-black uppercase tracking-widest">ISO 13485:2016</span></div>
            <div className="flex items-center gap-3"><ShieldCheck /> <span className="text-[10px] font-black uppercase tracking-widest">GMP CERTIFIED</span></div>
         </div>
      </section>

      {/* Study Highlights */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {STUDIES.map((study, i) => (
                <div key={i} className="p-10 bg-[#111] border border-white/5 rounded-[40px] hover:border-primary/50 transition-all flex flex-col group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FileText className="w-32 h-32" />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        {study.focus}
                    </div>
                    <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter italic leading-tight">{study.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-8 flex-1 italic">
                        "{study.result}"
                    </p>
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{study.type}</span>
                        <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Tech Request */}
      <section className="py-32 px-4 text-center">
         <div className="max-w-4xl mx-auto p-16 rounded-[48px] border border-primary/20 bg-primary/5">
            <Microscope className="w-16 h-16 text-primary mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase italic leading-none">
                Need Detailed <br />Surgical Data?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
                Our clinical engineers can provide whitepapers, material dossiers, and detailed 
                comparative analysis for hospital board reviews.
            </p>
            <button className="px-10 py-5 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl hover:scale-105 transition-all">
               Request Clinical Dossier
            </button>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center px-4">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">© 2026 Agile Healthcare. Scientific Relations Division.</p>
      </footer>
    </main>
  );
}
