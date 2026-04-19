"use client";

import React, { useState } from 'react';
import { Download, MessageSquare, Phone } from 'lucide-react';
import LeadCaptureModal from './LeadCaptureModal';

interface ProductActionsProps {
  product: any;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
      <button 
        onClick={() => setIsModalOpen(true)}
        className="btn-primary py-4 px-10 rounded-full flex items-center justify-center font-bold text-sm tracking-wider uppercase transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
      >
        Connect with Sales
      </button>

      {product.brochure_url && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white/5 hover:bg-white/10 border border-white/20 py-4 px-10 rounded-full flex items-center justify-center gap-2 font-bold text-sm tracking-wider uppercase transition-all"
        >
          <Download className="w-4 h-4" />
          Gated Brochure
        </button>
      )}

      <LeadCaptureModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inquiryType="Product Inquiry"
        productInterest={product.product_name_display}
        whatsappMessage={`Hi! I'm interested in the ${product.product_name_display} (${product.sku_code}). Could you share more details?`}
        source="product_page_brochure"
      />
    </div>
  );
}
