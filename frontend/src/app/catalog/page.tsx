"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Search, 
  Filter,
  Package,
  Activity,
  Heart,
  Stethoscope,
  Dna,
  Microscope,
  Zap,
  Ear,
  Hammer,
  Droplets,
  Container,
  Strikethrough,
  Box
} from 'lucide-react';
import PremiumHeader from '../../components/PremiumHeader';

const divisions = [
  { name: 'Trauma', slug: 'trauma', icon: Activity, count: 218, color: 'text-primary' },
  { name: 'Endo-Surgical', slug: 'endo-surgical', icon: Dna, count: 168, color: 'text-purple-500' },
  { name: 'Joint Replacement', slug: 'joint-replacement', icon: Stethoscope, count: 112, color: 'text-teal-500' },
  { name: 'Diagnostics', slug: 'diagnostics', icon: Microscope, count: 105, color: 'text-blue-500' },
  { name: 'Infection Prevention', slug: 'infection-prevention', icon: Package, count: 85, color: 'text-green-500' },
  { name: 'Cardiovascular', slug: 'cardiovascular', icon: Heart, count: 60, color: 'text-red-500' },
  { name: 'Surgical Instruments', slug: 'instruments', icon: Hammer, count: 53, color: 'text-orange-500' },
  { name: 'Sports Medicine', slug: 'sports-medicine', icon: Zap, count: 53, color: 'text-yellow-500' },
  { name: 'ENT', slug: 'ent', icon: Ear, count: 45, color: 'text-pink-500' },
  { name: 'Urology', slug: 'urology', icon: Droplets, count: 28, color: 'text-blue-400' },
  { name: 'Critical Care', slug: 'critical-care', icon: Container, count: 23, color: 'text-cyan-500' },
  { name: 'Peripheral Intervention', slug: 'peripheral-intervention', icon: Box, count: 13, color: 'text-indigo-500' },
];

export default function CatalogIndexPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30">
      <PremiumHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-32">
        {/* Header Section */}
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Master Global Catalog</span>
              <div className="h-[1px] w-20 bg-primary/20"></div>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-none">
              Clinical <br />
              <span className="text-gradient-gold">Solutions.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
              Explore 967+ world-class medical devices by Meril Life Sciences. 
              Organized by clinical specialty and surgical outcome.
            </p>
          </motion.div>
        </header>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {divisions.map((division, i) => (
            <motion.div
              key={division.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link 
                href={`/catalog/${division.slug}`}
                className="group relative block p-8 rounded-[32px] bg-[#111] border border-white/5 hover:border-primary/40 transition-all duration-500 overflow-hidden h-full"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-black transition-all duration-500`}>
                  <division.icon className="w-7 h-7" />
                </div>

                <h2 className="text-2xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors uppercase italic">
                  {division.name}
                </h2>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                   <div className="text-xs font-black uppercase tracking-widest text-white/40">
                      {division.count} SKUs Active
                   </div>
                   <div className="h-1 w-8 bg-muted group-hover:bg-primary group-hover:w-16 transition-all duration-500 rounded-full" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Teaser */}
      <footer className="py-20 border-t border-white/5 text-center">
         <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Master Franchise Connectivity</div>
         <div className="text-2xl font-black italic tracking-tighter text-white/40">AGILE HEALTHCARE x MERIL</div>
      </footer>
    </main>
  );
}
