"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Zap, 
  Heart, 
  Stethoscope, 
  Activity, 
  ChevronRight,
  Droplets
} from 'lucide-react';

const hotspots = [
  { 
    id: 'brain', 
    name: 'Neuro / Brain', 
    slug: 'neuro', 
    x: 50, 
    y: 10, 
    icon: Zap, 
    color: '#3b82f6',
    description: 'Neuromodulation & Surgical Systems'
  },
  { 
    id: 'heart', 
    name: 'Cardiovascular', 
    slug: 'cardiovascular', 
    x: 50, 
    y: 30, 
    icon: Heart, 
    color: '#ef4444',
    description: 'Stents, THV & Interventions'
  },
  { 
    id: 'spine', 
    name: 'Spine & Biologics', 
    slug: 'spine', 
    x: 50, 
    y: 50, 
    icon: Activity, 
    color: '#84cc16',
    description: 'Fusion & Motion Preservation'
  },
  { 
    id: 'gastro', 
    name: 'Gastro / Urology', 
    slug: 'urology', 
    x: 50, 
    y: 65, 
    icon: Droplets, 
    color: '#0ea5e9',
    description: 'Stents & Stone Management'
  },
  { 
    id: 'knee', 
    name: 'Hip & Knee', 
    slug: 'arthroplasty', 
    x: 55, 
    y: 85, 
    icon: Stethoscope, 
    color: '#f59e0b',
    description: 'Precision Arthroplasty Ecosystem'
  }
];

export default function HumanAnatomySelector() {
  const [activeHotspot, setActiveHotspot] = useState<typeof hotspots[0] | null>(null);

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12 px-4 flex flex-col md:flex-row items-center justify-center gap-12 bg-[#0A0A0A] rounded-[40px] border border-white/5 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {activeHotspot && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10"
              style={{ background: activeHotspot.color }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Anatomy Diagram Side */}
      <div className="relative w-full max-w-[300px] aspect-[1/2]">
        {/* Simple SVG Human Body Outline */}
        <svg viewBox="0 0 100 200" className="w-full h-full fill-none stroke-white/20 stroke-[0.5]">
          <path d="M50 15c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zM35 30l-5 40 5 45 10 75M65 30l5 40-5 45-10 75M35 45h30M40 90h20M45 150h10" />
          <circle cx="50" cy="24" r="9" className="stroke-white/10" />
          <path d="M41 33c-10 5-15 20-15 40M59 33c10 5 15 20 15 40" />
        </svg>

        {/* Hotspots */}
        {hotspots.map((spot) => (
          <motion.button
            key={spot.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            onMouseEnter={() => setActiveHotspot(spot)}
            onMouseLeave={() => setActiveHotspot(null)}
          >
            {/* Animated Ring */}
            <div className="relative flex items-center justify-center">
              <div 
                className="w-10 h-10 rounded-full border-2 opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ borderColor: spot.color }}
              />
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute w-12 h-12 rounded-full border"
                style={{ borderColor: spot.color }}
              />
              <div 
                className="absolute w-3 h-3 rounded-full"
                style={{ background: spot.color }}
              />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Info Card Side */}
      <div className="flex-1 w-full max-w-sm z-30">
        <div className="relative min-h-[300px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {activeHotspot ? (
              <motion.div
                key={activeHotspot.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${activeHotspot.color}20`, color: activeHotspot.color }}
                >
                  <activeHotspot.icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-2">
                  {activeHotspot.name}
                </h3>
                <p className="text-muted-foreground mb-8 text-sm font-medium">
                  {activeHotspot.description}
                </p>
                <Link 
                  href={`/catalog/${activeHotspot.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all group"
                >
                  Explore Division <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Clinical Navigator</span>
                </div>
                <h3 className="text-2xl font-black text-white/20 uppercase italic tracking-tighter mb-4">
                  Select an anatomical <br />area to begin
                </h3>
                <p className="text-xs text-white/10 max-w-[200px] mx-auto font-bold uppercase tracking-widest leading-relaxed">
                  Precision surgical solutions filtered by clinical focus.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
