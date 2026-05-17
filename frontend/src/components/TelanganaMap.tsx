"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import * as d3 from "d3-geo";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import districtsData from "@/data/telangana_districts_data.json";

interface District {
  name: string;
  id: number;
  centroid: [number, number];
  geometry: any;
}

const HYDERABAD_CENTROID: [number, number] = [78.465, 17.395];

const TelanganaMap: React.FC = () => {
  const router = useRouter();
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);

  // SVG dimensions
  const width = 800;
  const height = 800;

  // Projection setup
  const projection = useMemo(() => {
    return d3.geoMercator()
      .center([79.2, 17.8]) // Center of Telangana
      .scale(8000)
      .translate([width / 2, height / 2]);
  }, [width, height]);

  const pathGenerator = useMemo(() => d3.geoPath().projection(projection), [projection]);

  useEffect(() => {
    // Initial entrance animation
    const paths = pathsRef.current.filter(Boolean);
    gsap.fromTo(paths, 
      { opacity: 0, scale: 0.9, transformOrigin: "50% 50%" },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.8, 
        stagger: 0.02, 
        ease: "power3.out",
        delay: 0.5 
      }
    );
  }, []);

  const handleMouseEnter = (district: District, index: number) => {
    setHoveredDistrict(district);
    
    // Scale up the hovered path
    gsap.to(pathsRef.current[index], {
      scale: 1.05,
      zIndex: 10,
      duration: 0.3,
      ease: "power2.out",
      transformOrigin: "50% 50%",
      fill: "rgba(0, 242, 255, 0.2)",
      stroke: "#00f2ff",
    });
  };

  const handleMouseLeave = (district: District, index: number) => {
    setHoveredDistrict(null);
    
    // Reset path
    gsap.to(pathsRef.current[index], {
      scale: 1,
      zIndex: 1,
      duration: 0.3,
      ease: "power2.in",
      fill: "rgba(0, 10, 30, 0.6)",
      stroke: "rgba(0, 242, 255, 0.3)",
    });
  };

  const [hyderabadX, hyderabadY] = projection(HYDERABAD_CENTROID) || [0, 0];

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-square flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#00f2ff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full relative z-10 select-none cursor-crosshair"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <linearGradient id="hubGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2ff" />
            <stop offset="100%" stopColor="#0066ff" />
          </linearGradient>
        </defs>

        {/* District Paths */}
        {districtsData.map((district, idx) => {
          const d = pathGenerator(district.geometry as any);
          return (
            <path
              key={district.name}
              ref={(el) => { pathsRef.current[idx] = el; }}
              d={d || ""}
              className="transition-all duration-300 pointer-events-auto"
              fill="rgba(0, 10, 30, 0.6)"
              stroke="rgba(0, 242, 255, 0.3)"
              strokeWidth="1.5"
              onMouseEnter={() => handleMouseEnter(district as District, idx)}
              onMouseLeave={() => handleMouseLeave(district as District, idx)}
              onClick={() => {
                const slug = district.name.toLowerCase().replace(/ /g, '-');
                router.push(`/districts/${slug}`);
              }}
            />
          );
        })}

        {/* Logistics Lines (Dispatch Visuals) */}
        <AnimatePresence>
          {hoveredDistrict && (
            <motion.path
              key={`line-${hoveredDistrict.name}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              d={`M ${hyderabadX} ${hyderabadY} Q ${(hyderabadX + (projection(hoveredDistrict.centroid)?.[0] || 0)) / 2} ${(hyderabadY + (projection(hoveredDistrict.centroid)?.[1] || 0)) / 2 - 50} ${projection(hoveredDistrict.centroid)?.[0]} ${projection(hoveredDistrict.centroid)?.[1]}`}
              fill="none"
              stroke="#00f2ff"
              strokeWidth="2"
              strokeDasharray="5,5"
              filter="url(#glow)"
            />
          )}
        </AnimatePresence>

        {/* Hyderabad Hub Node */}
        <g transform={`translate(${hyderabadX}, ${hyderabadY})`}>
          <circle r="12" fill="url(#hubGradient)" className="animate-pulse" filter="url(#glow)" />
          <circle r="20" fill="none" stroke="#00f2ff" strokeWidth="1" className="animate-ping opacity-30" />
          <text y="-20" textAnchor="middle" className="fill-[#00f2ff] text-[10px] font-bold tracking-widest uppercase pointer-events-none">
            Dispatch Hub
          </text>
        </g>
      </svg>

      {/* Info Tooltip */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md border border-[#00f2ff]/20 p-6 rounded-2xl">
          <div className="text-[#00f2ff]/60 text-[10px] uppercase tracking-tighter mb-1 font-bold">Logistics Network</div>
          <div className="text-3xl font-bold text-white tracking-tighter">
            {hoveredDistrict ? hoveredDistrict.name : "Telangana State"}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase">Service Time</span>
              <span className="text-[#00f2ff] font-mono">
                {hoveredDistrict ? (hoveredDistrict.name === "Hyderabad" ? "30 MINS" : "4-6 HOURS") : "--"}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase">Fleet Active</span>
              <span className="text-[#00f2ff] font-mono">
                {hoveredDistrict ? "24/7 LIVE" : "33 DISTRICTS"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction Overlay */}
      {!hoveredDistrict && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-8 right-8 text-white/40 text-xs font-mono tracking-widest flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-pulse" />
          HOVER TO CALCULATE DISPATCH TELEMETRY
        </motion.div>
      )}
    </div>
  );
};

export default TelanganaMap;
