"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Layers, 
  Activity,
  Award
} from 'lucide-react';
import PremiumHeader from '../../../components/PremiumHeader';

const PROCEDURES = {
  'tkr': {
    name: 'Total Knee Replacement (TKR)',
    solution: 'Freedom Total Knee System',
    benefits: ['Sub-vastus approach compatible', 'High-flexion design', 'Proprietary wear-reduction'],
    bundleItems: ['Freedom Primary Implants', 'Freedom Revision Set', 'P-Com instrumentation'],
    leadText: 'Optimized Arthroplasty Ecosystem for 33 Districts.'
  },
  'ptca': {
    name: 'Interventional Cardiology (PTCA)',
    solution: 'BioMime Sirolimus-Eluting Stents',
    benefits: ['Ultra-thin struts (65μm)', 'Hybrid cell design', 'Morphological compliance'],
    bundleItems: ['BioMime Stents', 'Balloon Catheters', 'Guide Wires'],
    leadText: 'The Golden Standard in Coronary Interventions.'
  },
  'trauma': {
    name: 'Complex Fracture Management',
    solution: 'Anatomical Plating Systems',
    benefits: ['Locking/Non-locking versatility', 'Lower profile designs', 'Durable grade 5 titanium'],
    bundleItems: ['Distal Radius Plates', 'Proximal Humerus Plates', 'Intramedullary Nails'],
    leadText: 'Emergency Trauma Instrumentation for Every Level of Care.'
  }
};

export default function ProcedurePage() {
  const { procedure } = useParams();
  const data = PROCEDURES[procedure as keyof typeof PROCEDURES] || PROCEDURES['trauma'];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <PremiumHeader />

      {/* Authority Hero */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-1/4 right-0 w-[40%] h-[40%] bg-primary/20 rounded-full blur-[160px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-primary">Master Solution Hub</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-none">
              {data.name}. <br />
              <span className="text-gradient-gold">Optimized Workflow.</span>
            </h1>
            
            <p className="max-w-4xl text-xl md:text-2xl text-muted-foreground mb-12 leading-tight">
              {data.leadText} We provide more than just the {data.solution}—we deliver the complete surgical ready-kit and in-theater clinical support.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
               <button className="bg-primary text-black px-12 py-6 rounded-none font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Request Procedure Ready-Kit
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Surgical Bundle Selection */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-8 flex items-center gap-4">
                  <span className="h-[1px] w-12 bg-primary"></span>
                  Clinical Highlights
                </h2>
                <div className="space-y-6">
                   {data.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                         <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                            <CheckCircle2 className="w-6 h-6" />
                         </div>
                         <span className="text-lg font-bold italic tracking-tight">{benefit}</span>
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-[#111] border border-white/5 p-12 rounded-[48px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <Layers className="w-64 h-64" />
                </div>
                <div className="relative z-10">
                   <h3 className="text-2xl font-black mb-8 uppercase italic">Instrumentation & Implant Bundle</h3>
                   <ul className="space-y-4 mb-12">
                      {data.bundleItems.map((item, i) => (
                         <li key={i} className="flex items-center gap-4 text-muted-foreground font-bold">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            {item}
                         </li>
                      ))}
                   </ul>
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
                       <div className="flex items-center gap-3 text-primary mb-2">
                          <Activity className="w-5 h-5" />
                          <span className="text-xs font-black uppercase tracking-widest">In-Theater Status</span>
                       </div>
                       <p className="text-xs text-white/60 font-medium font-mono">2 Clinical Support Specialists Authorized for Scrubbing-in today.</p>
                   </div>
                   <button className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary transition-all">
                      Confirm Dispatch Hub
                   </button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Procedure CTA */}
      <section className="py-32 px-4 text-center">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase italic leading-none">
               Dominate {data.name} Operations.
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
               Agile Healthcare provides the regional surgical backbone for {data.name} across Telangana. 
               Zero lag. Maximum clinical depth.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <button className="flex items-center justify-center gap-3 px-10 py-5 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-full shadow-2xl">
                  <MessageSquare className="w-4 h-4" />
                  Live Surgical Desk
               </button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center px-4">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Authorized Master Distributor: Clinical Excellence Division</p>
         <div className="mt-8 flex items-center justify-center gap-12 opacity-20 grayscale">
            <Award className="w-12 h-12" />
            <ShieldCheck className="w-12 h-12" />
         </div>
      </footer>
    </main>
  );
}
