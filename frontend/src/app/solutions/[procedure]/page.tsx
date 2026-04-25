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
  Award,
  Stethoscope,
  Microscope,
  Cpu,
  History
} from 'lucide-react';
import PremiumHeader from '../../../components/PremiumHeader';

const PROCEDURES = {
  'tkr': {
    name: 'Total Knee Replacement (TKR)',
    solution: 'Freedom Total Knee System',
    benefits: ['Sub-vastus approach compatible', 'High-flexion design', 'Proprietary wear-reduction'],
    bundleItems: ['Freedom Primary Implants', 'Freedom Revision Set', 'P-Com instrumentation'],
    leadText: 'Optimized Arthroplasty Ecosystem for 33 Districts.',
    workflow: ['Pre-op Sizing', 'Bone Resection', 'Gap Balancing', 'Trialing', 'Final Implantation'],
    division: 'Arthroplasty',
    theme: 'gold'
  },
  'thr': {
    name: 'Total Hip Replacement (THR)',
    solution: 'Latitud Hip System',
    benefits: ['Dual Mobility compatibility', 'Anterior approach optimized', 'Advanced porous coating'],
    bundleItems: ['Latitud Acetabular Cups', 'Ceramic/CoCr Heads', 'Cemented/Uncemented Stems'],
    leadText: 'Precision Articulation for Long-Term Mobility.',
    workflow: ['Acetabular Reaming', 'Cup Placement', 'Femoral Preparation', 'Neck Trialing', 'Closure'],
    division: 'Arthroplasty',
    theme: 'gold'
  },
  'ptca': {
    name: 'Interventional Cardiology (PTCA)',
    solution: 'BioMime Sirolimus-Eluting Stents',
    benefits: ['Ultra-thin struts (65μm)', 'Hybrid cell design', 'Morphological compliance'],
    bundleItems: ['BioMime Stents', 'Balloon Catheters', 'Guide Wires'],
    leadText: 'The Golden Standard in Coronary Interventions.',
    workflow: ['Vascular Access', 'Lesion Crossing', 'Pre-dilation', 'Stent Deployment', 'Post-dilation'],
    division: 'Cardiovascular',
    theme: 'red'
  },
  'trauma': {
    name: 'Complex Fracture Management',
    solution: 'Anatomical Plating Systems',
    benefits: ['Locking/Non-locking versatility', 'Lower profile designs', 'Durable grade 5 titanium'],
    bundleItems: ['Distal Radius Plates', 'Proximal Humerus Plates', 'Intramedullary Nails'],
    leadText: 'Emergency Trauma Instrumentation for Every Level of Care.',
    workflow: ['Reduction', 'Temporary Fixation', 'Plate Positioning', 'Screw Sequencing', 'Stability Check'],
    division: 'Trauma',
    theme: 'blue'
  },
  'distal-radius': {
    name: 'Distal Radius Fixation',
    solution: 'Variabilis 2.4mm System',
    benefits: ['Multi-angle locking technology', 'Low-profile volar plates', 'Anatomically pre-contoured'],
    bundleItems: ['Variabilis Radial Plates', '2.4mm Locking Screws', 'Fine Instrumentation Kit'],
    leadText: 'The Ultimate Precision in Upper Extremity Trauma.',
    workflow: ['Volar Approach', 'Fracture Reduction', 'Plate Fixation', 'Drilling', 'Screw Placement'],
    division: 'Trauma',
    theme: 'blue'
  },
  'pfn': {
    name: 'Proximal Femoral Nailing (PFN)',
    solution: 'Agile PFN-II System',
    benefits: ['Anti-rotation mechanism', 'Minimal incision entry', 'Dynamic/Static locking options'],
    bundleItems: ['Proximal Femoral Nails', 'Lag Screws', 'Distal Locking Screws'],
    leadText: 'Advanced Intramedullary Solutions for Hip Fractures.',
    workflow: ['Positioning', 'Incision', 'Entry Point', 'Reaming', 'Nail Insertion'],
    division: 'Trauma',
    theme: 'blue'
  },
  'acl': {
    name: 'ACL Reconstruction',
    solution: 'Agile Sports Medicine Kit',
    benefits: ['Bio-absorbable screws', 'Adjustable loop suspension', 'High-tensile sutures'],
    bundleItems: ['Interference Screws', 'Button Fixation', 'Graft Preparation Tools'],
    leadText: 'Returning Athletes to Peak Performance.',
    workflow: ['Portal Creation', 'Graft Harvest', 'Tunnel Drilling', 'Graft Passage', 'Fixation'],
    division: 'Sports Medicine',
    theme: 'green'
  }
};

