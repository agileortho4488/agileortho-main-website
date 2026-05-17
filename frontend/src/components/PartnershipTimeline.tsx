"use client";

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MILESTONES = [
  { year: '2018', title: 'Foundation', desc: 'Agile Orthopedics established as a regional trauma specialist in Hyderabad.' },
  { year: '2020', title: 'Meril Partnership', desc: 'Authorized as the Master Franchise distributor for Meril Life Sciences.' },
  { year: '2022', title: 'Network Expansion', desc: 'Expanded logistics infrastructure to cover all 33 districts of Telangana.' },
  { year: '2024', title: 'Digital Transformation', desc: 'Launched the Surgical Intelligence Platform for enhanced clinical support.' },
  { year: '2026', title: 'Operational Domination', desc: 'Scaling to ₹100 Crore annual revenue with 1,202+ medical devices.' },
];

export default function PartnershipTimeline() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".timeline-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        x: -50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
      });

      gsap.from(".timeline-line", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        height: 0,
        duration: 2,
        ease: "none"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative py-24">
      <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-white/5 timeline-line overflow-hidden">
         <div className="h-full w-full bg-gradient-to-b from-primary via-primary to-transparent" />
      </div>

      <div className="space-y-24 ml-12">
        {MILESTONES.map((item, i) => (
          <div key={i} className="timeline-item relative">
            <div className="absolute -left-[44px] top-2 h-6 w-6 rounded-full bg-black border-2 border-primary flex items-center justify-center">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>
            <div className="text-primary font-mono text-2xl font-black mb-2">{item.year}</div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">{item.title}</h3>
            <p className="text-white/60 max-w-md leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
