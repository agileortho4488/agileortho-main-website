"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table2, ChevronDown, ChevronUp, Microscope, ShieldCheck, Download } from 'lucide-react';

interface TechSpec {
  label: string;
  value: string;
}

interface TechnicalMatrixProps {
  productName: string;
  specs: Record<string, string> | TechSpec[];
  materials?: string;
  features?: string[];
  indications?: string[];
  brochureFile?: string;
  visualStyle?: 'cool_surgical_blue' | 'default';
}

export default function TechnicalMatrix({
  productName,
  specs,
  materials,
  features = [],
  indications = [],
  visualStyle = 'cool_surgical_blue',
}: TechnicalMatrixProps) {
  const [activeTab, setActiveTab] = useState<'matrix' | 'features' | 'indications'>('matrix');
  const [expanded, setExpanded] = useState(true);

  // Normalize specs to array format
  const specRows: TechSpec[] = Array.isArray(specs)
    ? specs
    : Object.entries(specs || {}).map(([label, value]) => ({ label, value }));

  // Split specs into sizing (has "mm" or numbers) vs general
  const sizingRows = specRows.filter(s =>
    /\d/.test(s.value) || s.label.toLowerCase().includes('hole') ||
    s.label.toLowerCase().includes('length') || s.label.toLowerCase().includes('part')
  );
  const generalRows = specRows.filter(s => !sizingRows.includes(s));

  const blueAccent = visualStyle === 'cool_surgical_blue'
    ? 'text-blue-400 border-blue-500/30 bg-blue-500/5'
    : 'text-primary border-primary/30 bg-primary/5';
  
  const blueGlow = visualStyle === 'cool_surgical_blue'
    ? 'shadow-blue-500/10'
    : 'shadow-primary/10';

  const tabs = [
    { id: 'matrix', label: 'Size Matrix', icon: Table2, count: sizingRows.length },
    { id: 'features', label: 'Key Features', icon: ShieldCheck, count: features.length },
    { id: 'indications', label: 'Indications', icon: Microscope, count: indications.length },
  ] as const;

  return (
    <div className={`rounded-[32px] border border-white/10 bg-[#0D0D0D] overflow-hidden shadow-2xl ${blueGlow}`}>
      {/* Header */}
      <div className={`px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]`}>
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${blueAccent} border`}>
            <Table2 className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${visualStyle === 'cool_surgical_blue' ? 'text-blue-400' : 'text-primary'}`}>
              Full Technical Matrix
            </span>
            <p className="text-sm font-bold text-white/60 mt-0.5">{productName}</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tab Bar */}
            <div className="flex border-b border-white/5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id
                      ? visualStyle === 'cool_surgical_blue'
                        ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                        : 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                      activeTab === tab.id
                        ? visualStyle === 'cool_surgical_blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-primary/20 text-primary'
                        : 'bg-white/10 text-white/40'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'matrix' && (
                  <motion.div key="matrix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {sizingRows.length > 0 ? (
                      <div className="overflow-x-auto relative">
                        {visualStyle === 'cool_surgical_blue' && (
                          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                            style={{ 
                              backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
                              backgroundSize: '20px 20px'
                            }} 
                          />
                        )}
                        <table className="w-full text-sm relative z-10">
                          <thead>
                            <tr className={`border-b ${visualStyle === 'cool_surgical_blue' ? 'border-blue-500/20' : 'border-white/10'}`}>
                              <th className={`text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest ${visualStyle === 'cool_surgical_blue' ? 'text-blue-400' : 'text-primary/60'}`}>
                                Technical Blueprint Specification
                              </th>
                              <th className={`text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest ${visualStyle === 'cool_surgical_blue' ? 'text-blue-400' : 'text-primary/60'}`}>
                                Clinical Value
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {sizingRows.map((row, i) => (
                              <tr
                                key={i}
                                className={`border-b ${
                                  visualStyle === 'cool_surgical_blue' ? 'border-blue-500/10' : 'border-white/5'
                                } hover:bg-white/[0.02] transition-colors ${
                                  i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                                }`}
                              >
                                <td className="py-3 px-4 text-white/60 font-medium">
                                  {visualStyle === 'cool_surgical_blue' && (
                                    <span className="inline-block w-1 h-1 rounded-full bg-blue-500/40 mr-2" />
                                  )}
                                  {row.label}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <span className={`font-black tabular-nums ${visualStyle === 'cool_surgical_blue' ? 'text-blue-300' : 'text-primary'}`}>
                                    {row.value}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* General Specs */}
                        {generalRows.length > 0 && (
                          <div className="mt-6 grid grid-cols-2 gap-3">
                            {generalRows.map((row, i) => (
                              <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{row.label}</p>
                                <p className={`text-sm font-bold ${visualStyle === 'cool_surgical_blue' ? 'text-blue-300' : 'text-white'}`}>{row.value}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {materials && (
                          <div className={`mt-4 p-4 rounded-xl border flex items-center gap-3 ${blueAccent}`}>
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5">Primary Material</p>
                              <p className="text-sm font-bold">{materials}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-center text-white/30 py-8 text-sm">No sizing data extracted yet.</p>
                    )}
                  </motion.div>
                )}

                {activeTab === 'features' && (
                  <motion.div key="features" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-3">
                    {features.length > 0 ? features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          visualStyle === 'cool_surgical_blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-primary/20 text-primary'
                        }`}>
                          <span className="text-[9px] font-black">{i + 1}</span>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed">{feat}</p>
                      </div>
                    )) : <p className="text-center text-white/30 py-8 text-sm">No features extracted yet.</p>}
                  </motion.div>
                )}

                {activeTab === 'indications' && (
                  <motion.div key="indications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-3">
                    {indications.length > 0 ? indications.map((ind, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                        <Microscope className={`w-4 h-4 shrink-0 mt-0.5 ${visualStyle === 'cool_surgical_blue' ? 'text-blue-400' : 'text-primary'}`} />
                        <p className="text-sm text-white/70 leading-relaxed">{ind}</p>
                      </div>
                    )) : <p className="text-center text-white/30 py-8 text-sm">No indications extracted yet.</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                CDSCO Validated Data
              </span>
              <button className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all hover:scale-105 ${
                visualStyle === 'cool_surgical_blue'
                  ? 'text-blue-400 border-blue-500/30 hover:bg-blue-500/10'
                  : 'text-primary border-primary/30 hover:bg-primary/10'
              }`}>
                <Download className="w-3 h-3" />
                Request Full Dossier
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
