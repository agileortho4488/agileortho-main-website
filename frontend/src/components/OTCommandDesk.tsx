"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, MapPin, Calendar, Clock, MessageSquare, ShieldCheck, ChevronRight } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

export default function OTCommandDesk() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    surgeryType: '',
    hospital: '',
    district: '',
    urgency: 'Emergency'
  });

  const handleRequest = () => {
    const message = `🚨 EMERGENCY OT SUPPORT REQUESTED\n\nSolution: ${form.surgeryType}\nHospital: ${form.hospital}\nDistrict: ${form.district}\nUrgency: ${form.urgency}\n\nPlease confirm personnel and instrumentation availability immediately.`;
    const waUrl = `https://wa.me/${COMPANY.whatsapp.replace("+", "")}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 bg-[#CC2020] text-white px-6 py-4 rounded-full shadow-[0_20px_40px_rgba(204,32,32,0.4)] border border-white/20 group"
          >
            <Zap className="w-5 h-5 fill-white animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">OT Command Desk</span>
          </motion.button>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-0 left-0 w-[380px] bg-[#0A0A0A] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#CC2020] p-8 text-white">
                <div className="flex justify-between items-center mb-6">
                    <Zap className="w-8 h-8 fill-white" />
                    <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-2 italic">Emergency<br />Dispatch.</h3>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Master Partner Support Portal</p>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6">
                {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 block mb-4">Select Surgical Solution</label>
                        <div className="grid grid-cols-1 gap-2">
                            {['Fracture / Trauma', 'Arthroplasty', 'Cardiovascular', 'Spine', 'Endo-Surgical'].map(type => (
                                <button 
                                    key={type}
                                    onClick={() => { setForm({...form, surgeryType: type}); setStep(2); }}
                                    className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/50 transition-all text-sm font-bold text-left hover:bg-primary/5 group"
                                >
                                    {type}
                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <input 
                            placeholder="Hospital Name"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all"
                            value={form.hospital}
                            onChange={(e) => setForm({...form, hospital: e.target.value})}
                        />
                        <input 
                            placeholder="District (e.g. Warangal)"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all"
                            value={form.district}
                            onChange={(e) => setForm({...form, district: e.target.value})}
                        />
                        
                        <div className="pt-4 flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 py-4 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white/40">Back</button>
                            <button 
                                onClick={handleRequest}
                                className="flex-[2] py-4 bg-primary text-black rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                            >
                                Dispatch Now
                            </button>
                        </div>
                    </motion.div>
                )}

                <div className="pt-8 border-t border-white/5 flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    CDSCO Validated Dispatch
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
