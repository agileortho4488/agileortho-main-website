"use client";

import React, { useState } from 'react';
import { Download, MessageCircle, Phone } from 'lucide-react';
import LeadCaptureModal from './LeadCaptureModal';

interface ProductActionsProps {
  product: any;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pre-filled WhatsApp message with product name + SKU for maximum conversion
  const waMessage = encodeURIComponent(
    `Hi, I need a quote for:\n*${product.product_name_display}*\nSKU: ${product.sku_code || 'N/A'}\n\nPlease share availability and pricing.`
  );
  const whatsappUrl = `https://wa.me/917416521222?text=${waMessage}`;

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
      {/* Primary: WhatsApp Deep-Link (highest conversion) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        id={`wa-cta-${product.slug || product.sku_code}`}
        className="flex-1 bg-[#25D366] text-black py-4 px-8 rounded-full flex items-center justify-center gap-2 font-black text-sm tracking-wider uppercase transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#25D366]/20"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp Quote
      </a>

      {/* Secondary: Sales Modal / Brochure */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/20 py-4 px-8 rounded-full flex items-center justify-center gap-2 font-bold text-sm tracking-wider uppercase transition-all hover:border-primary/40"
      >
        {product.brochure_url ? (
          <>
            <Download className="w-4 h-4" />
            Get Brochure
          </>
        ) : (
          <>
            <Phone className="w-4 h-4" />
            Contact Sales
          </>
        )}
      </button>

      <LeadCaptureModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inquiryType="Product Inquiry"
        productInterest={product.product_name_display}
        whatsappMessage={`Hi! I'm interested in the ${product.product_name_display} (SKU: ${product.sku_code || 'N/A'}). Could you share pricing and availability?`}
        source="product_page_cta"
      />
    </div>
  );
}
