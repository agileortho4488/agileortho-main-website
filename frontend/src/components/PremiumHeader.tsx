"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Phone, MessageSquare, Search } from 'lucide-react';
import CommandSearch from './CommandSearch';

export default function PremiumHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [divisionsOpen, setDivisionsOpen] = useState(false);

  const divisionCategories = [
    {
      title: 'Musculoskeletal',
      links: [
        { name: 'Trauma & Reconstruction', href: '/divisions/trauma' },
        { name: 'Arthroplasty (Joints)', href: '/divisions/arthroplasty' },
        { name: 'Spine & Biologics', href: '/catalog/spine' },
        { name: 'Sports Medicine', href: '/catalog/sports-medicine' },
      ]
    },
    {
      title: 'Cardiovascular',
      links: [
        { name: 'Interventional Cardiology', href: '/divisions/cardiovascular' },
        { name: 'CRM & Lead Management', href: '/catalog/cardiovascular' },
        { name: 'Peripheral Intervention', href: '/catalog/peripheral' },
        { name: 'Venous & Thrombus', href: '/catalog/vascular' },
      ]
    },
    {
      title: 'Neurosciences',
      links: [
        { name: 'Neuro Interventional', href: '/catalog/neuro' },
        { name: 'Neurosurgical Systems', href: '/catalog/neuro' },
        { name: 'Pain Management', href: '/catalog/pain' },
        { name: 'EEG & Physiology', href: '/catalog/diagnostics' },
      ]
    },
    {
      title: 'Specialized Surgery',
      links: [
        { name: 'Endo-Surgery', href: '/catalog/endo-surgical' },
        { name: 'Urology & Gynecology', href: '/catalog/urology' },
        { name: 'Oncology & GI', href: '/catalog/oncology' },
        { name: 'Ophthalmology & ENT', href: '/catalog/ent' },
      ]
    },
    {
      title: 'Aesthetics & Wellness',
      links: [
        { name: 'Breast Implants', href: '/catalog/aesthetics' },
        { name: 'Liposuction & Fat Grafting', href: '/catalog/aesthetics' },
        { name: 'Fat Freezing', href: '/catalog/aesthetics' },
        { name: 'Meditation Devices', href: '/catalog/meditation' },
      ]
    }
  ];

  const navLinks = [
    { name: 'Catalog', href: '/catalog' },
    { name: 'Districts', href: '/districts' },
    { name: 'About', href: '/about' },
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
                <span className="text-xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors uppercase">AGILE</span>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground leading-none mt-1">Surgical Hub</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 ml-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-primary/80">Master Franchise</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <div 
                className="relative group"
                onMouseEnter={() => setDivisionsOpen(true)}
                onMouseLeave={() => setDivisionsOpen(false)}
              >
                <button 
                  className={`px-5 py-2 text-sm font-bold transition-colors flex items-center gap-1 ${
                    divisionsOpen ? 'text-white' : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  Divisions
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${divisionsOpen ? 'rotate-90' : ''}`} />
                </button>

                {/* Mega Menu */}
                <AnimatePresence>
                  {divisionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-4 w-[1000px] bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                      <div className="relative z-10 grid grid-cols-6 gap-8">
                        {divisionCategories.map((cat) => (
                          <div key={cat.title}>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">{cat.title}</h4>
                            <div className="flex flex-col gap-4">
                              {cat.links.map((link) => (
                                <Link 
                                  key={link.name} 
                                  href={link.href}
                                  className="text-sm font-bold text-muted-foreground hover:text-white transition-colors"
                                  onClick={() => setDivisionsOpen(false)}
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Clinical Spotlight Column */}
                        <div className="col-span-1 border-l border-white/5 pl-8">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6">Clinical Spotlight</h4>
                           <div className="p-5 rounded-2xl bg-white/5 border border-white/10 group/spotlight hover:border-primary/40 transition-all">
                              <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 italic">Landmark Trial</div>
                              <h5 className="text-sm font-black uppercase tracking-tight text-white mb-3 leading-tight">Myval TAVR System</h5>
                              <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">
                                Zero safety issues at 1-year across 1,000+ patients. The global gold standard.
                              </p>
                              <Link 
                                href="/divisions/cardiovascular" 
                                className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary group-hover/spotlight:translate-x-1 transition-transform"
                                onClick={() => setDivisionsOpen(false)}
                              >
                                View Data <ChevronRight className="w-3 h-3" />
                              </Link>
                           </div>
                           
                           <div className="mt-6 p-5 rounded-2xl bg-primary/5 border border-primary/20">
                              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 mb-2">OT Command Desk</div>
                              <p className="text-[10px] font-bold text-white leading-tight">Live surgical support active in 33 districts.</p>
                           </div>
                        </div>
                      </div>
                      
                      <div className="relative z-10 mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                         <div className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Total Clinical Ecosystem: 50+ Verticals Supported</div>
                         <Link 
                           href="/catalog" 
                           className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-white transition-colors flex items-center gap-2"
                           onClick={() => setDivisionsOpen(false)}
                         >
                           Explore All Clinical Verticals
                           <ChevronRight className="w-3 h-3" />
                         </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 w-10 h-10 rounded-full hover:bg-white/5 transition-all flex items-center justify-center text-white/60 hover:text-primary mr-2"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/contact"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors px-4"
              >
                <Phone className="w-4 h-4 text-primary" />
                Contact
              </Link>
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

      {/* Command Search Modal */}
      <CommandSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-10 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col gap-8">
                 {divisionCategories.map((cat) => (
                   <div key={cat.title}>
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">{cat.title}</h4>
                     <div className="flex flex-col gap-4 pl-2 border-l border-white/5">
                        {cat.links.map((link) => (
                          <Link 
                            key={link.name} 
                            href={link.href}
                            className="text-lg font-bold text-muted-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.name}
                          </Link>
                        ))}
                     </div>
                   </div>
                 ))}
              </div>

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
