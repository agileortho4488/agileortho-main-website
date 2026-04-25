"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Mail, Clock, Truck, Stethoscope, Briefcase, FileText } from 'lucide-react';
import PremiumHeader from '../../components/PremiumHeader';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30">
      <PremiumHeader />
      
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('/images/hero-bg.png')] bg-cover bg-center grayscale mix-blend-overlay" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl text-center mx-auto"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-2xl">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/60">Operations & Support</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none uppercase italic">
              OT Command <span className="text-primary">Center.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Direct lines to our specialized departments. For emergency surgical requirements, please contact the dispatch desk immediately.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Primary Contact Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 bg-[#111] border border-white/10 rounded-3xl hover:border-primary/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#CC2020]/20 flex items-center justify-center text-[#CC2020] group-hover:scale-110 transition-transform">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#CC2020] bg-[#CC2020]/10 px-3 py-1 rounded-full">High Priority</span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest mb-2">Dispatch & Delivery</h3>
                <p className="text-sm text-muted-foreground mb-6">Immediate OT delivery updates and emergency logistics tracking.</p>
                <a href="tel:+917416818183" className="text-2xl font-black text-white hover:text-[#CC2020] transition-colors block">+91 74168 18183</a>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 bg-[#111] border border-white/10 rounded-3xl hover:border-primary/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">24/7 Support</span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest mb-2">WhatsApp Sales</h3>
                <p className="text-sm text-muted-foreground mb-6">Direct messaging for quotes, product queries, and quick orders.</p>
                <a href="https://wa.me/917416521222" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-black bg-white px-6 py-3 rounded-full hover:bg-primary transition-colors">
                  Message Us
                </a>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-8 bg-[#111] border border-white/10 rounded-3xl hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest mb-2">Ortho & Spine Orders</h3>
                <p className="text-sm text-muted-foreground mb-6">Trauma, joint replacement, and spine implant configurations.</p>
                <a href="tel:+917416162350" className="text-xl font-bold text-white hover:text-primary transition-colors block">+91 74161 62350</a>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-8 bg-[#111] border border-white/10 rounded-3xl hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest mb-2">Consumables & Other</h3>
                <p className="text-sm text-muted-foreground mb-6">Diagnostics, endo-surgical, and general hospital supplies.</p>
                <a href="tel:+917416416871" className="text-xl font-bold text-white hover:text-primary transition-colors block">+91 74164 16871</a>
              </motion.div>
            </div>

            {/* Side Panel: HQ & General */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 bg-gradient-to-br from-primary/20 to-[#111] border border-primary/30 rounded-3xl"
              >
                <MapPin className="w-8 h-8 text-primary mb-6" />
                <h3 className="text-xl font-black uppercase tracking-widest mb-4">Headquarters</h3>
                <p className="text-muted-foreground mb-1 text-sm">1st Floor, Plot No 26, H.No 8-6-11/P20</p>
                <p className="text-muted-foreground mb-1 text-sm">Urmila Devi Complex, Engineers Colony</p>
                <p className="text-muted-foreground mb-6 text-sm">Hayathnagar, Hyderabad, Telangana - 500074</p>
                <div className="flex flex-col gap-2 text-sm text-white/60">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>Mon – Sat · 10:00 AM – 7:00 PM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 flex-shrink-0 text-primary" />
                    <span>Sundays: Closed · WhatsApp monitored 24/7</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 bg-[#111] border border-white/10 rounded-3xl"
              >
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-white/50">Additional Desks</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="font-bold text-sm uppercase tracking-wider">General Queries</span>
                    </div>
                    <a href="tel:+917416216262" className="text-muted-foreground hover:text-white transition-colors">+91 74162 16262</a>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-bold text-sm uppercase tracking-wider">Billing & Finance</span>
                    </div>
                    <a href="tel:+917416416093" className="text-muted-foreground hover:text-white transition-colors">+91 74164 16093</a>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="font-bold text-sm uppercase tracking-wider">Email Connect</span>
                    </div>
                    <a href="mailto:info@agileortho.in" className="text-muted-foreground hover:text-white transition-colors">info@agileortho.in</a>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>
      
      <footer className="py-12 border-t border-white/5 bg-black text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 AGILE ORTHOPEDICS PRIVATE LIMITED. All rights reserved. <Link href="/" className="text-primary hover:underline ml-2">Return to Home</Link></p>
        </div>
      </footer>
    </main>
  );
}
