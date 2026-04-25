"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ProductFAQProps {
  product: any;
  visualStyle?: 'cool_surgical_blue' | 'default';
}

export default function ProductFAQ({ product, visualStyle = 'default' }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: `What is the ${product.product_name_display}?`,
      answer: product.description_live || product.description_shadow || `The ${product.product_name_display} is a premium medical device manufactured by ${product.manufacturer || 'Meril Life Sciences'} for the ${product.category} category.`
    },
    {
      question: `Who manufactures the ${product.product_name_display}?`,
      answer: `This product is manufactured by ${product.manufacturer || 'Meril Life Sciences'} and is distributed by Agile Healthcare across all districts of Telangana.`
    },
    {
      question: `Is the ${product.product_name_display} certified for surgical use?`,
      answer: `Yes, all Meril Life Sciences products distributed by Agile Healthcare, including the ${product.product_name_display}, strictly adhere to CDSCO guidelines and ISO 13485:2016 quality standards.`
    }
  ];

  if (product.materials_canonical || product.material_canonical) {
    faqs.push({
      question: `What materials are used in the ${product.product_name_display}?`,
      answer: `The ${product.product_name_display} is constructed using ${product.materials_canonical || product.material_canonical}, ensuring high biocompatibility and durability.`
    });
  }

  // Generate FAQPage JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="mb-16 max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="flex items-center gap-4 mb-8">
        <div className={`h-[2px] flex-1 ${visualStyle === 'cool_surgical_blue' ? 'bg-blue-500/20' : 'bg-primary/20'}`} />
        <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${
          visualStyle === 'cool_surgical_blue' ? 'text-blue-400' : 'text-primary'
        }`}>Frequently Asked Questions</span>
        <div className={`h-[2px] flex-1 ${visualStyle === 'cool_surgical_blue' ? 'bg-blue-500/20' : 'bg-primary/20'}`} />
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`border rounded-xl overflow-hidden transition-all duration-300 ${
              visualStyle === 'cool_surgical_blue' 
                ? 'border-blue-500/20 bg-blue-950/10' 
                : 'border-white/10 bg-[#111]'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h3 className="font-bold text-sm text-white pr-8">{faq.question}</h3>
              <ChevronDown 
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180 text-white' : 'text-white/40'
                }`}
              />
            </button>
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-muted-foreground text-sm leading-relaxed border-t border-white/5 pt-4">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
