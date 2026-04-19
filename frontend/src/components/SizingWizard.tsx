"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, ChevronRight, CheckCircle2, Download, Search, AlertCircle } from 'lucide-react';
import LeadCaptureModal from './LeadCaptureModal';

const SIZING_DATA = {
  'Knee': {
    metric: 'Tibial AP (mm)',
    options: [
      { min: 40, max: 44, size: 'Size 1' },
      { min: 45, max: 49, size: 'Size 2' },
      { min: 50, max: 54, size: 'Size 3' },
      { min: 55, max: 60, size: 'Size 4' },
    ]
  },
  'Hip': {
    metric: 'Femoral Head Diameter (mm)',
    options: [
      { min: 22, max: 28, size: 'Small' },
      { min: 29, max: 36, size: 'Medium' },
      { min: 37, max: 44, size: 'Large' },
    ]
  }
};

export default function SizingWizard() {
  const [activeType, setActiveType] = useState<null | 'Knee' | 'Hip'>(null);
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCalculate = () => {
    if (!activeType || !value) return;
    const num = parseFloat(value);
    const match = SIZING_DATA[activeType].options.find(o => num >= o.min && num < o.max);
    setResult(match ? match.size : "Custom Size Req.");
  };

  return (
    <div className="bg-[#111] border border-white/5 rounded-[48px] overflow-hidden">
      <div className="p-12">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Ruler className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Anatomical Wizard</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1 font-bold">Clinical Sizing Precision</p>
            </div>
        </div>

        {!activeType ? (
            <div className="grid grid-cols-1 gap-4">
                {['Knee', 'Hip'].map(type => (
                    <button 
                        key={type}
                        onClick={() => setActiveType(type as 'Knee' | 'Hip')}
                        className="p-6 bg-white/5 border border-white/5 rounded-2xl text-left hover:border-primary/50 transition-all group flex justify-between items-center"
                    >
                        <span className="font-bold text-lg italic tracking-tight">{type} Replacement</span>
                        <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
            </div>
        ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3 block">Enter {SIZING_DATA[activeType].metric}</label>
                   <div className="relative">
                      <input 
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="e.g. 52"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl font-bold focus:outline-none focus:border-primary transition-all pr-20"
                      />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 font-bold text-white/20">MM</span>
                   </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => { setActiveType(null); setResult(null); setValue(''); }} className="flex-1 py-5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white/20">Reset</button>
                    <button onClick={handleCalculate} className="flex-[2] py-5 bg-primary text-black rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20">Find Result</button>
                </div>

                <AnimatePresence>
                    {result && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 bg-primary/10 border border-primary/20 rounded-3xl"
                        >
                            <div className="flex items-center gap-3 text-primary mb-2 italic">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-xs font-black uppercase tracking-widest">Recommended Size</span>
                            </div>
                            <div className="text-4xl font-black tracking-tighter uppercase italic">{result}</div>
                            
                            <hr className="my-6 border-primary/10" />

                            <div className="flex flex-col gap-4">
                                <p className="text-xs text-white/60 font-medium italic">
                                   *Note: Final decision rests with the operating surgeon based on clinical evaluation.
                                </p>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-xl"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Full Sizing Matrix PDF
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        )}
      </div>

      <LeadCaptureModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inquiryType="Sizing Matrix Download"
        productInterest={`${activeType} Sizing (Result: ${result})`}
        whatsappMessage={`Hi! I used your Sizing Wizard for ${activeType} Replacement and got ${result}. Can I get the full sizing chart?`}
        source="sizing_wizard"
      />
    </div>
  );
}
