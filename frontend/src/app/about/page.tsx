"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Zap, UserCheck, CheckCircle2, History, Target, Globe, Microscope } from 'lucide-react';
import PremiumHeader from '../../components/PremiumHeader';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30">
      <PremiumHeader />
      
      {/* Hero Section: High Clinical Authority */}
      <section className="relative pt-40 pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--primary)_0%,_transparent_50%)] opacity-20" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-2xl">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/60">Corporate Legacy & Vision</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] uppercase italic">
              Clinical <span className="text-primary">Precision.</span><br />
              Agile <span className="text-white/40">Logistics.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl">
              Agile Orthopedics Private Limited is the authorized **Master Franchise Distributor** for Meril Life Sciences across the 33 districts of Telangana. We don't just move boxes; we manage the lifecycle of surgical excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History & Mission Section */}
      <section className="py-24 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-10"
            >
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <History className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic">The Agile Journey</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Founded with a vision to bridge the gap between global medical innovation and regional accessibility, Agile Healthcare has evolved into the cornerstone of surgical supply in Telangana. 
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Headquartered in Hyderabad, we have built a multi-layered logistics engine that serves major tertiary care hospitals and remote district medical centers with equal precision.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
                  <Target className="w-8 h-8 text-primary mb-4" />
                  <h4 className="font-bold uppercase tracking-widest text-sm mb-3">Our Mission</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    To ensure that every OT in Telangana has access to world-class implants within the "Golden Hour" of surgical requirement.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
                  <Globe className="w-8 h-8 text-primary mb-4" />
                  <h4 className="font-bold uppercase tracking-widest text-sm mb-3">State-Wide Reach</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A robust supply chain footprint covering all 33 districts, from Adilabad to Bhadradri Kothagudem.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative p-1 border border-white/10 rounded-[2.5rem] overflow-hidden group"
            >
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
              <div className="relative bg-[#0A0A0A] rounded-[2.2rem] p-12 overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                
                <Microscope className="w-20 h-20 text-primary mb-8" />
                <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-6">Clinical Authority</h3>
                
                <div className="space-y-6">
                  {[
                    "ISO 13485:2016 Certified Operations",
                    "Direct Meril Master Partnership",
                    "CDSCO Compliant Cold-Chain & Storage",
                    "Dedicated Clinical Product Specialists",
                    "24/7 Emergency OT Technical Support"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium text-white/80">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/20">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 text-center">Authorized Distributor</p>
                  <p className="text-2xl font-black text-center text-white">MERIL LIFE SCIENCES</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Operations Section: Cool Surgical Blue Theme */}
      <section className="py-24 relative overflow-hidden bg-[#050B14] border-y border-blue-500/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic mb-6">
              Agile <span className="text-blue-400">Operations</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our logistical engine is designed for the critical nature of orthopedic and cardiovascular surgeries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Zap, 
                title: "2-Hour Dispatch", 
                desc: "Emergency trauma kits dispatched within 120 minutes for critical cases.",
                color: "text-blue-400"
              },
              { 
                icon: ShieldCheck, 
                title: "Quality Vault", 
                desc: "Stringent quality controls ensuring every implant is 100% genuine and trackable.",
                color: "text-blue-400"
              },
              { 
                icon: UserCheck, 
                title: "Expert Desk", 
                desc: "Clinical specialists available to assist surgeons with complex sizing and instrumentation.",
                color: "text-blue-400"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 rounded-3xl bg-blue-950/20 border border-blue-500/20 hover:border-blue-400/50 transition-all text-center group"
              >
                <item.icon className={`w-12 h-12 mx-auto mb-8 ${item.color} group-hover:scale-110 transition-transform`} />
                <h4 className="text-xl font-black uppercase tracking-widest mb-4 italic">{item.title}</h4>
                <p className="text-sm text-blue-200/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Stats Strip */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-4xl font-black text-primary mb-1 italic">967+</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Products</p>
            </div>
            <div>
              <p className="text-4xl font-black text-primary mb-1 italic">33</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Districts</p>
            </div>
            <div>
              <p className="text-4xl font-black text-primary mb-1 italic">14</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Clinical Divs</p>
            </div>
            <div>
              <p className="text-4xl font-black text-primary mb-1 italic">24/7</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">OT Support</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 bg-black text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 AGILE ORTHOPEDICS PRIVATE LIMITED. All rights reserved. <Link href="/contact" className="text-primary hover:underline ml-2">Contact Specialist</Link></p>
        </div>
      </footer>
    </main>
  );
}
