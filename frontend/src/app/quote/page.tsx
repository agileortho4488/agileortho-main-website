import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ShieldCheck, Truck, Clock, Package, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import PremiumHeader from '../../components/PremiumHeader';
import TrustStrip from '../../components/TrustStrip';
import StatsCounter from '../../components/StatsCounter';
import QuoteForm from './QuoteForm';

export const metadata: Metadata = {
  title: 'Orthopedic Implants & Surgical Supplies in Telangana | 2-Hour OT Dispatch',
  description:
    'Meril master distributor for Telangana. Trauma implants, joint replacement, sutures & surgical consumables delivered to your OT in 2 hours. CDSCO licensed, ISO 13485. Request a callback & best price.',
  alternates: { canonical: 'https://www.agilehealthcare.in/quote' },
  robots: { index: true, follow: true },
};

const WHY = [
  { icon: Truck, title: '2-Hour OT Dispatch', body: 'Implants and consumables reach your theatre fast — across Hyderabad and all 33 districts of Telangana.' },
  { icon: Package, title: 'Full Range, In Stock', body: 'Trauma plates, nails, screws (Meril), joint systems, sutures and surgical consumables — one supplier.' },
  { icon: ShieldCheck, title: 'Genuine & Compliant', body: 'CDSCO licensed, ISO 13485 quality. Master partner of Meril Life Sciences.' },
  { icon: Clock, title: 'Emergency Support', body: 'Same-day and after-hours delivery for urgent cases. One call and we move.' },
];

export default function QuotePage() {
  const wa = 'https://wa.me/917416521222?text=Hi%2C%20I%20need%20orthopedic%20supplies';
  return (
    <main className="min-h-screen bg-[#050816] text-white font-body selection:bg-primary/30">
      <PremiumHeader />
      <TrustStrip />

      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0 z-0">
          <Image src="/images/operating-theatre.png" alt="" fill className="object-cover grayscale opacity-30 mix-blend-overlay" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-[#050816]/70 to-[#050816]" />
          <div className="absolute top-0 right-0 h-[60%] w-[55%] rounded-full bg-primary/10 blur-[160px]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-2xl">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/60">Meril Master Distributor · Telangana</span>
            </div>

            <h1 className="font-heading text-5xl font-black uppercase italic leading-[0.85] tracking-tighter sm:text-6xl lg:text-7xl">
              <span className="block">Surgical supplies.</span>
              <span className="block text-primary">At your OT in 2 hours.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
              Hospitals and surgeons across all 33 districts trust Agile Healthcare for trauma implants,
              joint systems, sutures and consumables — <span className="text-white">genuine, in stock, delivered fast.</span>
            </p>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
              {['CDSCO Licensed', 'ISO 13485:2016', 'All 33 Districts', '24/7 OT Support'].map((t) => (
                <div key={t} className="flex items-center gap-2"><ShieldCheck size={15} className="text-primary" /> {t}</div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <QuoteForm />
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="border-y border-white/10 bg-white/[0.02] py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-5 md:grid-cols-4 sm:px-8">
          <StatsCounter value={7100} label="Active SKUs" suffix="+" />
          <StatsCounter value={33} label="Districts Covered" />
          <StatsCounter value={2} label="Hour OT Dispatch" suffix="hr" />
          <StatsCounter value={24} label="Support" suffix="/7" />
        </div>
      </section>

      {/* WHY US — bento cards */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-primary">Why Agile</div>
          <h2 className="font-heading max-w-2xl text-3xl font-black uppercase italic tracking-tight sm:text-4xl">
            The surgical backbone of Telangana
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ icon: I, title, body }) => (
              <div key={title} className="group bg-[#0a0f1f] p-8 transition-colors hover:bg-[#0d1428]">
                <I className="text-primary transition-transform group-hover:-translate-y-1" size={26} />
                <h3 className="font-heading mt-5 text-lg font-bold uppercase tracking-tight text-white">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-24 sm:px-8">
        <div className="relative mx-auto max-w-4xl overflow-hidden border border-white/10 bg-white/[0.02] p-10 text-center sm:p-14">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <h2 className="font-heading text-3xl font-black uppercase italic tracking-tight sm:text-4xl">Need supplies for a case?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Tell us what you need — we&apos;ll call you with availability and the best price.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="tel:+917416521222" className="flex w-full items-center justify-center gap-2 bg-primary px-10 py-5 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-white sm:w-auto">
              <Phone size={17} /> Call +91 74165 21222
            </a>
            <a href={wa} className="flex w-full items-center justify-center gap-2 border border-white/20 px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black sm:w-auto">
              <MessageCircle size={17} /> WhatsApp Us <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-white/10 bg-[#050816]/95 p-3 backdrop-blur-xl sm:hidden">
        <a href="tel:+917416521222" className="flex flex-1 items-center justify-center gap-2 bg-primary py-3.5 text-sm font-black uppercase tracking-wider text-black">
          <Phone size={16} /> Call
        </a>
        <a href={wa} className="flex flex-1 items-center justify-center gap-2 border border-white/20 py-3.5 text-sm font-black uppercase tracking-wider text-white">
          <MessageCircle size={16} /> WhatsApp
        </a>
      </div>
      <div className="h-20 sm:hidden" />
    </main>
  );
}
