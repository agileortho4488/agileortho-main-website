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
import HumanAnatomySelector from '@/components/HumanAnatomySelector';

// DIVISIONS COME FROM THE CATALOGUE, NOT FROM THIS FILE.
//
// This list used to be hand-written, and it was wrong in both directions at once. Every count was
// invented: Dental claimed 12 and holds 54, Cardiovascular claimed 160 and holds 64, Trauma claimed
// 218 and holds 351. Five divisions listed here did not exist at all, so a surgeon clicking
// Oncology, Neurosciences, Gastrointestinal, Aesthetics or Ophthalmology landed on
// "ERROR 404 NAVIGATION BREAK" — and /catalog/oncology carries the title "Oncology Medical Devices
// in Telangana", so search engines were sending people to a dead page. Meanwhile five divisions
// that DO have stock (Sports Medicine 31, Orthopedics 24, Peripheral Intervention 16, Surgical
// Robotics 4, Spine 3) had working pages that nothing on the site linked to.
//
// division_index.json is generated from the real catalogue by scripts/gen_division_index.mjs, so a
// division can only appear here if it has products, with the count it actually has. Re-run that
// script whenever catalog_products.json changes.
import DIVISION_INDEX from '@/data/division_index.json';

// Icon and colour are presentation, so they stay in code. Anything without an entry still renders
// with the neutral default rather than disappearing.
const DIVISION_STYLE: Record<string, { icon: React.ElementType; color: string }> = {
  trauma: { icon: Activity, color: 'text-primary' },
  arthroplasty: { icon: Stethoscope, color: 'text-primary' },
  cardiovascular: { icon: Heart, color: 'text-primary' },
  'endo-surgery': { icon: Scissors, color: 'text-primary' },
  diagnostics: { icon: Microscope, color: 'text-primary' },
  'infection-prevention': { icon: Package, color: 'text-primary' },
  instruments: { icon: Hammer, color: 'text-primary' },
  urology: { icon: Droplets, color: 'text-primary' },
  'critical-care': { icon: Container, color: 'text-primary' },
  ent: { icon: Ear, color: 'text-primary' },
  dental: { icon: Scissors, color: 'text-primary' },
  'sports-medicine': { icon: Activity, color: 'text-primary' },
  orthopedics: { icon: Activity, color: 'text-primary' },
  'peripheral-intervention': { icon: Heart, color: 'text-primary' },
  'surgical-robotics': { icon: Target, color: 'text-primary' },
  spine: { icon: Activity, color: 'text-primary' },
};

const divisions = (DIVISION_INDEX as { slug: string; name: string; count: number }[]).map((d) => ({
  ...d,
  icon: DIVISION_STYLE[d.slug]?.icon || Package,
  color: DIVISION_STYLE[d.slug]?.color || 'text-primary',
}));

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
              {/* was "50+ clinical verticals". The catalogue holds 16 divisions with products in
                  them; there is no reading of the data that reaches 50. Rendered from the index so
                  it cannot drift from the cards directly below it. */}
              Precision surgical solutions across {divisions.length} clinical divisions. 
              Search by clinical specialty, procedure, or anatomical location.
            </p>
          </motion.div>
        </header>

        {/* Anatomical Discovery Hub (New Visual Component) */}
        <div className="mb-32">
           <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-12 text-center">Visual Clinical Navigator</div>
           <HumanAnatomySelector />
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
