"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Activity, CheckCircle2, Hospital, User, FileText, AlertTriangle } from 'lucide-react';

interface OTDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OTDispatchModal({ isOpen, onClose }: OTDispatchModalProps) {
  const [step, setStep] = useState<'form' | 'telemetry' | 'success'>('form');
  
  // Form State
  const [formData, setFormData] = useState({
    hospital: '',
    surgeon: '',
    procedure: 'Trauma / Fracture Fixation',
    urgency: 'Standard (24-48 Hours)',
    notes: ''
  });

  // Handle outside click or escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) setStep('form');
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('telemetry');
    
    // Simulate backend routing and ETA calculation
    setTimeout(() => {
      setStep('success');
      
      // Auto-redirect to WhatsApp after 2 seconds of success
      setTimeout(() => {
        const text = `🚨 *NEW OT DISPATCH REQUEST* 🚨\n\n*Hospital:* ${formData.hospital}\n*Surgeon:* ${formData.surgeon}\n*Procedure:* ${formData.procedure}\n*Urgency:* ${formData.urgency}\n*Notes:* ${formData.notes}`;
        window.open(`https://wa.me/918500204488?text=${encodeURIComponent(text)}`, '_blank');
        onClose();
      }, 2000);
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 pointer-events-none z-[201] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto relative"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-primary to-blue-500" />
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                    <div className="relative h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">OT Dispatch Center</h2>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest">Rapid Response Logistics</p>
                  </div>
                </div>

                {/* Content based on step */}
                <AnimatePresence mode="wait">
                  {step === 'form' && (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="space-y-4">
                        <div className="relative">
                          <Hospital className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input 
                            required
                            type="text" 
                            placeholder="Hospital Name / Location" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                            value={formData.hospital}
                            onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                          />
                        </div>
                        
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input 
                            required
                            type="text" 
                            placeholder="Primary Surgeon Name" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                            value={formData.surgeon}
                            onChange={(e) => setFormData({...formData, surgeon: e.target.value})}
                          />
                        </div>

                        <div className="relative">
                          <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <select 
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                            value={formData.procedure}
                            onChange={(e) => setFormData({...formData, procedure: e.target.value})}
                          >
                            <option value="Trauma / Fracture Fixation" className="bg-[#0A0A0A]">Trauma / Fracture Fixation</option>
                            <option value="Total Knee Replacement" className="bg-[#0A0A0A]">Total Knee Replacement</option>
                            <option value="Total Hip Replacement" className="bg-[#0A0A0A]">Total Hip Replacement</option>
                            <option value="Cardiovascular Intervention" className="bg-[#0A0A0A]">Cardiovascular Intervention</option>
                            <option value="Endo-Surgical / Laparoscopy" className="bg-[#0A0A0A]">Endo-Surgical / Laparoscopy</option>
                            <option value="Other Diagnostics" className="bg-[#0A0A0A]">Other Diagnostics</option>
                          </select>
                        </div>

                        <div className="relative">
                          <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <select 
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                            value={formData.urgency}
                            onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                          >
                            <option value="Standard (24-48 Hours)" className="bg-[#0A0A0A]">Standard Dispatch (24-48 Hours)</option>
                            <option value="Same Day (12-24 Hours)" className="bg-[#0A0A0A]">Same Day (12-24 Hours)</option>
                            <option value="EMERGENCY (2-4 Hours)" className="bg-[#0A0A0A]">EMERGENCY (2-4 Hours, Hyderbad Only)</option>
                          </select>
                        </div>

                        <div className="relative">
                          <FileText className="absolute left-4 top-4 w-4 h-4 text-white/40" />
                          <textarea 
                            placeholder="Required Implants / Sizes (e.g. Destiknee Size D, 3.5mm LCP Plate)" 
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-4 rounded-xl bg-primary text-black font-black uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors mt-4 flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Initialize Dispatch
                      </button>
                    </motion.form>
                  )}

                  {step === 'telemetry' && (
                    <motion.div 
                      key="telemetry"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="py-12 flex flex-col items-center justify-center text-center"
                    >
                      <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
                      <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-2">Calculating Logistics</h3>
                      <p className="text-sm font-mono text-white/40 mb-1">Pinging District Network...</p>
                      <p className="text-xs font-mono text-primary animate-pulse">Establishing HQ connection</p>
                    </motion.div>
                  )}

                  {step === 'success' && (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 flex flex-col items-center justify-center text-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">Request Secured</h3>
                      <p className="text-sm font-bold uppercase tracking-widest text-green-400 mb-6">HQ Routing Complete</p>
                      <p className="text-sm text-white/60 font-medium">Forwarding to secure WhatsApp dispatch channel...</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
