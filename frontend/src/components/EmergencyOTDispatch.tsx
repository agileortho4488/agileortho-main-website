"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Zap } from 'lucide-react';
import OTDispatchModal from './OTDispatchModal';

export default function EmergencyOTDispatch() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ponytail: past-hero visibility, not full collision-avoidance — a plain scrollY threshold
  // (window height, no ref/IntersectionObserver) stops it covering the hero on load, which was
  // the actual reported bug; it can still graze content further down the page like any fixed bar.
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-4">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={pastHero ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        style={{ pointerEvents: pastHero ? 'auto' : 'none' }}
        className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center justify-between shadow-2xl"
      >
        <div className="flex items-center gap-4 px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Emergency OT Support</div>
            <div className="text-xs font-medium text-white/60">Dispatch ready in 33 districts</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="tel:+917416216262"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            <Phone className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Call HQ</span>
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-black font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp Dispatch</span>
          </button>
        </div>
      </motion.div>

      <OTDispatchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
