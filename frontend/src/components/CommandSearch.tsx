"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, Package, Activity, MapPin, Zap, Microscope } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  type: 'product' | 'division' | 'district' | 'procedure';
  title: string;
  subtitle: string;
  link: string;
  icon: any;
}

export default function CommandSearch({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      loadData();
    }
  }, [isOpen]);

  async function loadData() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setAllProducts(data);
    } catch (err) {
      console.error('Failed to load products for search:', err);
    }
  }

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchLower = query.toLowerCase();
    const filtered: SearchResult[] = [];

    // Search Products (Top 5)
    const productMatches = allProducts
      .filter(p => 
        p.product_name_display?.toLowerCase().includes(searchLower) ||
        p.brand?.toLowerCase().includes(searchLower) ||
        p.category?.toLowerCase().includes(searchLower) ||
        Object.values(p.technical_specifications || {}).some(v => String(v).toLowerCase().includes(searchLower))
      )
      .slice(0, 8);

    productMatches.forEach(p => {
      filtered.push({
        type: 'product',
        title: p.product_name_display,
        subtitle: `${p.division_canonical} | ${p.brand || 'Meril'}`,
        link: `/catalog/products/${p.slug}`,
        icon: Package
      });
    });

    // Search Divisions
    const divisions = ['Trauma', 'Cardiovascular', 'Joint Replacement', 'Endo-Surgery', 'Diagnostics'];
    divisions.forEach(d => {
      if (d.toLowerCase().includes(searchLower)) {
        filtered.push({
          type: 'division',
          title: d,
          subtitle: 'Clinical Division',
          link: `/catalog/${d.toLowerCase().replace(/ /g, '-')}`,
          icon: Activity
        });
      }
    });

    // Search Districts
    const districts = [
      'Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Mahabubnagar', 'Nalgonda', 'Adilabad'
    ];
    districts.forEach(d => {
      if (d.toLowerCase().includes(searchLower)) {
        filtered.push({
          type: 'district',
          title: d,
          subtitle: 'Regional Supply Hub',
          link: `/districts/${d.toLowerCase().replace(/ /g, '-')}`,
          icon: MapPin
        });
      }
    });

    setResults(filtered);
  }, [query, allProducts]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-3xl z-[101] px-4"
          >
            <div className="bg-[#111] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl shadow-primary/10">
              {/* Search Input */}
              <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-white/[0.02]">
                <Search className="w-6 h-6 text-primary" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, materials, procedures, or part numbers..."
                  className="flex-1 bg-transparent border-none text-xl font-bold focus:outline-none placeholder:text-white/20"
                />
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>

              {/* Results Container */}
              <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                {query.length === 0 ? (
                  <div className="py-20 text-center">
                    <Microscope className="w-12 h-12 text-white/5 mx-auto mb-4" />
                    <p className="text-white/30 font-bold italic tracking-tight uppercase text-xs">Agile Clinical Intelligence Search</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map((result, i) => (
                      <Link
                        key={i}
                        href={result.link}
                        onClick={onClose}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
                          <result.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white group-hover:text-primary transition-colors uppercase italic tracking-tight">{result.title}</h4>
                          <p className="text-xs text-white/40 uppercase tracking-widest">{result.subtitle}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <Zap className="w-12 h-12 text-primary/20 mx-auto mb-4 animate-pulse" />
                    <p className="text-white/40 font-black uppercase tracking-widest text-xs">No direct clinical matches for "{query}"</p>
                    <button className="mt-4 px-6 py-3 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all">
                      Request Technical Search Support
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Powered by Meril Product Knowledge Graph</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-white/5 rounded text-[8px] font-black text-white/40 uppercase">Esc</span>
                    <span className="text-[8px] font-black text-white/20 uppercase">to Close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
