"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Zap, UserCheck, CheckCircle2 } from 'lucide-react';
import PremiumHeader from '../../components/PremiumHeader';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30">
      <PremiumHeader />
      
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-black" />
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
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/60">Corporate Profile</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9] uppercase italic">
              Empowering the<br />
              <span className="text-primary">Surgeons of Telangana.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              Agile Healthcare is the premier authorized master distributor for Meril Life Sciences. We bridge the gap between world-class medical engineering and the operating theaters of Telangana.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that every patient deserves access to the highest quality medical implants, and every surgeon deserves a reliable partner who understands the critical nature of the OT environment.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                By maintaining a robust supply chain across all 33 districts of Telangana, we ensure that state-of-the-art trauma, joint replacement, and cardiovascular solutions are never more than a few hours away.
              </p>
              
              <div className="pt-8 grid grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-2">OT Ready</h4>
                    <p className="text-xs text-muted-foreground">Complete surgical kits and instruments delivered on demand.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Clinical Support</h4>
                    <p className="text-xs text-muted-foreground">Expert product guidance for complex procedures.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-auto md:h-[600px] bg-[#111] border border-white/10 rounded-3xl overflow-hidden flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50" />
              <div className="text-center p-8 relative z-10">
                <ShieldCheck className="w-24 h-24 text-primary mx-auto mb-8 opacity-80" />
                <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Quality Assured</h3>
                <p className="text-muted-foreground">ISO 13485:2016 Certified Supply Chain</p>
                <p className="text-muted-foreground">CDSCO Compliant Operations</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-16">The Agile Advantage</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-8 bg-[#111] border border-white/5 rounded-2xl hover:border-primary/30 transition-all">
              <Award className="w-10 h-10 text-primary mx-auto mb-6" />
              <h4 className="font-bold uppercase tracking-wider mb-4">Meril Master Partner</h4>
              <p className="text-sm text-muted-foreground">Direct access to the full 967+ product catalog of global innovations.</p>
            </div>
            <div className="p-8 bg-[#111] border border-white/5 rounded-2xl hover:border-primary/30 transition-all">
              <Zap className="w-10 h-10 text-primary mx-auto mb-6" />
              <h4 className="font-bold uppercase tracking-wider mb-4">2-Hour Dispatch</h4>
              <p className="text-sm text-muted-foreground">Rapid response logistics for emergency trauma requirements.</p>
            </div>
            <div className="p-8 bg-[#111] border border-white/5 rounded-2xl hover:border-primary/30 transition-all">
              <UserCheck className="w-10 h-10 text-primary mx-auto mb-6" />
              <h4 className="font-bold uppercase tracking-wider mb-4">33 Districts</h4>
              <p className="text-sm text-muted-foreground">Comprehensive coverage across the entire state of Telangana.</p>
            </div>
            <div className="p-8 bg-[#111] border border-white/5 rounded-2xl hover:border-primary/30 transition-all">
              <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-6" />
              <h4 className="font-bold uppercase tracking-wider mb-4">Verified Implants</h4>
              <p className="text-sm text-muted-foreground">100% genuine, trackable medical devices direct from the manufacturer.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 bg-black text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Agile Healthcare Private Limited. <Link href="/contact" className="text-primary hover:underline">Contact Us</Link></p>
        </div>
      </footer>
    </main>
  );
}
