"use client";

import React, { useState } from 'react';
import { CheckCircle2, Loader2, Phone } from 'lucide-react';

const NEEDS = [
  'Trauma Implants (plates, nails, screws)',
  'Joint Replacement',
  'Sutures & Surgical Consumables',
  'Cardiovascular',
  'Emergency / Same-day OT Support',
  'Bulk / Tender Quote',
  'Other',
];

export default function QuoteForm() {
  const [form, setForm] = useState({ name: '', phone: '', need: NEEDS[0] });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.phone.replace(/\D/g, '').length < 10) {
      setErr('Please enter your name and a 10-digit mobile number.');
      setStatus('error');
      return;
    }
    setStatus('loading'); setErr('');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, phone: form.phone,
          enquiryType: form.need, message: `Landing page enquiry: ${form.need}`,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Something went wrong');
      setStatus('success');
      // tell Meta & Google this click became a lead — so the ad algorithms find more like them
      try {
        (window as any).fbq?.('track', 'Lead');
        (window as any).gtag?.('event', 'generate_lead', { event_category: 'ad_landing', event_label: form.need });
      } catch { /* analytics must never block the form */ }
    } catch (e: any) {
      setStatus('error'); setErr(e.message || 'Could not send. Please call us directly.');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-white/5 border border-emerald-500/30 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 text-emerald-400" size={44} />
        <h3 className="text-xl font-semibold text-white">Thank you! We&apos;ve got your details.</h3>
        <p className="mt-2 text-slate-300">Our team will call you shortly. For anything urgent, call now:</p>
        <a href="tel:+917416521222" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500">
          <Phone size={18} /> +91 74165 21222
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white/5 border border-white/10 p-5 sm:p-6 backdrop-blur">
      <h2 className="text-lg font-semibold text-white">Get a callback & best price</h2>
      <p className="mt-1 text-sm text-slate-400">Takes 20 seconds. No obligation.</p>
      <div className="mt-4 space-y-3">
        <input
          name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your name" autoComplete="name"
          className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
        />
        <input
          name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Mobile number" inputMode="tel" autoComplete="tel"
          className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
        />
        <select
          name="need" value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })}
          className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
        >
          {NEEDS.map((n) => <option key={n} value={n} className="bg-slate-900">{n}</option>)}
        </select>
      </div>
      {status === 'error' && <p className="mt-3 text-sm text-amber-400">{err}</p>}
      <button
        type="submit" disabled={status === 'loading'}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
      >
        {status === 'loading' ? <><Loader2 className="animate-spin" size={18} /> Sending…</> : 'Request Callback'}
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">
        Prefer to talk now? <a href="tel:+917416521222" className="text-blue-400 hover:underline">Call +91 74165 21222</a>
      </p>
    </form>
  );
}
