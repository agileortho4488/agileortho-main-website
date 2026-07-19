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
      <div className="border border-primary/40 bg-white/[0.03] backdrop-blur-2xl p-10 text-center">
        <CheckCircle2 className="mx-auto mb-4 text-primary" size={48} />
        <h3 className="font-heading text-2xl font-black uppercase italic tracking-tight text-white">Request received</h3>
        <p className="mt-3 text-muted-foreground">Our team will call you shortly. For an urgent case, call now:</p>
        <a href="tel:+917416521222" className="mt-6 inline-flex items-center gap-2 bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-white">
          <Phone size={16} /> +91 74165 21222
        </a>
      </div>
    );
  }

  const inputCls =
    'w-full border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder-white/40 outline-none transition-colors focus:border-primary/60';

  return (
    <form onSubmit={submit} className="border border-white/10 bg-white/[0.03] p-7 backdrop-blur-2xl sm:p-8">
      <div className="mb-1 text-[10px] font-black uppercase tracking-[0.35em] text-primary">Fast Response</div>
      <h2 className="font-heading text-2xl font-black uppercase italic leading-none tracking-tight text-white sm:text-3xl">
        Get a callback
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">Takes 20 seconds. No obligation.</p>

      <div className="mt-6 space-y-3">
        <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your name" autoComplete="name" className={inputCls} />
        <input name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Mobile number" inputMode="tel" autoComplete="tel" className={inputCls} />
        <select name="need" value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })}
          className={inputCls}>
          {NEEDS.map((n) => <option key={n} value={n} className="bg-[#0a0f1f] text-white">{n}</option>)}
        </select>
      </div>

      {status === 'error' && <p className="mt-3 text-sm text-amber-400">{err}</p>}

      <button type="submit" disabled={status === 'loading'}
        className="mt-6 flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-white disabled:opacity-60">
        {status === 'loading' ? <><Loader2 className="animate-spin" size={16} /> Sending…</> : 'Request Callback'}
      </button>
      <p className="mt-4 text-center text-xs text-white/40">
        Prefer to talk? <a href="tel:+917416521222" className="text-primary hover:underline">Call +91 74165 21222</a>
      </p>
    </form>
  );
}
