import React from 'react';
import { notFound } from 'next/navigation';
import { getAllInsights, getInsightBySlug } from '@/data/insights';
import Link from 'next/link';
import { ChevronLeft, Calendar, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LeadGenCTA from '@/components/LeadGenCTA';
import SiteFooter from '@/components/SiteFooter';

export async function generateStaticParams() {
  const insights = getAllInsights();
  return insights.map((insight) => ({
    slug: insight.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const insight = getInsightBySlug(resolvedParams.slug);
  if (!insight) return { title: 'Not Found' };
  
  return {
    title: `${insight.title} | Agile Healthcare Insights`,
    description: `Clinical comparison and technical specifications for ${insight.title}`,
  };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const insight = getInsightBySlug(resolvedParams.slug);

  if (!insight) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#020817] pt-24 pb-20 selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Back Navigation */}
        <Link 
          href="/insights" 
          className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </Link>

        {/* Article Header */}
        <header className="mb-12 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              {insight.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-zinc-500 text-sm font-medium">
              <Calendar className="w-4 h-4" />
              {insight.date}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {insight.title}
          </h1>
        </header>

        {/* Top CTA */}
        <LeadGenCTA productContext={insight.title} />

        {/* Markdown Content */}
        <article className="prose prose-invert prose-lg max-w-none mt-12 mb-16
          prose-headings:text-white prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
          prose-h3:text-xl prose-h3:text-blue-100 prose-h3:mt-8
          prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white prose-strong:font-semibold
          prose-ul:text-zinc-300 prose-ul:my-6 prose-li:my-2
          prose-table:border-collapse prose-th:border prose-th:border-white/20 prose-th:bg-white/5 prose-th:p-3 prose-th:text-left
          prose-td:border prose-td:border-white/10 prose-td:p-3
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {insight.content}
          </ReactMarkdown>
        </article>

        {/* Bottom CTA */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Ready to procure?</h3>
          <LeadGenCTA productContext={insight.title} />
        </div>

      </div>
      <SiteFooter />
    </div>
  );
}
