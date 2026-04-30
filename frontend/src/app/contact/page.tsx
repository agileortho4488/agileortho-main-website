"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Mail, Clock, Truck, Stethoscope, Briefcase, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import PremiumHeader from '../../components/PremiumHeader';

const ENQUIRY_TYPES = [
  'General Enquiry',
  'Bulk / Tender Quote',
  'Hospital Procurement',
  'Technical Specifications',
  'Trauma Implants',
  'Joint Replacement',
  'Cardiovascular',
  'Diagnostics',
  'Emergency OT Support',
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', organization: '', enquiryType: 'General Enquiry', message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Submission failed. Please call us directly.');
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30">
      <PremiumHeader />
      
      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        </div>
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
              Talk to Our <span className="text-primary">Product Specialists.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Bulk quotes, hospital procurement, technical specifications — we respond within 24 hours. For urgent enquiries, WhatsApp is the fastest route.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Direct Lines */}
      <section className="py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8 text-center">Direct Lines</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="https://wa.me/917416521222" target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-6 p-6 bg-[#0d1f0d] border border-[#25D366]/20 rounded-2xl hover:border-[#25D366]/60 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366] group-hover:scale-110 transition-all">
                <MessageCircle className="w-6 h-6 text-[#25D366] group-hover:text-black transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#25D366] mb-1">WhatsApp · Fastest</p>
                <p className="font-black text-lg">+917416521222</p>
              </div>
            </a>
            <a href="tel:+917416216262"
              className="group flex items-center gap-6 p-6 bg-[#111] border border-white/10 rounded-2xl hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                <Phone className="w-6 h-6 text-primary group-hover:text-black transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Sales Hotline</p>
                <p className="font-black text-lg">+917416216262</p>
              </div>
            </a>
            <a href="mailto:info@agilehealthcare.in"
              className="group flex items-center gap-6 p-6 bg-[#111] border border-white/10 rounded-2xl hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                <Mail className="w-6 h-6 text-primary group-hover:text-black transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Email</p>
                <p className="font-black text-base">info@agilehealthcare.in</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content: Form + Info */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Enquiry Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              className="lg:col-span-3"
            >
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Send us a message</h2>
              <p className="text-muted-foreground text-sm mb-10">Fill the form and we'll route your request to the right specialist.</p>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center p-16 bg-[#0d1f0d] border border-[#25D366]/30 rounded-3xl"
                  >
                    <CheckCircle2 className="w-16 h-16 text-[#25D366] mb-6" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">Enquiry Received!</h3>
                    <p className="text-muted-foreground mb-8 max-w-sm">Our specialist will call you back within 24 hours. For faster response, message us on WhatsApp.</p>
                    <a
                      href={`https://wa.me/917416521222?text=Hi, I just submitted an enquiry on agilehealthcare.in. My name is ${encodeURIComponent(form.name)}.`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Continue on WhatsApp
                    </a>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Your name*</label>
                        <input
                          id="contact-name"
                          type="text" name="name" required value={form.name} onChange={handleChange}
                          placeholder="Dr. Rajesh Kumar"
                          className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-sm font-medium text-white placeholder-white/20 focus:outline-none focus:border-primary/60 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Email*</label>
                        <input
                          id="contact-email"
                          type="email" name="email" required value={form.email} onChange={handleChange}
                          placeholder="doctor@hospital.com"
                          className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-sm font-medium text-white placeholder-white/20 focus:outline-none focus:border-primary/60 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Phone*</label>
                        <input
                          id="contact-phone"
                          type="tel" name="phone" required value={form.phone} onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-sm font-medium text-white placeholder-white/20 focus:outline-none focus:border-primary/60 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Hospital / Organization</label>
                        <input
                          id="contact-organization"
                          type="text" name="organization" value={form.organization} onChange={handleChange}
                          placeholder="Apollo Hospitals, Hyderabad"
                          className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-sm font-medium text-white placeholder-white/20 focus:outline-none focus:border-primary/60 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Enquiry Type</label>
                      <select
                        id="contact-enquiry-type"
                        name="enquiryType" value={form.enquiryType} onChange={handleChange}
                        className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-sm font-medium text-white focus:outline-none focus:border-primary/60 transition-colors appearance-none cursor-pointer"
                      >
                        {ENQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">
                        How can we help? Include product names or SKUs if known.
                      </label>
                      <textarea
                        id="contact-message"
                        name="message" required value={form.message} onChange={handleChange}
                        rows={5}
                        placeholder="E.g. Need 50 units of Distal Radius Locking Plates (SKU: MRL-TR-DRLP) for our trauma center in Warangal..."
                        className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-sm font-medium text-white placeholder-white/20 focus:outline-none focus:border-primary/60 transition-colors resize-none"
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-3 p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-sm text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {errorMsg}
                      </div>
                    )}

                    <button
                      id="contact-submit"
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full flex items-center justify-center gap-3 bg-primary text-black px-8 py-5 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                    >
                      {status === 'loading' ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                      ) : (
                        'Submit Enquiry →'
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Info Panel */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
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

              {/* Department Cards */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: 0.1 }}
                className="p-8 bg-[#111] border border-white/10 rounded-3xl space-y-6"
              >
                <h3 className="text-sm font-black uppercase tracking-widest text-white/50">Specialist Desks</h3>
                {[
                  { icon: Truck, label: 'Dispatch & Delivery', color: '#CC2020', phone: '+91 74168 18183', href: 'tel:+917416818183' },
                  { icon: Stethoscope, label: 'Ortho & Joint Orders', color: 'var(--primary)', phone: '+91 74161 62350', href: 'tel:+917416162350' },
                  { icon: Briefcase, label: 'Consumables & Diagnostics', color: 'var(--primary)', phone: '+91 74164 16871', href: 'tel:+917416416871' },
                  { icon: FileText, label: 'Billing & Finance', color: 'var(--primary)', phone: '+91 74164 16093', href: 'tel:+917416416093' },
                ].map(({ icon: Icon, label, color, phone, href }) => (
                  <a key={label} href={href} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white/5 group-hover:scale-110 transition-transform" style={{ color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</p>
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">{phone}</p>
                    </div>
                  </a>
                ))}
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
