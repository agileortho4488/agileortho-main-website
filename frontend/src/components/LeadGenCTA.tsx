"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LeadGenCTA({ productContext = "this equipment" }: { productContext?: string }) {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setSubmitted(true);
      console.log("LEAD CAPTURED FROM INSIGHT HUB:", phone, "Context:", productContext);
      // In production, trigger a webhook or CRM API here
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-8 bg-green-500/10 border border-green-500/20 rounded-2xl p-6 md:p-8 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex flex-shrink-0 items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Logistics Team Dispatched</h3>
          <p className="text-zinc-400 text-sm md:text-base">
            Our clinical consultant will contact you via WhatsApp shortly to finalize pricing and availability for {productContext}.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-10 bg-gradient-to-br from-[#0a192f] to-[#0d233a] border border-blue-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            Secure Immediate Pricing 
            <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider">Fast-Track</span>
          </h3>
          <p className="text-zinc-400 mb-0 leading-relaxed max-w-lg">
            Skip the standard procurement delays. Enter your WhatsApp number to get an immediate quote and inventory check for {productContext} in Telangana.
          </p>
        </div>

        <div className="w-full md:w-auto flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="WhatsApp Number"
                className="w-full sm:w-64 pl-10 pr-4 py-3 bg-[#020817] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={phone.length < 10}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group whitespace-nowrap"
            >
              Get Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          <p className="text-xs text-zinc-500 mt-2 text-center md:text-left">
            Average response time: &lt; 5 minutes.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
