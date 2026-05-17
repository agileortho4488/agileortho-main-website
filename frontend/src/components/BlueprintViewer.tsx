"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function BlueprintViewer() {
  return (
    <div className="relative aspect-video rounded-[40px] overflow-hidden border border-white/10 bg-[#0F172A] group shadow-2xl">
      <Image 
        src="/images/product-blueprint-bg.png" 
        alt="Product Blueprint Schematic" 
        fill
        className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent" />
      
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="flex items-center gap-3 mb-4">
           <div className="h-[1px] w-12 bg-primary/40" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Technical Specification</span>
        </div>
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">Blueprint Geometry</h3>
        <p className="text-sm text-white/60 max-w-md leading-relaxed">
           High-fidelity CAD-style overlays and alloy composition metrics extracted for precision surgical planning.
        </p>
      </div>

      {/* Simulated Telemetry Overlay */}
      <div className="absolute top-8 left-8 space-y-4">
         {[1, 2, 3].map(i => (
           <div key={i} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Channel_0{i} // Active</div>
           </div>
         ))}
      </div>
    </div>
  );
}
