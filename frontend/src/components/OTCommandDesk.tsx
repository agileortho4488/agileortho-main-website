"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Phone, ChevronRight, Activity, MapPin } from 'lucide-react';
import Link from 'next/link';

const DISTRICTS = [
  'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahabubnagar'
];

export default function OTCommandDesk() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDistrict, setCurrentDistrict] = useState(DISTRICTS[0]);

  // Rotate through districts to show active presence across Telangana
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDistrict(prev => {
        const nextIdx = (DISTRICTS.indexOf(prev) + 1) % DISTRICTS.length;
        return DISTRICTS[nextIdx];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-[100] hidden md:block">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 bg-[#0A0A0A]/95 backdrop-blur-2xl border border-primary/20 rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Surgical Support</span>
              </div>

              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4 leading-tight">
                OT Command <br />Desk Active
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Current Node</p>
                    <p className="text-sm font-black text-white">{currentDistrict}, TS</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/20">
                  <Activity className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm font-black text-white leading-tight">Coordinators Standby <br />for 33 Districts</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a 
                  href="https://wa.me/917416521222?text=EMERGENCY: Need OT Support for surgery in Telangana."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-primary text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Request Emergency Support
                </a>
                <Link 
                  href="/districts"
                  className="flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-primary transition-colors py-2"
                >
                  View Regional Hubs <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-3 px-6 py-4 rounded-full border shadow-2xl transition-all duration-500 ${
          isOpen 
            ? 'bg-primary border-primary text-black' 
            : 'bg-black/60 backdrop-blur-xl border-primary/40 text-white hover:border-primary'
        }`}
      >
        <div className="relative">
          <Zap className={`w-5 h-5 ${isOpen ? 'fill-black' : 'fill-primary text-primary animate-pulse'}`} />
          {!isOpen && (
            <motion.div 
              animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-primary/50 rounded-full blur-sm"
            />
          )}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
          {isOpen ? 'Close Command Desk' : 'OT Command Desk'}
        </span>
      </motion.button>
    </div>
  );
}
