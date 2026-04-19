"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Beaker, Globe, CheckCircle2 } from 'lucide-react';

const trustItems = [
  { icon: Award, label: "CDSCO LICENSED" },
  { icon: ShieldCheck, label: "ISO 13485:2016" },
  { icon: Beaker, label: "GMP CERTIFIED" },
  { icon: Globe, label: "PAN-INDIA MASTER FRANCHISE" },
  { icon: CheckCircle2, label: "SURGICAL SUPPORT CERTIFIED" },
];

export default function TrustStrip() {
  return (
    <section className="py-6 border-y border-white/5 bg-white/[0.02] overflow-hidden whitespace-nowrap relative">
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#0A0A0A] to-transparent z-10" />
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#0A0A0A] to-transparent z-10" />
      
      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex items-center gap-16 w-max"
      >
        {[...trustItems, ...trustItems].map((item, i) => (
          <div key={i} className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity duration-500 cursor-default">
            <item.icon className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white tabular-nums">
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
