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
  Box,
  Sparkles,
  Eye,
  Scissors,
  Target
} from 'lucide-react';
import PremiumHeader from '../../components/PremiumHeader';

const divisions = [
  { name: 'Trauma & Reconstruction', slug: 'trauma', icon: Activity, count: 218, color: 'text-primary' },
  { name: 'Joint Replacement', slug: 'arthroplasty', icon: Stethoscope, count: 112, color: 'text-teal-500' },
  { name: 'Cardiovascular', slug: 'cardiovascular', icon: Heart, count: 160, color: 'text-red-500' },
  { name: 'Endo-Surgical', slug: 'endo-surgical', icon: Dna, count: 168, color: 'text-purple-500' },
  { name: 'Neurosciences', slug: 'neuro', icon: Zap, count: 45, color: 'text-blue-400' },
  { name: 'Diagnostics', slug: 'diagnostics', icon: Microscope, count: 105, color: 'text-blue-500' },
  { name: 'Infection Prevention', slug: 'infection-prevention', icon: Package, count: 85, color: 'text-green-500' },
  { name: 'Surgical Instruments', slug: 'instruments', icon: Hammer, count: 53, color: 'text-orange-500' },
  { name: 'Urology', slug: 'urology', icon: Droplets, count: 28, color: 'text-sky-500' },
  { name: 'Gastrointestinal', slug: 'gastro', icon: Box, count: 32, color: 'text-amber-500' },
  { name: 'Aesthetics', slug: 'aesthetics', icon: Sparkles, count: 42, color: 'text-pink-500' },
  { name: 'Oncology', slug: 'oncology', icon: Target, count: 15, color: 'text-indigo-500' },
  { name: 'Critical Care', slug: 'critical-care', icon: Container, count: 23, color: 'text-cyan-500' },
  { name: 'ENT', slug: 'ent', icon: Ear, count: 45, color: 'text-fuchsia-500' },
  { name: 'Ophthalmology', slug: 'ophthalmology', icon: Eye, count: 18, color: 'text-emerald-500' },
  { name: 'Dental', slug: 'dental', icon: Scissors, count: 12, color: 'text-slate-400' },
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
              Discovery <br />
              <span className="text-gradient-gold">Hub.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
              Precision surgical solutions for 50+ clinical verticals. 
              Search by clinical specialty, procedure, or anatomical location.
            </p>
          </motion.div>
        </header>

        {/* Anatomical Quick Filters */}
        <div className="mb-24">
           <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-8 text-center">Search by Anatomical Focus</div>
           <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'Brain & Spine', icon: Zap, slug: 'neuro' },
                { name: 'Heart & Vascular', icon: Heart, slug: 'cardiovascular' },
                { name: 'Shoulder & Arm', icon: Activity, slug: 'trauma' },
                { name: 'Hip & Knee', icon: Stethoscope, slug: 'arthroplasty' },
                { name: 'Gastro / Urology', icon: Droplets, slug: 'urology' }
              ].map((anatomy) => (
                <Link 
                  key={anatomy.name}
                  href={`/catalog/${anatomy.slug}`}
                  className="px-8 py-6 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group text-center min-w-[180px]"
                >
                   <anatomy.icon className="w-6 h-6 mx-auto mb-3 text-white/40 group-hover:text-primary transition-colors" />
                   <span className="text-xs font-black uppercase tracking-widest">{anatomy.name}</span>
                </Link>
              ))}
           </div>
        </div>

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
