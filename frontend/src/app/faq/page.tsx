import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';
import PremiumHeader from '../../components/PremiumHeader';

export const metadata: Metadata = {
  title: 'FAQ — Meril Distributor Telangana | Implants, Diagnostics, OT Support | Agile Healthcare',
  description:
    'Answers about Agile Healthcare: authorized Meril Life Sciences master franchise for Telangana, 2-hour OT implant dispatch in Hyderabad, buying diagnostics reagents online, bulk & tender pricing, and coverage across all 33 districts.',
  alternates: { canonical: 'https://www.agilehealthcare.in/faq' },
};

const FAQS: [string, string][] = [
  ['Who is the authorized Meril Life Sciences distributor in Hyderabad and Telangana?',
   'Agile Healthcare (Agile Orthopedics Pvt Ltd) is the authorized Meril Life Sciences master franchise distributor for the entire state of Telangana, headquartered in Hyderabad and serving hospitals, surgeons, clinics and diagnostic labs across all 33 districts. Call +91 74165 21222 to verify or order.'],
  ['How fast can orthopedic implants reach my hospital operating theatre?',
   'Within Hyderabad we dispatch implants and instrument sets to the OT in about 2 hours. Across other Telangana districts we offer same-day or next-morning delivery depending on distance, with 24/7 emergency OT support for urgent trauma cases.'],
  ['What medical products does Agile Healthcare supply?',
   'Over 1,200 devices across orthopedic trauma implants (plates, nails, screws), joint replacement, arthroscopy, spine, cardiovascular, endo-surgery, urology, ENT, sutures and surgical consumables, and Meril Diagnostics laboratory reagents and IVD kits.'],
  ['Can I get trauma implants urgently for a surgery tonight or on a weekend?',
   'Yes. We run 24/7 emergency OT support. Call or WhatsApp +91 74165 21222 with the implant specification and hospital name — the on-call dispatch team moves immediately, including nights and holidays.'],
  ['Can I buy Meril Diagnostics reagents online in India?',
   'Yes. Our diagnostics store at agilehealthcare.shop lists Meril Diagnostics biochemistry reagents and IVD kits with GST invoice, bulk pricing for laboratories, and delivery across India. Standing monthly orders get additional discounts.'],
  ['Do you deliver outside Hyderabad — to smaller districts of Telangana?',
   'Yes — all 33 districts of Telangana are covered, including Warangal, Karimnagar, Nizamabad, Khammam and Mahbubnagar. District-level demand is served through scheduled routes and emergency dispatch.'],
  ['How do I get a price quote for implants or hospital supply?',
   'Use the 20-second form at agilehealthcare.in/quote, or call/WhatsApp +91 74165 21222. Our team responds the same day with availability and best pricing, including bulk and tender rates for hospital procurement.'],
  ['Are the implants and reagents genuine and regulator-approved?',
   'Yes. We are CDSCO licensed and ISO 13485:2016 certified, supplying only genuine Meril Life Sciences products through the authorized master franchise channel, with full batch traceability and GST invoicing.'],
  ['Do you offer bulk pricing or hospital tender pricing?',
   'Yes. Hospitals and institutional buyers get negotiated contract pricing, and our online stores offer quantity discounts (for example at 5, 10 and 25 units). For tenders and rate contracts, contact our team with the requirement list.'],
  ['Do you provide loaner instrument sets for surgeries?',
   'Yes. Complete sterilized implant-and-instrument sets are dispatched to the hospital for each case and collected after surgery — only the implants used are billed. This is the standard workflow for trauma and joint cases.'],
  ['Do you give GST invoices for lab and hospital purchases?',
   'Yes. Every sale carries a GST invoice (GSTIN 36AATCA5653R1ZO). Labs and hospitals can register their GSTIN at checkout on our online stores or share it with the sales team for offline orders.'],
  ['How can my pharmacy or surgical store become a sub-dealer?',
   'We work with sub-distributors and surgical stores across Telangana and Andhra Pradesh. Send your store details on WhatsApp +91 74165 21222 or through the contact page — our team will share dealer terms and the product catalog.'],
];

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(([q, a]) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  return (
    <main className="min-h-screen bg-[#050816] text-white font-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PremiumHeader />
      <section className="mx-auto max-w-4xl px-5 pt-32 pb-20 sm:px-8">
        <div className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-primary">Answers</div>
        <h1 className="font-heading text-4xl font-black uppercase italic tracking-tight sm:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Everything hospitals, surgeons, labs and dealers ask us about Meril supply in Telangana.
        </p>
        <div className="mt-10 space-y-3">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group border border-white/10 bg-white/[0.03] p-5 open:border-primary/40">
              <summary className="cursor-pointer list-none font-heading text-base font-bold text-white marker:content-none group-open:text-primary">
                {q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center gap-4 border border-white/10 bg-white/[0.02] p-8 text-center sm:flex-row sm:justify-center">
          <a href="tel:+917416521222" className="flex items-center gap-2 bg-primary px-8 py-4 text-xs font-black uppercase tracking-widest text-black hover:bg-white">
            <Phone size={15} /> Call +91 74165 21222
          </a>
          <a href="https://wa.me/917416521222" className="flex items-center gap-2 border border-white/20 px-8 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-white hover:text-black">
            <MessageCircle size={15} /> WhatsApp us
          </a>
          <Link href="/quote" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
            Get a quote →
          </Link>
        </div>
      </section>
    </main>
  );
}
