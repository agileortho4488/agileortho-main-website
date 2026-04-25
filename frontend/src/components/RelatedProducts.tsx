import React from 'react';
import Link from 'next/link';
import { getAllProducts } from '@/lib/data';

interface RelatedProductsProps {
  currentProductSlug: string;
  division: string;
  category: string;
  visualStyle?: 'cool_surgical_blue' | 'default';
}

export default async function RelatedProducts({ 
  currentProductSlug, 
  division, 
  category,
  visualStyle = 'default' 
}: RelatedProductsProps) {
  const allProducts = await getAllProducts();
  
  // 1. Filter out current product
  const otherProducts = allProducts.filter((p: any) => p.slug !== currentProductSlug);
  
  // 2. Prioritize same category, then same division
  const sameCategory = otherProducts.filter((p: any) => p.category === category);
  const sameDivision = otherProducts.filter((p: any) => p.division_canonical === division && p.category !== category);
  
  // 3. Combine and take top 4
  const recommended = [...sameCategory, ...sameDivision].slice(0, 4);

  if (recommended.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className={`h-[2px] flex-1 ${visualStyle === 'cool_surgical_blue' ? 'bg-blue-500/20' : 'bg-primary/20'}`} />
        <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${
          visualStyle === 'cool_surgical_blue' ? 'text-blue-400' : 'text-primary'
        }`}>Related Clinical Solutions</span>
        <div className={`h-[2px] flex-1 ${visualStyle === 'cool_surgical_blue' ? 'bg-blue-500/20' : 'bg-primary/20'}`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommended.map((product: any) => (
          <Link 
            key={product.slug} 
            href={`/catalog/products/${product.slug}`}
            className={`group p-4 rounded-xl flex flex-col h-full border transition-all duration-300 ${
              visualStyle === 'cool_surgical_blue' 
                ? 'bg-blue-950/10 border-blue-500/10 hover:border-blue-500/30 hover:bg-blue-900/20' 
                : 'bg-[#111] border-white/5 hover:border-primary/30 hover:bg-[#1a1a1a]'
            }`}
          >
            <div className={`aspect-square rounded-lg mb-4 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-500 ${
              visualStyle === 'cool_surgical_blue' ? 'bg-blue-500/5' : 'bg-white/5'
            }`}>
              {product.division_canonical === 'Cardiovascular' ? '❤️' : 
               product.division_canonical === 'Trauma' ? '🦴' : 
               product.division_canonical === 'Joint Replacement' ? '🦿' : '⚕️'}
            </div>
            <h3 className={`text-sm font-bold mb-2 transition-colors line-clamp-2 ${
              visualStyle === 'cool_surgical_blue' ? 'group-hover:text-blue-400' : 'group-hover:text-primary'
            }`}>
              {product.product_name_display}
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4">
              {product.category}
            </p>
            <div className="mt-auto pt-4 border-t border-white/5 text-[10px] font-medium text-white/40 group-hover:text-white/80 transition-colors">
              Explore Specifications →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
