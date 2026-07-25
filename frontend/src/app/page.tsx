"use client";

import React, { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteFooter from '@/components/SiteFooter';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Heart, 
  Stethoscope, 
  Dna, 
  Microscope, 
  ChevronRight, 
  ShieldCheck,
  Award,
  Zap,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import PremiumHeader from '../components/PremiumHeader';
import StatsCounter from '../components/StatsCounter';
import SizingWizard from '../components/SizingWizard';
import TrustStrip from '../components/TrustStrip';
import ClinicalShowcase from '../components/ClinicalShowcase';
import BlueprintViewer from '../components/BlueprintViewer';
import TelanganaMap from '../components/TelanganaMap';

gsap.registerPlugin(ScrollTrigger);

const SOLUTIONS = [
  { 
    title: 'Trauma & Fracture', 
    desc: 'Anatomical plating systems and intramedullary nails engineered for early weight-bearing and stability.', 
    icon: Activity, 
    division: 'Trauma',
    slug: 'trauma',
    color: 'text-blue-400',
    border: 'hover:border-blue-500/50'
  },
  { 
    title: 'Arthroplasty', 
    desc: 'Primary and revision joint replacement solutions for hip and knee with proprietary wear-reduction technology.', 
    icon: Stethoscope, 
    division: 'Joint Replacement',
    slug: 'arthroplasty',
    color: 'text-primary',
    border: 'hover:border-primary/50'
  },
  { 
    title: 'Cardiovascular', 
    desc: 'Bio-mimetic coronary stents and biological heart valves representing the pinnacle of interventional logic.', 
    icon: Heart, 
    division: 'Cardiovascular',
    slug: 'cardiovascular',
    color: 'text-red-500',
    border: 'hover:border-red-500/50'
  },
  { 
    title: 'Endo-Surgery', 
    desc: 'Smart-stapling systems and laparoscopic instrumentation for minimally invasive excellence.', 
    icon: Dna, 
    division: 'Endo-Surgery',
    slug: 'endo-surgery',
    color: 'text-purple-500',
    border: 'hover:border-purple-500/50'
  },
  { 
    title: 'Diagnostics', 
    desc: 'Advanced laboratory analyzers and rapid diagnostic test kits for hospital-wide accuracy.', 
    icon: Microscope, 
    division: 'Diagnostics',
    slug: 'diagnostics',
    color: 'text-blue-500',
    border: 'hover:border-blue-500/50'
  },
];

export default function Home() {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const telemetryRef = useRef(null);

  useLayoutEffect(() => {
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
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
            <div className="absolute inset-0 bg-[url('/images/ui/grid.svg')] bg-center bg-repeat opacity-30" />
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
                  className="group relative px-12 py-6 bg-primary text-black font-black uppercase tracking-widest text-sm rounded-none hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,194,255,0.2)] w-full sm:w-auto text-center"
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
                  <div className="text-2xl font-black font-mono tracking-tighter">1,202+</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Medical Devices</div>
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
                  <div className="text-2xl font-black font-mono tracking-tighter">16</div>
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

      {/* STATS: THE DOMINATION METRICS */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <StatsCounter value={967} label="Global Implants" suffix="+" />
            <StatsCounter value={33} label="Districts Optimized" />
            <StatsCounter value={24} label="Surgery Support" suffix="/7" />
            <StatsCounter value={100} label="Hospital Trust" suffix="%" />
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
                   We transformed static implant catalogs into an operational intelligence system. Use our 
                   **Mechanical Sizing Wizard** to optimize your procedure selection.
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
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className={`group relative p-10 bg-[#0F172A] border border-white/5 rounded-[40px] ${sol.border} transition-all overflow-hidden cursor-pointer`}
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight className="w-8 h-8 text-primary" />
                </div>
                <sol.icon className={`w-12 h-12 ${sol.color} mb-8`} />
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{sol.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {sol.desc}
                </p>
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">SKUs: 200+</span>
                   <Link href={`/catalog/${sol.slug}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">View Division</Link>
                </div>
                {/* Telemetry Pulse Overlay on Hover */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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
                <Zap className="w-5 h-5 text-primary" />
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
      <section className="py-32 bg-black relative overflow-hidden" id="logistics">
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
                Our hub-and-spoke dispatch model ensures that clinical support and hardware reach every corner of Telangana with unmatched speed. 
                <span className="text-white block mt-4 font-bold uppercase tracking-tight italic">Hover over the districts to see our service telemetry.</span>
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
