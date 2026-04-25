"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, ChevronRight, CheckCircle2, Download, Search, AlertCircle } from 'lucide-react';
import LeadCaptureModal from './LeadCaptureModal';

interface SizingOption {
  min: number;
  max: number;
  size: string;
}

interface SizingData {
  metric: string;
  options: SizingOption[];
}

interface SizingWizardProps {
  productName: string;
  sizingData?: SizingData;
  visualStyle?: 'cool_surgical_blue' | 'default';
}

export default function SizingWizard({
  productName,
  sizingData,
  visualStyle = 'default'
}: SizingWizardProps) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If no sizing data provided, use a generic fallback or return null
  if (!sizingData) return null;

  const handleCalculate = () => {
    const num = parseFloat(value);
    const match = sizingData.options.find(o => num >= o.min && num < o.max);
    setResult(match ? match.size : "Custom Size Req.");
  };

  const accentColor = visualStyle === 'cool_surgical_blue' ? 'text-blue-400' : 'text-primary';
  const bgColor = visualStyle === 'cool_surgical_blue' ? 'bg-blue-500/10' : 'bg-primary/10';
  const borderColor = visualStyle === 'cool_surgical_blue' ? 'border-blue-500/20' : 'border-primary/20';

  return (
    <div className="bg-[#111] border border-white/5 rounded-[48px] overflow-hidden">
      <div className="p-12">
        <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center ${accentColor}`}>
                <Ruler className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Anatomical Wizard</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1 font-bold">Clinical Sizing Precision</p>
            </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3 block">
                 Enter {sizingData.metric} for {productName}
               </label>
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
                <button onClick={() => { setResult(null); setValue(''); }} className="flex-1 py-5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white/20">Reset</button>
                <button onClick={handleCalculate} className={`flex-[2] py-5 ${visualStyle === 'cool_surgical_blue' ? 'bg-blue-600' : 'bg-primary'} text-black rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20`}>Find Result</button>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-8 ${bgColor} border ${borderColor} rounded-3xl`}
                    >
                        <div className={`flex items-center gap-3 ${accentColor} mb-2 italic`}>
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-xs font-black uppercase tracking-widest">Recommended Size</span>
                        </div>
                        <div className="text-4xl font-black tracking-tighter uppercase italic text-white">{result}</div>
                        
                        <hr className="my-6 border-white/5" />

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
      </div>

      <LeadCaptureModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inquiryType="Sizing Matrix Download"
        productInterest={`${productName} Sizing (Result: ${result})`}
        whatsappMessage={`Hi! I used your Sizing Wizard for ${productName} and got ${result}. Can I get the full sizing chart?`}
        source="sizing_wizard"
      />
    </div>
  );
}
