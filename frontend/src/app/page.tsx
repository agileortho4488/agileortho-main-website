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
  Award
} from 'lucide-react';
import PremiumHeader from '../components/PremiumHeader';
import StatsCounter from '../components/StatsCounter';

export default function Home() {
  const divisions = [
    { title: 'Trauma', desc: 'Advanced anatomical plating systems and intramedullary nails for high-precision fracture management.', icon: Activity, color: 'primary', size: 'large' },
    { title: 'Cardiovascular', desc: 'World-class coronary stents and biological heart valves.', icon: Heart, color: 'red-500', size: 'medium' },
    { title: 'Diagnostics', desc: 'Precision laboratory analyzers and rapid diagnostic test kits.', icon: Microscope, color: 'blue-500', size: 'small' },
    { title: 'Orthopedics', desc: 'Primary and revision joint replacement solutions for hip and knee.', icon: Stethoscope, color: 'teal-500', size: 'small' },
    { title: 'Endo-Surgical', desc: 'Comprehensive range of staplers and laparoscopic instrumentation.', icon: Dna, color: 'purple-500', size: 'medium' },
  ];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30">
      <PremiumHeader />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, 60, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[5%] right-[-5%] w-[40%] h-[40%] bg-[#B8860B]/10 rounded-full blur-[100px]"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">Master Franchise Telangana</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] font-heading">
              <span className="block italic opacity-40">Precision</span>
              <span className="text-gradient-gold">Healthcare</span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-lg md:text-2xl text-muted-foreground mb-12 leading-relaxed font-medium">
              Authorized Master Distributor for <span className="text-white font-bold">Meril Life Sciences</span>. 
              Bridging world-class medical innovation to all 33 districts of Telangana.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/catalog" 
                className="group relative px-10 py-5 bg-primary text-black font-black uppercase tracking-widest text-sm rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(212,175,55,0.3)] w-full sm:w-auto"
              >
                <span className="relative z-10">Explore Catalog</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <button className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all w-full sm:w-auto">
                Distribution Login
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Advanced Counters */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            <StatsCounter value={967} label="Verified Products" suffix="+" />
            <StatsCounter value={33} label="Districts Served" />
            <StatsCounter value={13} label="Clinical Divisions" />
            <StatsCounter value={1} label="Master Partner" suffix="Meril" />
          </div>
        </div>
      </section>

      {/* Bento-Inspired Division Grid */}
      <section className="py-32 px-4 sm:px-6 lg:px-8" id="divisions">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 font-heading leading-none">
                Clinical <br />
                <span className="text-primary italic">Excellence.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Aggregating the entire Meril portfolio to provide the most comprehensive 
                medical device ecosystem in South India.
              </p>
            </div>
            <Link href="/catalog" className="btn-secondary group flex items-center gap-4 text-sm font-black uppercase tracking-widest text-primary border border-primary/20 px-8 py-4 rounded-2xl hover:bg-primary/5 transition-all">
              All Divisions
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[300px]">
            {divisions.map((div, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`
                  relative group cursor-pointer p-8 rounded-[32px] overflow-hidden border border-white/10 bg-[#141414] hover:border-primary/50 transition-all duration-500
                  ${div.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                  ${div.size === 'medium' ? 'md:col-span-2' : ''}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                      <div.icon className="w-7 h-7" />
                    </div>
                    <h3 className={`${div.size === 'large' ? 'text-4xl' : 'text-2xl'} font-black tracking-tight mb-4 group-hover:text-primary transition-colors`}>{div.title}</h3>
                    <p className={`text-muted-foreground leading-relaxed ${div.size === 'large' ? 'text-lg max-w-sm' : 'text-sm'}`}>
                      {div.desc}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Explore Products</span>
                    <ExternalLink className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Call to Action Tile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-1 border border-primary/20 bg-primary/5 p-8 rounded-[32px] flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Network Expansion</h4>
                <p className="text-sm text-muted-foreground mb-4">Are you a sub-distributor in Telangana?</p>
                <button className="w-full py-4 bg-primary text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">
                  Partner Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-12 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
             <div className="flex items-center gap-4">
                <Award className="w-8 h-8" />
                <span className="font-black text-xl uppercase tracking-tighter">Authorized Master Distributor</span>
             </div>
             <div className="text-4xl font-black italic tracking-tighter">MERIL LIFE SCIENCES</div>
             <div className="text-sm font-bold uppercase tracking-widest">Est. 2026</div>
          </div>
        </div>
      </section>

      {/* Footer 2.0 */}
      <footer className="py-32 bg-white/[0.02] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-30">
          <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] bg-primary/5 blur-[150px] rounded-full" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
            <div className="space-y-6">
               <div className="text-3xl font-black tracking-tighter">AGILE <span className="text-primary italic">ORTHO</span></div>
               <p className="text-muted-foreground leading-relaxed max-w-xs transition-colors hover:text-white">
                 Leading the transformation of medical device distribution in Telangana through speed, technology, and clinical depth.
               </p>
            </div>
            <div>
               <h5 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8">Clinical Focus</h5>
               <ul className="space-y-4 text-sm font-bold text-muted-foreground">
                 <li><Link href="/catalog" className="hover:text-primary transition-colors">Trauma & Orthopedic</Link></li>
                 <li><Link href="/catalog" className="hover:text-primary transition-colors">Cardiovascular Life</Link></li>
                 <li><Link href="/catalog" className="hover:text-primary transition-colors">Endo-Surgical Solutions</Link></li>
                 <li><Link href="/catalog" className="hover:text-primary transition-colors">In-Vitro Diagnostics</Link></li>
               </ul>
            </div>
            <div>
               <h5 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8">Organization</h5>
               <ul className="space-y-4 text-sm font-bold text-muted-foreground">
                 <li><Link href="/districts" className="hover:text-primary transition-colors">Districts Network</Link></li>
                 <li><button className="hover:text-primary transition-colors">Corporate Governance</button></li>
                 <li><button className="hover:text-primary transition-colors">Vigilance & Support</button></li>
               </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-muted-foreground font-medium">© 2026 Agile Healthcare. All Rights Reserved. Master Distributor for Telangana State.</p>
            <div className="flex items-center gap-8">
               <Link href="/privacy" className="text-[10px] uppercase tracking-widest font-black text-muted-foreground hover:text-white">Privacy</Link>
               <Link href="/terms" className="text-[10px] uppercase tracking-widest font-black text-muted-foreground hover:text-white">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
