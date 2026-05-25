import React from 'react';
import Link from 'next/link';
import { getAllInsights } from '@/data/insights';
import { ArrowRight, BookOpen, Stethoscope } from 'lucide-react';

export const metadata = {
  title: 'Clinical Insights & Comparisons | Agile Healthcare',
  description: 'Expert clinical comparisons, technical specifications, and procurement guides for orthopedic and cardiovascular devices.',
};

export default function InsightsIndexPage() {
  const insights = getAllInsights();

  return (
    <div className="min-h-screen bg-[#020817] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
            <Stethoscope className="w-4 h-4" />
            <span>Clinical Knowledge Base</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Surgical Insights & <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Procurement Intelligence
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Deep-dive technical comparisons and clinical outcome reviews for our premier 
            orthopedic trauma, joint replacement, and cardiovascular portfolios.
          </p>
        </div>

        {/* Grid of Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight) => (
            <Link 
              key={insight.slug} 
              href={`/insights/${insight.slug}`}
              className="group relative flex flex-col justify-between p-6 bg-[#0A0A0A] border border-white/10 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                    {insight.category}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {insight.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-blue-400 transition-colors">
                  {insight.title}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-3 mb-6">
                  {insight.excerpt}
                </p>
              </div>

              <div className="relative z-10 flex items-center text-blue-500 text-sm font-semibold mt-auto">
                Read Analysis
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {insights.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-300 mb-2">No Insights Yet</h3>
            <p className="text-zinc-500">The clinical team is currently preparing new technical comparisons.</p>
          </div>
        )}

      </div>
    </div>
  );
}
