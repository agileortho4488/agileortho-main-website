import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ShieldCheck, Truck, Clock, MapPin, Package, Phone, MessageCircle, BadgeCheck } from 'lucide-react';
import QuoteForm from './QuoteForm';

export const metadata: Metadata = {
  title: 'Orthopedic Implants & Surgical Supplies in Telangana | 2-Hour OT Dispatch — Agile Healthcare',
  description:
    'Meril master distributor for Telangana. Trauma implants, joint replacement, sutures & surgical consumables delivered to your OT in 2 hours. CDSCO licensed, ISO 13485. Request a callback & best price.',
  alternates: { canonical: 'https://www.agilehealthcare.in/quote' },
  robots: { index: true, follow: true },
};

const TRUST = [
  { icon: ShieldCheck, label: 'CDSCO Licensed' },
  { icon: BadgeCheck, label: 'ISO 13485:2016' },
  { icon: MapPin, label: 'All 33 Districts' },
  { icon: Clock, label: '24/7 OT Support' },
];

const WHY = [
  { icon: Truck, title: '2-hour OT dispatch', body: 'Implants and consumables reach your operating theatre fast — across Hyderabad and all of Telangana.' },
  { icon: Package, title: 'Full range in stock', body: 'Trauma plates, nails, screws (Meril), joint systems, sutures and surgical consumables — one supplier.' },
  { icon: ShieldCheck, title: 'Genuine & compliant', body: 'CDSCO licensed, ISO 13485 quality. Master partner of Meril Life Sciences.' },
  { icon: Clock, title: 'Emergency support', body: 'Same-day and after-hours delivery for urgent cases. One call and we move.' },
];

export default function QuotePage() {
  const wa = 'https://wa.me/917416521222?text=Hi%2C%20I%20need%20orthopedic%20supplies';
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* minimal header — no nav links, so ad visitors stay focused on the form */}
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/agile_healthcare_logo.png" alt="Agile Healthcare" width={150} height={40} className="h-9 w-auto" priority />
        </Link>
        <a href="tel:+917416521222" className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10">
          <Phone size={15} /> <span className="hidden sm:inline">+91 74165 21222</span><span className="sm:hidden">Call</span>
        </a>
      </header>

      {/* HERO — value prop + form above the fold */}
      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-14 pt-4 sm:px-8 md:grid-cols-2 md:items-center md:pt-8">
        <div>
          <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
            Meril Master Distributor · Telangana
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Orthopedic implants & surgical supplies —{' '}
            <span className="text-blue-400">at your OT in 2 hours</span>
          </h1>
          <p className="mt-4 max-w-lg text-slate-300">
            Hospitals and surgeons across Hyderabad and all 33 districts trust Agile Healthcare for trauma
            implants, joint systems, sutures and consumables — genuine, in stock, delivered fast.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {TRUST.map(({ icon: I, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-slate-300">
                <I size={16} className="text-blue-400" /> {label}
              </div>
            ))}
          </div>
        </div>
        <div className="md:pl-4">
          <QuoteForm />
        </div>
      </section>

      {/* WHY US */}
      <section className="border-t border-white/10 bg-white/[0.02] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">Why hospitals choose Agile</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ icon: I, title, body }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <I className="text-blue-400" size={24} />
                <h3 className="mt-3 font-semibold text-white">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-b from-blue-600/15 to-transparent p-8 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Need supplies for a case?</h2>
          <p className="mt-2 text-slate-300">Tell us what you need — we&apos;ll call you with availability and the best price.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="tel:+917416521222" className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white hover:bg-blue-500 sm:w-auto">
              <Phone size={18} /> Call +91 74165 21222
            </a>
            <a href={wa} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white hover:bg-emerald-500 sm:w-auto">
              <MessageCircle size={18} /> WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-white/10 bg-slate-950/95 p-3 backdrop-blur sm:hidden">
        <a href="tel:+917416521222" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white">
          <Phone size={17} /> Call
        </a>
        <a href={wa} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white">
          <MessageCircle size={17} /> WhatsApp
        </a>
      </div>
      <div className="h-16 sm:hidden" />
    </main>
  );
}
