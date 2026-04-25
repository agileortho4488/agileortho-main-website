"use client";

import React from 'react';
import { useParams } from 'next/navigation';
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
import PremiumHeader from '../../../components/PremiumHeader';

const DIVISIONS = {
  'trauma': {
    name: 'Trauma & Reconstruction',
    subtitle: 'High-Impact Fracture Management',
    description: 'Advanced anatomical plating systems and intramedullary solutions engineered for complex trauma cases.',
    theme: 'blue',
    procedures: [
      { id: 'distal-radius', name: 'Distal Radius Fixation', icon: Target },
      { id: 'pfn', name: 'Proximal Femoral Nailing', icon: Activity },
      { id: 'trauma', name: 'Complex Humerus Fixation', icon: Layers }
    ],
    authorityText: 'Authorized Meril Trauma Master Distributor for Telangana.'
  },
  'arthroplasty': {
    name: 'Arthroplasty & Joints',
    subtitle: 'The Art of Mobility',
    description: 'World-class knee and hip replacement systems designed for natural kinematics and long-term survivorship.',
    theme: 'gold',
    procedures: [
      { id: 'tkr', name: 'Total Knee Replacement', icon: FlaskConical },
      { id: 'thr', name: 'Total Hip Replacement', icon: Stethoscope }
    ],
    authorityText: 'Precision Arthroplasty Ecosystem | Meril Master Partnership.'
  },
  'cardiovascular': {
    name: 'Cardiovascular Science',
    subtitle: 'Life-Saving Precision',
    description: 'State-of-the-art sirolimus-eluting stents and interventional accessories for superior clinical outcomes.',
    theme: 'red',
    procedures: [
      { id: 'ptca', name: 'Interventional Cardiology', icon: Microscope }
    ],
    authorityText: 'The Golden Standard in Regional Cardiac Supply.'
  }
};

export default function DivisionPage() {
  const { division } = useParams();
  const data = DIVISIONS[division as keyof typeof DIVISIONS] || DIVISIONS['trauma'];

  const themes = {
    blue: {
      bg: 'bg-[#050B14]',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
      accent: 'bg-blue-500',
      shadow: 'shadow-blue-500/20'
    },
    gold: {
      bg: 'bg-[#0A0A0A]',
      text: 'text-primary',
      border: 'border-primary/20',
      accent: 'bg-primary',
      shadow: 'shadow-primary/20'
    },
    red: {
      bg: 'bg-[#0F0505]',
      text: 'text-red-500',
      border: 'border-red-500/20',
      accent: 'bg-red-500',
      shadow: 'shadow-red-500/20'
    }
  };

  const theme = themes[data.theme as keyof typeof themes];

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
            {data.procedures.map((proc, i) => (
              <Link key={proc.id} href={`/solutions/${proc.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-10 rounded-[40px] bg-white/5 border border-white/5 hover:border-white/20 transition-all overflow-hidden"
                >
                   <div className={`absolute inset-0 ${theme.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                   
                   <proc.icon className={`w-12 h-12 mb-8 ${theme.text} group-hover:scale-110 transition-transform duration-500`} />
                   <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{proc.name}</h4>
                   <p className="text-sm text-muted-foreground mb-8">View clinical data, technical matrices, and procedural instrumentation ready-kits.</p>
                   
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">
                      Enter Solution
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                   </div>
                </motion.div>
              </Link>
            ))}
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
