"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  Layers, 
  Activity,
  Award,
  ArrowRight,
  Target,
  FlaskConical,
  Microscope,
  Stethoscope
} from 'lucide-react';
import Link from 'next/link';
import PremiumHeader from './PremiumHeader';

export default function DivisionContent({ data, theme }: { data: any, theme: any }) {
  return (
    <main className={`min-h-screen text-white ${theme.bg}`}>
      <PremiumHeader />

      {/* Hero */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className={`absolute top-0 right-0 w-[50%] h-[50%] ${theme.accent} rounded-full blur-[160px] opacity-20`} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border mb-8 backdrop-blur-xl ${theme.text} ${theme.border}`}>
              <Zap className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black italic">{data.authorityText}</span>
            </div>
            
            <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter mb-8 uppercase italic leading-[0.8]">
              {data.name.split(' & ')[0]} <br />
              <span className={theme.text}>& {data.name.split(' & ')[1] || 'Hub'}.</span>
            </h1>
            
            <p className="max-w-3xl text-xl md:text-3xl text-muted-foreground mb-12 leading-tight">
              {data.description} Serving the surgeons of Telangana with zero-lag logistics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Procedures Grid */}
      <section className="py-24 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-20">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.5em] text-white/30 mb-4">Core Solutions</h2>
              <h3 className="text-5xl font-black uppercase tracking-tighter italic">Clinical <span className="text-white/30">Protocols.</span></h3>
            </div>
            <div className={`hidden md:block h-[2px] flex-grow mx-20 ${theme.border}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.procedures.map((proc: any, i: number) => {
              const Icon = proc.icon;
              return (
                <Link key={proc.id} href={`/solutions/${proc.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative p-10 rounded-[40px] bg-white/5 border border-white/5 hover:border-white/20 transition-all overflow-hidden"
                  >
                     <div className={`absolute inset-0 ${theme.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                     
                     <Icon className={`w-12 h-12 mb-8 ${theme.text} group-hover:scale-110 transition-transform duration-500`} />
                     <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{proc.name}</h4>
                     <p className="text-sm text-muted-foreground mb-8">View clinical data, technical matrices, and procedural instrumentation ready-kits.</p>
                     
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">
                        Enter Solution
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                     </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Division CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 uppercase italic leading-none">
            Secure the <br />
            <span className={theme.text}>Golden Hour.</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-16 leading-relaxed">
            Our division-specific hubs are optimized for rapid OT dispatch. From Adilabad to Hyderabad, we ensure the right implant is in the right hands, exactly when it matters.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
             <Link href="/contact" className={`px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs transition-all ${theme.accent} text-white ${theme.shadow} hover:scale-105 active:scale-95`}>
                Contact Division Specialist
             </Link>
             <Link href="/catalog" className="px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/5 transition-all">
                Browse Division Catalog
             </Link>
          </div>
        </div>
      </section>

      {/* Clinical Trust Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
           <div className={`p-12 rounded-[40px] border ${theme.border} bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden`}>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                 <div className={`w-24 h-24 rounded-full ${theme.accent}/10 border ${theme.border} flex items-center justify-center shrink-0`}>
                    <ShieldCheck className={`w-12 h-12 ${theme.text}`} />
                 </div>
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/30 mb-4">Evidence Based Performance</h3>
                    <p className="text-3xl md:text-5xl font-black tracking-tighter leading-tight italic uppercase">
                       {data.clinicalEvidence}
                    </p>
                 </div>
              </div>
              <Award className={`absolute -right-10 -bottom-10 w-64 h-64 opacity-5 ${theme.text}`} />
           </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-24 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
           {[
             { label: 'Products', value: '967+' },
             { label: 'Districts', value: '33' },
             { label: 'OT Success', value: '99.9%' },
             { label: 'Dispatch', value: '2hr' }
           ].map((stat, i) => (
             <div key={i}>
                <p className={`text-4xl font-black italic mb-2 ${theme.text}`}>{stat.value}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>
    </main>
  );
}
