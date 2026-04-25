"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Send, CheckCircle2, Loader2 } from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiryType?: string;
  productInterest?: string;
  whatsappMessage?: string;
  source?: string;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  inquiryType = "General Inquiry",
  productInterest = "Not Specified",
  whatsappMessage = "Hi! I am interested in your products.",
  source = "website"
}: LeadCaptureModalProps) {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    hospital: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      
      // WhatsApp Redirection
      const waNumber = "918500204488";
      const text = encodeURIComponent(`${whatsappMessage}\n\nName: ${formState.name}\nHospital: ${formState.hospital}\nPhone: ${formState.phone}`);
      window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
      
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101] px-4"
          >
            <div className="bg-[#111] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{inquiryType}</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">Connect with a <br /><span className="text-primary">Clinical Specialist.</span></h3>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
                    <X className="w-6 h-6 text-white/40" />
                  </button>
                </div>

                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
                    <h4 className="text-2xl font-black uppercase italic mb-2">Request Received.</h4>
                    <p className="text-muted-foreground text-sm mb-8">Opening WhatsApp for immediate clinical support...</p>
                    <button 
                      onClick={onClose}
                      className="px-8 py-3 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs"
                    >
                      Close Window
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        required
                        placeholder="Your Name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <input 
                        type="tel" 
                        required
                        placeholder="WhatsApp / Phone Number"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        required
                        placeholder="Hospital / Clinic Name"
                        value={formState.hospital}
                        onChange={(e) => setFormState({ ...formState, hospital: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button 
                        disabled={isSubmitting}
                        className="w-full bg-primary text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit & Connect on WhatsApp
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-center text-white/20 uppercase tracking-[0.2em] font-bold mt-6">
                      Priority Response Guaranteed for Clinical Inquiries
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