export default function ProcedurePage() {
  const { procedure } = useParams();
  const data = PROCEDURES[procedure as keyof typeof PROCEDURES] || PROCEDURES['trauma'];

  const themeClasses = {
    gold: 'text-primary border-primary/20 bg-primary/10',
    blue: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
    red: 'text-red-500 border-red-500/20 bg-red-500/10',
    green: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
  };

  const themeColors = {
    gold: 'primary',
    blue: 'blue-400',
    red: 'red-500',
    green: 'emerald-400'
  };

  const currentTheme = (data.theme || 'gold') as keyof typeof themeClasses;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <PremiumHeader />

      {/* Authority Hero */}
      <section className={`relative pt-44 pb-32 overflow-hidden ${currentTheme === 'blue' ? 'bg-[#050B14]' : ''}`}>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className={`absolute top-1/4 right-0 w-[40%] h-[40%] bg-${themeColors[currentTheme]}/20 rounded-full blur-[160px]`} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 backdrop-blur-md ${themeClasses[currentTheme]}`}>
              <Zap className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black uppercase">{data.division} Master Solution</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-[0.85]">
              {data.name}. <br />
              <span className={currentTheme === 'blue' ? 'text-blue-400' : 'text-gradient-gold'}>Clinical Precision.</span>
            </h1>
            
            <p className="max-w-4xl text-xl md:text-2xl text-muted-foreground mb-12 leading-tight">
              {data.leadText} We provide more than just the {data.solution}—we deliver the complete surgical ready-kit and in-theater clinical support across Telangana.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
               <button className={`px-12 py-6 rounded-none font-black uppercase tracking-widest text-xs shadow-2xl transition-all ${currentTheme === 'blue' ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-primary text-black shadow-primary/20'} hover:scale-105 active:scale-95`}>
                  Request Procedure Ready-Kit
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Surgical Workflow Section */}
      <section className="py-24 border-y border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/40 mb-4 italic">Surgical Protocol</h2>
            <h3 className="text-4xl font-black uppercase tracking-tighter italic">Optimized <span className="text-white/40">Workflow.</span></h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {data.workflow.map((step, i) => (
              <div key={i} className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                <span className="absolute top-4 right-6 text-4xl font-black text-white/5 group-hover:text-primary/10 transition-colors">0{i+1}</span>
                <p className="text-lg font-black uppercase italic tracking-tighter leading-tight mt-4">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Highlights & Bundle */}
      <section className="py-24 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
             <div>
                <div className="flex items-center gap-4 mb-12">
                   <div className={`p-4 rounded-2xl border ${themeClasses[currentTheme]}`}>
                      <Microscope className="w-8 h-8" />
                   </div>
                   <h2 className="text-4xl font-black tracking-tighter uppercase italic">
                      Technical <br /><span className="text-white/40">Excellence</span>
                   </h2>
                </div>
                <div className="space-y-6">
                   {data.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentTheme === 'blue' ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black'}`}>
                            <CheckCircle2 className="w-6 h-6" />
                         </div>
                         <span className="text-lg font-bold italic tracking-tight">{benefit}</span>
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-[#111] border border-white/5 p-12 rounded-[48px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Layers className="w-64 h-64" />
                </div>
                <div className="relative z-10">
                   <h3 className="text-2xl font-black mb-8 uppercase italic">Instrumentation & Implant Bundle</h3>
                   <ul className="space-y-4 mb-12">
                      {data.bundleItems.map((item, i) => (
                         <li key={i} className="flex items-center gap-4 text-muted-foreground font-bold">
                            <div className={`w-2 h-2 rounded-full ${currentTheme === 'blue' ? 'bg-blue-400' : 'bg-primary'}`} />
                            {item}
                         </li>
                      ))}
                   </ul>
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
                       <div className={`flex items-center gap-3 mb-2 ${currentTheme === 'blue' ? 'text-blue-400' : 'text-primary'}`}>
                          <Activity className="w-5 h-5" />
                          <span className="text-xs font-black uppercase tracking-widest">In-Theater Status</span>
                       </div>
                       <p className="text-xs text-white/60 font-medium font-mono">2 Clinical Support Specialists Authorized for Scrubbing-in today in Telangana.</p>
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
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 uppercase italic leading-none">
               Excellence in <br />
               <span className={currentTheme === 'blue' ? 'text-blue-400' : 'text-primary'}>{data.name}.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
               Agile Healthcare provides the regional surgical backbone for {data.name} across Telangana. 
               Zero lag. Maximum clinical depth. 24/7 OT support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <button className={`flex items-center justify-center gap-3 px-12 py-6 font-black uppercase tracking-widest text-xs rounded-full shadow-2xl transition-all ${currentTheme === 'blue' ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-primary text-black shadow-primary/20'}`}>
                  <MessageSquare className="w-4 h-4" />
                  Live Surgical Desk
               </button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center px-4 bg-black">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Authorized Meril Master Distributor | {data.division} Division</p>
         <div className="mt-8 flex items-center justify-center gap-12 opacity-10 grayscale">
            <Award className="w-12 h-12" />
            <ShieldCheck className="w-12 h-12" />
            <Cpu className="w-12 h-12" />
            <History className="w-12 h-12" />
         </div>
      </footer>
    </main>
  );
}
