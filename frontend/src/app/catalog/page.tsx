import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

// This page is Server-Side Rendered (Static by default in Next.js)
// It reads the catalog data directly from the backend seed file for Phase 1
export const metadata = {
  title: 'Medical Product Catalog | Agile Healthcare',
  description: 'Browse our extensive catalog of Meril Life Sciences medical devices. 13 clinical divisions including Trauma, Cardiovascular, and Joint Replacement.',
};

export default function CatalogIndexPage() {
  // Read divisions from memory or seed file
  // For now, these are the 13 core divisions based on the project report
  const divisions = [
    { name: 'Trauma', slug: 'trauma', icon: '🦴', count: 218 },
    { name: 'Endo-Surgical', slug: 'endo-surgical', icon: '✂️', count: 168 },
    { name: 'Joint Replacement', slug: 'joint-replacement', icon: '🦵', count: 112 },
    { name: 'Diagnostics', slug: 'diagnostics', icon: '🔬', count: 105 },
    { name: 'Infection Prevention', slug: 'infection-prevention', icon: '🧼', count: 85 },
    { name: 'Cardiovascular', slug: 'cardiovascular', icon: '❤️', count: 60 },
    { name: 'Surgical Instruments', slug: 'instruments', icon: '🔨', count: 53 },
    { name: 'Sports Medicine', slug: 'sports-medicine', icon: '🏃', count: 53 },
    { name: 'ENT', slug: 'ent', icon: '👂', count: 45 },
    { name: 'Urology', slug: 'urology', icon: '💧', count: 28 },
    { name: 'Critical Care', slug: 'critical-care', icon: '🏥', count: 23 },
    { name: 'Peripheral Intervention', slug: 'peripheral-intervention', icon: '💉', count: 13 },
    { name: 'Robotics', slug: 'robotics', icon: '🤖', count: 4 },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-gradient-gold mb-4">
            Product Catalog
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Explore 967+ world-class medical devices by Meril Life Sciences, 
            distributed exclusively by Agile Healthcare in Telangana.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {divisions.map((division) => (
            <Link 
              key={division.slug} 
              href={`/catalog/${division.slug}`}
              className="group card-premium p-6 rounded-xl hover:border-primary/50 transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {division.icon}
              </div>
              <h2 className="text-xl font-bold font-heading mb-2 group-hover:text-primary transition-colors">
                {division.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                {division.count} Products available
              </p>
              <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Browse Division
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
