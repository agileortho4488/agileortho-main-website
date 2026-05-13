"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Package, Home } from 'lucide-react';
import PremiumHeader from '../components/PremiumHeader';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center relative overflow-hidden">
      <PremiumHeader />
      
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--white-10)_0%,_transparent_70%)] opacity-20" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-8">Error 404 · Navigation Break</div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic mb-8 leading-none">
            Lost <br />
            <span className="text-white/20">Discovery.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            The clinical data you are looking for has been moved or archived during our latest catalog optimization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/catalog" 
              className="px-10 py-5 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-105 transition-all"
            >
              <Package className="w-4 h-4" />
              Explore Catalog
            </Link>
            <Link 
              href="/" 
              className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>

          <div className="mt-20 pt-10 border-t border-white/5">
             <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6 italic">Or search our 1,202 products directly</p>
             <div className="relative max-w-md mx-auto">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <input 
                  type="text" 
                  placeholder="Search clinical divisions..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-sm focus:outline-none focus:border-primary/40 transition-all"
                  onClick={() => {/* Trigger header search if possible */}}
                />
             </div>
          </div>
        </motion.div>
      </div>

      <footer className="absolute bottom-12 left-0 right-0 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/10">Agile Healthcare Technical Infrastructure v3.0</p>
      </footer>
    </main>
  );
}
