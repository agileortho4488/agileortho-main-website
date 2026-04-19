"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Phone, MessageSquare } from 'lucide-react';

export default function PremiumHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products', href: '/catalog' },
    { name: 'Divisions', href: '/catalog#divisions' },
    { name: 'Districts', href: '/districts' },
    { name: 'About', href: '#' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-4' : 'py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`relative overflow-hidden transition-all duration-500 rounded-full border border-white/10 ${
            isScrolled 
              ? 'bg-black/60 backdrop-blur-xl px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' 
              : 'bg-transparent px-0 py-0 border-transparent'
          }`}
        >
          <div className="flex items-center justify-between relative z-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black font-black text-xl rotate-3 group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors">AGILE</span>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Healthcare</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="px-5 py-2 text-sm font-bold text-muted-foreground hover:text-white transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-5 right-5 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors px-4">
                <Phone className="w-4 h-4 text-primary" />
                Contact
              </button>
              <Link 
                href="/catalog" 
                className="bg-primary text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Catalog
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden w-10 h-10 flex items-center justify-center text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-10 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-2xl font-black tracking-tight flex items-center justify-between group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                  <ChevronRight className="w-6 h-6 text-primary group-hover:translate-x-2 transition-transform" />
                </Link>
              ))}
              <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                <button className="flex items-center gap-3 text-lg font-bold">
                  <Phone className="w-5 h-5 text-primary" />
                  +91 8500204488
                </button>
                <div className="bg-primary p-6 rounded-2xl text-black">
                  <h4 className="font-black text-xl mb-1">Join the Network</h4>
                  <p className="text-sm font-medium opacity-80 mb-4">Authorized Meril Master Distributor</p>
                  <button className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
