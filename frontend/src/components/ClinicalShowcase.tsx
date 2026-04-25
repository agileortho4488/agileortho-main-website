"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Microscope, ShieldCheck, Zap, Ruler } from 'lucide-react';
import Link from 'next/link';

const HIGHLIGHTS = [
  {
    title: "Sizing Wizard",
    description: "Anatomical precision tools for surgical planning.",
    icon: Ruler,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    title: "Clinical Blueprints",
    description: "High-fidelity technical matrices for every device.",
    icon: Microscope,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: "Verified Intelligence",
    description: "Brochure-extracted data validated by clinical engineers.",
    icon: ShieldCheck,
    color: "text-green-400",
    bg: "bg-green-500/10"
  }
];

export default function ClinicalShowcase() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#050505]">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
          >
            <Zap className="w-3 h-3 text-blue-400 fill-blue-400" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-blue-400">Clinical Excellence Initiative</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-6 leading-tight">
            Beyond the <span className="text-primary">Standard</span> Catalog
          </h2>
          <p className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto font-medium px-4">
            We've transformed legacy brochures into a high-fidelity clinical intelligence engine. 
            Better data. Faster decisions. Superior surgical outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
          {HIGHLIGHTS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group"
            >
              <div className={`w-14 h-14 sm:w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blue-500/5`}>
                <item.icon className="w-7 h-7 sm:w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase italic mb-4">{item.title}</h3>
              <p className="text-sm sm:text-base text-white/40 font-medium leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#111] to-[#0A0A0A] rounded-[32px] sm:rounded-[48px] border border-white/10 p-8 sm:p-12 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 w-full">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-primary mb-4 block">Live Enrichment Progress</span>
            <div className="flex items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
              <span className="text-5xl sm:text-7xl font-black tracking-tighter italic">723</span>
              <span className="text-xl sm:text-2xl font-bold text-white/20 mb-2 sm:mb-3">/ 1202 Products</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-6 sm:mb-8">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '60.1%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
              />
            </div>
            <p className="text-xs sm:text-sm text-white/40 italic mb-8 sm:mb-10">
              *Our AI extraction engine is currently deep-scanning the Trauma and Endo-Surgery portfolios for high-fidelity technical specifications.
            </p>
            <Link 
              href="/catalog"
              className="inline-flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 bg-white text-black rounded-full text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Explore Clinical Data
            </Link>
          </div>
          <div className="flex-1 relative w-full mt-8 md:mt-0">
            <div className="aspect-square rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/10 bg-[#0D0D0D] p-6 sm:p-8 shadow-2xl relative group">
              {/* Fake UI Preview */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                style={{ 
                  backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} 
              />
              
              {/* SCANNER LINE */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.8)] z-20 pointer-events-none"
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <div className="h-1.5 w-24 sm:w-32 bg-white/10 rounded-full" />
                  </div>
                  <div className="h-5 sm:h-6 px-2 sm:px-3 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                    <span className="text-[7px] sm:text-[8px] font-black text-blue-400 uppercase tracking-widest">Scanning</span>
                  </div>
                </div>
                
                {/* BLUEPRINT DATA FLOW */}
                <div className="space-y-3 sm:space-y-4 flex-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0.1 }}
                      whileInView={{ opacity: [0.1, 1, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                      className="flex items-center justify-between py-2 sm:py-3 border-b border-white/5"
                    >
                      <div className="h-1 w-20 sm:w-24 bg-blue-400/40 rounded-full" />
                      <div className="flex gap-2">
                        <div className="h-1 w-6 sm:w-8 bg-blue-400/20 rounded-full" />
                        <div className="h-1 w-10 sm:w-12 bg-blue-400/60 rounded-full" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-blue-500/5 border border-blue-500/20 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <span className="text-[7px] sm:text-[8px] font-black text-blue-400 uppercase tracking-widest">Technical Precision</span>
                    <span className="text-[9px] sm:text-[10px] font-mono text-blue-400">99.8% Match</span>
                  </div>
                  <div className="h-1 sm:h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['0%', '99.8%'] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="h-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,1)]"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 sm:-top-6 -right-2 sm:-right-6 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-blue-500 border border-blue-400 text-black font-black uppercase text-[8px] sm:text-[10px] tracking-widest shadow-2xl shadow-blue-500/20"
            >
              Blueprint Mode Active
            </motion.div>
          </div>
        </div>

        <div className="mt-16 sm:mt-24">
          <h3 className="text-xl sm:text-2xl font-black uppercase italic mb-8 sm:mb-10 text-center">Clinical Authority Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10">
            <div className="p-6 sm:p-8 bg-[#0D0D0D]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/40">Standard Manufacturer Portals</span>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                {['Static PDF Brochures Only', 'Generic Product Descriptions', 'No Anatomical Sizing Logic', 'Hidden Technical Specs', 'Basic Material Info'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-white/30">
                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 sm:p-8 bg-blue-500/5 relative">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ 
                  backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} 
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-blue-400">Agile Ortho Clinical Engine</span>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  {['Interactive Blueprint Extraction', 'Deep Technical Matrices', 'Anatomical Sizing Wizards', 'Full Clinical Indications', 'Verified Alloy Composition'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-blue-100 font-bold">
                      <Zap className="w-3 h-3 text-blue-400 fill-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
