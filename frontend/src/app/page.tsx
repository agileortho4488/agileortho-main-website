"use client";

import React, { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteFooter from '@/components/SiteFooter';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import {
  Bone,
  HeartPulse,
  PersonStanding,
  Scissors,
  TestTubes,
  ChevronRight,
  ShieldCheck,
  Award,
  Truck,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import dynamic from 'next/dynamic';
import PremiumHeader from '../components/PremiumHeader';
import StatsCounter from '../components/StatsCounter';
import TrustStrip from '../components/TrustStrip';
// Code-split the heavy below-the-fold widgets into their own chunks (Lighthouse flagged ~140 KiB
// of unused JS / 8 long tasks on this page). SSR stays on (no `ssr: false`) so this only trims
// the initial bundle — it does NOT remove server-rendered HTML, so CLS and SEO text are unaffected.
const SizingWizard = dynamic(() => import('../components/SizingWizard'));
const ClinicalShowcase = dynamic(() => import('../components/ClinicalShowcase'));
const BlueprintViewer = dynamic(() => import('../components/BlueprintViewer'));
const TelanganaMap = dynamic(() => import('../components/TelanganaMap'));

gsap.registerPlugin(ScrollTrigger);

// ICONS ARE CLINICAL SIGNAGE ON THIS SITE, NOT DECORATION. The previous set was wrong in ways a
// surgeon reads instantly: a DNA helix for stapling and laparoscopy, a stethoscope for knee and hip
// replacement, a heart-rate trace for fractures. Each is now the instrument or anatomy the division
// actually sells.
//
// COLOUR: five accents were in use here — blue-400, red-500, purple-500 and blue-500 alongside the
// brand gold — and purple-on-blue is the single most recognisable AI-template fingerprint. The
// company's own design system (design_guidelines.json) specifies ONE accent, Agile Gold. Restored.
const SOLUTIONS = [
  {
    title: 'Trauma & Fracture',
    desc: 'Anatomical plating systems and intramedullary nails engineered for early weight-bearing and stability.',
    icon: Bone,
    division: 'Trauma',
    slug: 'trauma',
    skus: 8233,   // measured from the item catalogue, not an estimate
  },
  {
    title: 'Arthroplasty',
    desc: 'Primary and revision joint replacement for hip and knee, across the full size range surgeons ask for.',
    icon: PersonStanding,
    division: 'Joint Replacement',
    slug: 'arthroplasty',
    skus: 158,   // measured from the item catalogue, not an estimate
  },
  {
    title: 'Cardiovascular',
    desc: 'Coronary stents and biological heart valves for interventional cardiology.',
    icon: HeartPulse,
    division: 'Cardiovascular',
    slug: 'cardiovascular',
    skus: 15,   // measured from the item catalogue, not an estimate
  },
  {
    title: 'Endo-Surgery',
    desc: 'Surgical stapling systems and laparoscopic instrumentation for minimally invasive procedures.',
    icon: Scissors,
    division: 'Endo-Surgery',
    slug: 'endo-surgery',
    skus: 1178,   // measured from the item catalogue, not an estimate
  },
  {
    title: 'Diagnostics',
    desc: 'Laboratory analysers and reagents, plus rapid test kits, supplied to hospital and standalone labs.',
    icon: TestTubes,
    division: 'Diagnostics',
    slug: 'diagnostics',
    skus: 382,   // measured from the item catalogue, not an estimate
  },
];

export default function Home() {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const telemetryRef = useRef(null);

  useLayoutEffect(() => {
    // Respect the visitor's motion setting. Some people get nausea or migraine from a full-viewport
    // entrance sequence, and this is a medical site. Bailing out BEFORE the gsap.from() calls is what
    // makes this safe: .from() writes the start state (opacity 0) immediately and only the timeline
    // brings it back, so any guard that lets those calls run and then blocks playback leaves the
    // headline permanently invisible — which is exactly what happened when this was first written
    // with gsap.matchMedia, caught in the browser.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Hero Entrance Sequence
      const tl = gsap.timeline();
      
      tl.from(".hero-bg", { opacity: 0, duration: 1.2, ease: "power2.inOut" })
        .from(".telemetry-grid", { opacity: 0, scale: 1.1, duration: 1.5, ease: "power2.out" }, "-=0.8")
        .from(".hero-headline span", { 
          y: 100, 
          opacity: 0, 
          stagger: 0.1, 
          duration: 1, 
          ease: "expo.out" 
        }, "-=1")
        .from(".hero-content > *", { 
          y: 30, 
          opacity: 0, 
          stagger: 0.2, 
          duration: 0.8, 
          ease: "power3.out" 
        }, "-=0.5")
        .from(".hero-metrics > div", {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.3");

      // Scroll Triggered Animations for Sections
      gsap.from(".solutions-grid > div", {
        scrollTrigger: {
          trigger: ".solutions-section",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out"
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={heroRef} className="min-h-screen bg-[#050816] text-white selection:bg-primary/30 font-body">
      <PremiumHeader />
      <TrustStrip />

      {/* SECTION 6: HERO EXPERIENCE */}
      {/* min-h-dvh, not min-h-screen: 100vh on iOS Safari includes the browser chrome, so the hero
          jumped by ~80px the moment the toolbar collapsed on scroll. Most visitors here are on phones. */}
      <section className="relative min-h-dvh flex items-center justify-center overflow-hidden pt-20">
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0">
          <div className="hero-bg absolute inset-0">
            <Image 
              src="/images/operating-theatre.png" 
              alt="Surgical Operating Theatre" 
              fill
              className="object-cover grayscale opacity-40 mix-blend-overlay"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-transparent to-[#050816]" />
          
          {/* Telemetry Grid */}
          <div className="telemetry-grid absolute inset-0 opacity-20">
            <motion.div
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-[60%] h-[60%] bg-primary/10 rounded-full blur-[160px]"
            />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 hero-content">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-2xl">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/60">Master Partner: Meril Life Sciences</span>
              </div>
              
              <h1 className="hero-headline text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.8] font-heading uppercase italic">
                <span className="block">Surgery.</span>
                <span className="block text-primary">Accelerated.</span>
              </h1>
              
              <p className="max-w-2xl text-xl md:text-2xl text-muted-foreground mb-16 leading-tight font-medium">
                The Surgical Backbone of Telangana. Delivering <span className="text-white">clinical intelligence</span> and <span className="text-white">2-hour OT dispatch</span> support across all 33 districts.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-8">
                <Link 
                  href="https://wa.me/918500204488?text=I%20need%20OT%20support%20for%20a%20surgery."
                  className="group relative px-12 py-6 bg-primary text-black font-black uppercase tracking-widest text-sm rounded-none hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_hsl(43_72%_52%/0.25)] w-full sm:w-auto text-center"
                >
                  Request OT Support
                </Link>
                <Link 
                  href="/catalog"
                  className="px-12 py-6 rounded-none bg-transparent border border-white/20 font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all w-full sm:w-auto text-center inline-flex items-center justify-center gap-3"
                >
                  Explore Clinical Solutions <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Hero Metrics */}
              <div className="hero-metrics mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
                <div className="space-y-1">
                  <div className="text-2xl font-black font-mono tracking-tighter">7,100+</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Active SKUs</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black font-mono tracking-tighter">33</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Districts Optimized</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black font-mono tracking-tighter">24/7</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/40">OT Support</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black font-mono tracking-tighter">10</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Clinical Divisions</div>
                </div>
              </div>
            </div>

            {/* Right Column: Telemetry/Blueprint Animation Placeholder */}
            <div className="hidden lg:block lg:col-span-5 relative">
              <div className="relative aspect-square rounded-[40px] overflow-hidden border border-white/5 bg-white/5 backdrop-blur-3xl group">
                <Image 
                  src="/images/trauma-implant-macro.png" 
                  alt="Telemetry Implant Visualization" 
                  fill
                  className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Precision Analysis</div>
                  <h3 className="text-xl font-bold uppercase tracking-tighter leading-none">Anatomical Blueprint Extraction</h3>
                </div>
                {/* Simulated Telemetry HUD */}
                <div className="absolute top-8 right-8 space-y-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="h-[2px] w-12 bg-primary/20 relative overflow-hidden">
                        <motion.div 
                          animate={{ x: [-48, 48] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                          className="absolute inset-0 bg-primary"
                        />
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS — every one of these must be a number we can show a hospital the working for.
          "100% Hospital Trust" was here: a round invented figure that nobody can verify and that a
          procurement officer would be right to challenge. Replaced with the division count, which
          is measured from the item catalogue like the SKU figure beside it. */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <StatsCounter value={7100} label="Active SKUs" suffix="+" />
            <StatsCounter value={33} label="Districts Served" />
            <StatsCounter value={24} label="Surgery Support" suffix="/7" />
            <StatsCounter value={10} label="Clinical Divisions" />
          </div>
        </div>
      </section>

      {/* SECTION 7: CLINICAL INTELLIGENCE ENGINE */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
             <div>
                <div className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-6 flex items-center gap-3">
                   <span className="h-[2px] w-12 bg-primary"></span>
                   The Surgeon's Toolkit
                </div>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none uppercase italic">
                   Clinical<br />
                   <span className="text-primary text-4xl md:text-6xl">Intelligence.</span>
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-xl">
                   We transformed static implant catalogs into an operational intelligence system. Use our{' '}
                   <strong className="text-white font-black">Mechanical Sizing Wizard</strong> to optimize your procedure selection.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                   <div className="space-y-4">
                     <Link href="/evidence" className="group flex items-center gap-4 text-sm font-black uppercase tracking-widest text-primary border border-primary/20 px-6 py-4 rounded-xl hover:bg-primary/5 transition-all text-center justify-center">
                        Evidence Hub
                     </Link>
                   </div>
                   <div className="space-y-4">
                     <Link href="/catalog" className="group flex items-center gap-4 text-sm font-black uppercase tracking-widest text-white border border-white/20 px-6 py-4 rounded-xl hover:bg-white/5 transition-all text-center justify-center">
                        Catalog Desk
                     </Link>
                   </div>
                </div>
             </div>
             <div className="relative group space-y-8">
                <SizingWizard 
                   productName="Destiknee Total Knee System" 
                   visualStyle="cool_surgical_blue"
                   sizingData={{
                     metric: "Femoral A-P (mm)",
                     options: [
                       { min: 0, max: 55, size: "Size 1" },
                       { min: 55, max: 60, size: "Size 2" },
                       { min: 60, max: 65, size: "Size 3" },
                       { min: 65, max: 70, size: "Size 4" },
                       { min: 70, max: 75, size: "Size 5" },
                       { min: 75, max: 100, size: "Size 6" }
                     ]
                   }}
                />
                <BlueprintViewer />
             </div>
          </div>
        </div>
      </section>

      <ClinicalShowcase />

      {/* SECTION 8: CLINICAL SOLUTIONS */}
      <section className="solutions-section py-32 bg-[#050816] relative" id="solutions">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
             <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic">Clinical <span className="text-primary underline decoration-4 underline-offset-[12px]">Solutions</span></h2>
             <p className="max-w-3xl mx-auto text-xl text-muted-foreground">Moving from simple hardware to outcome-driven clinical segments.</p>
          </div>

          <div className="solutions-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SOLUTIONS.map((sol, i) => (
              // The whole card was cursor-pointer, lifted on hover and showed a chevron — but only
              // the 10px "View Division" text was actually clickable. It is now one real link, so
              // the entire card does what it has been promising, and keyboard users get a focus ring.
              <motion.div key={i} whileHover={{ y: -10 }} className="group">
              <Link
                href={`/catalog/${sol.slug}`}
                aria-label={`${sol.title} — view the ${sol.division} division`}
                className="relative flex h-full flex-col p-10 bg-[#0F172A] border border-white/5 rounded-3xl hover:border-primary/50 transition-all overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight className="w-8 h-8 text-primary" />
                </div>
                <sol.icon className="w-12 h-12 text-primary mb-8" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{sol.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {sol.desc}
                </p>
                {/* mt-auto pins this row to the bottom so the SKU counts line up across cards
                    whose descriptions run to different lengths */}
                <div className="mt-auto flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 tabular-nums">{sol.skus ? `SKUs: ${sol.skus.toLocaleString('en-IN')}` : ''}</span>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">View Division</span>
                </div>
                {/* Telemetry Pulse Overlay on Hover */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST MARKERS */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">CDSCO Certified</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">ISO 13485:2016</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">2-Hour Dispatch</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Master Distributor</span>
              </div>
            </div>
        </div>
      </section>

      {/* SECTION 9: LOGISTICS ENGINE - TELANGANA MAP */}
      {/* was bg-black — a jump to pure #000 in the middle of a page whose ground is #050816 read as
          a copy-paste seam. Same family, one step darker. */}
      <section className="py-32 bg-[#03050F] relative overflow-hidden" id="logistics">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4">
              <div className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-6 flex items-center gap-3">
                <span className="h-[2px] w-12 bg-primary"></span>
                Regional Backbone
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none uppercase italic">
                Statewide<br />
                <span className="text-primary">Logistics.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                Our hub-and-spoke dispatch model gets clinical support and hardware to every corner of Telangana.
                <span className="text-white block mt-4 font-bold uppercase tracking-tight italic">Tap or hover a district to see its service cover.</span>
              </p>
              
              <div className="space-y-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-primary font-mono text-xl font-black mb-1">02 HOURS</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">Average Dispatch Time</div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-primary font-mono text-xl font-black mb-1">33 DISTRICTS</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">Full State Penetration</div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              <TelanganaMap />
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL FOOTER */}
      <SiteFooter />
    </main>
  );
}
