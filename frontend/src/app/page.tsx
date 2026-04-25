"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Heart, 
  Stethoscope, 
  Dna, 
  Microscope, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  Globe,
  Award,
  Zap,
  Truck,
  UserCheck,
  Clock
} from 'lucide-react';
import PremiumHeader from '../components/PremiumHeader';
import StatsCounter from '../components/StatsCounter';
import SizingWizard from '../components/SizingWizard';
import TrustStrip from '../components/TrustStrip';
import ClinicalShowcase from '../components/ClinicalShowcase';

const SOLUTIONS = [
  { 
    title: 'Fracture Management', 
    desc: 'Anatomical plating systems and intramedullary nails engineered for early weight-bearing and stability.', 
    icon: Activity, 
    division: 'Trauma',
    slug: 'trauma'
  },
  { 
    title: 'Arthroplasty & Joint Care', 
    desc: 'Primary and revision joint replacement solutions for hip and knee with proprietary wear-reduction technology.', 
    icon: Stethoscope, 
    division: 'Joint Replacement',
    slug: 'joint-replacement'
  },
  { 
    title: 'Cardiovascular Life', 
    desc: 'Bio-mimetic coronary stents and biological heart valves representing the pinnacle of interventional logic.', 
    icon: Heart, 
    division: 'Cardiovascular',
    slug: 'cardiovascular'
  },
  { 
    title: 'Precision Endo-Surgery', 
    desc: 'Smart-stapling systems and laparoscopic instrumentation for minimally invasive excellence.', 
    icon: Dna, 
    division: 'Endo-Surgery',
    slug: 'endo-surgical'
  },
  { 
    title: 'Clinical Diagnostics', 
    desc: 'Advanced laboratory analyzers and rapid diagnostic test kits for hospital-wide accuracy.', 
    icon: Microscope, 
    division: 'Diagnostics',
    slug: 'diagnostics'
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30">
      <PremiumHeader />
      <TrustStrip />

      {/* 10-SECOND HERO: AUTHORITY & TRUST */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale opacity-40 mix-blend-overlay"
            style={{ backgroundImage: "url('/images/hero-bg.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          <motion.div 
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[60%] h-[60%] bg-primary/10 rounded-full blur-[160px]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-2xl">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/60">Master Partner: Meril Life Sciences</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter mb-8 leading-[0.8] font-heading uppercase italic">
              Surgery.<br />
              <span className="text-gradient-gold">Accelerated.</span>
            </h1>
            
            <p className="max-w-4xl mx-auto text-xl md:text-3xl text-muted-foreground mb-16 leading-tight font-medium">
              The Surgical Ecosystem of Telangana. We provide the <span className="text-white">clinical precision</span> of global leaders with the <span className="text-white">OT speed</span> of a local partner.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link 
                href="https://wa.me/918500204488?text=I%20need%20OT%20support%20for%20a%20surgery."
                className="group relative px-12 py-6 bg-[#CC2020] text-white font-black uppercase tracking-widest text-sm rounded-none border-b-4 border-black/30 hover:bg-[#E02020] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(204,32,32,0.3)] w-full sm:w-auto"
              >
                Request OT Support
              </Link>
              <Link 
                href="/catalog"
                className="px-12 py-6 rounded-none bg-transparent border border-white/20 font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all w-full sm:w-auto"
              >
                Clinical Solutions
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">CDSCO Certified</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">ISO 13485:2016</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">2-Hour Dispatch</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Master Distributor</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS: THE DOMINATION METRICS */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <StatsCounter value={967} label="Global Implants" suffix="+" />
            <StatsCounter value={33} label="Districts Optimized" />
            <StatsCounter value={24} label="Surgery Support" suffix="/7" />
            <StatsCounter value={100} label="Hospital Trust" suffix="%" />
          </div>
        </div>
      </section>

      {/* OT COMMAND CENTER: THE DIFFERENTIATION */}
      <section className="py-32 px-4 relative overflow-hidden bg-[#CC2020]/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
             <div>
                <motion.div 
                   initial={{ opacity: 0, x: -50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                >
                   <div className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-6 flex items-center gap-3">
                      <span className="h-[2px] w-12 bg-primary"></span>
                      The Surgeon's Toolkit
                   </div>
                   <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none uppercase italic">
                      Clinical<br />
                      <span className="text-primary text-4xl md:text-6xl">Intelligence.</span>
                   </h2>
                   <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-xl">
                      Precision surgery requires perfect sizing and clinical validation. Use our 
                      **Mechanical Sizing Wizard** and **Evidence Hub** to optimize your 
                      procedure selection in 33 districts.
                   </p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                      <div className="space-y-4">
                        <Link href="/evidence" className="group flex items-center gap-4 text-sm font-black uppercase tracking-widest text-primary border border-primary/20 px-6 py-4 rounded-xl hover:bg-primary/5 transition-all">
                           Evidence Hub
                        </Link>
                      </div>
                      <div className="space-y-4">
                        <Link href="/catalog" className="group flex items-center gap-4 text-sm font-black uppercase tracking-widest text-white border border-white/20 px-6 py-4 rounded-xl hover:bg-white/5 transition-all">
                           Catalog Desk
                        </Link>
                      </div>
                   </div>
                </motion.div>
             </div>
             <div className="relative group">
                <SizingWizard 
                   productName="Destiknee Total Knee System" 
                   visualStyle="cool_surgical_blue"
                   sizingData={{
                     metric: "Femoral A-P (mm)",
                     options: [
                       { min: 0, max: 55, size: "Size 1" },
                       { min: 55, max: 60, size: "Size 2" },
                       { min: 60, max: 65, size: "Size 3" },
                       { min: 65, max: 70, size: "Size 4" },
                       { min: 70, max: 75, size: "Size 5" },
                       { min: 75, max: 100, size: "Size 6" }
                     ]
                   }}
                />
             </div>
          </div>
        </div>
      </section>      {/* CLINICAL EXCELLENCE INITIATIVE — The Content Enrichment Hub */}
      <ClinicalShowcase />


      {/* SOLUTIONS SECTION: BEYOND PRODUCTS */}
      <section className="py-32 bg-[#0A0A0A] relative" id="solutions">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
             <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic">Clinical <span className="text-primary underline decoration-4 underline-offset-[12px]">Solutions</span></h2>
             <p className="max-w-3xl mx-auto text-xl text-muted-foreground">Moving from simple hardware to outcome-driven clinical segments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SOLUTIONS.map((sol, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-10 bg-[#111] border border-white/5 rounded-[40px] hover:border-primary/50 transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight className="w-8 h-8 text-primary" />
                </div>
                <sol.icon className="w-12 h-12 text-primary mb-8" />
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{sol.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {sol.desc}
                </p>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Division: {sol.division}</span>
                </div>
                <Link href={`/catalog/${sol.slug}`} className="absolute inset-0 z-10" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL FOOTER */}
      <footer className="py-32 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
             <div className="space-y-8">
                <div className="text-4xl font-black tracking-tighter uppercase italic">AGILE <span className="text-primary">HEALTHCARE</span></div>
                <p className="text-lg text-muted-foreground max-w-sm">
                  Authorized Master Franchise Distributor for Meril Life Sciences. Serving the future of surgery in Telangana.
                </p>
                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary transition-all cursor-pointer"><Globe className="w-5 h-5" /></div>
                   <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary transition-all cursor-pointer"><ShieldCheck className="w-5 h-5" /></div>
                </div>
             </div>
             
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
                <div>
                  <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">Surgical Desk</h5>
                  <ul className="space-y-4 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity">
                    <li><Link href="/catalog/trauma">Fracture Mgmt</Link></li>
                    <li><Link href="/catalog/joint-replacement">Joint Care</Link></li>
                    <li><Link href="/catalog/cardiovascular">Heart Solutions</Link></li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">Regional Hubs</h5>
                  <ul className="space-y-4 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity">
                    <li><Link href="/districts/hyderabad">Hyderabad</Link></li>
                    <li><Link href="/districts/warangal">Warangal</Link></li>
                    <li><Link href="/districts/nizamabad">Nizamabad</Link></li>
                  </ul>
                </div>
             </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
             <div>© 2026 Agile Healthcare Private Limited</div>
             <div className="flex gap-8">
                <span>Privacy Strategy</span>
                <span>Clinical Governance</span>
             </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
