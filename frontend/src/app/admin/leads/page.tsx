"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, MapPin, Package, Clock, ShieldCheck, ArrowLeft, Download, Search } from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: string;
  timestamp: string;
  name: string;
  phone: string;
  hospital: string;
  interest: string;
  source: string;
  status: string;
  district?: string;
  enquiryType?: string;
}

export default function LeadAnalytics() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        setLeads(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.interest.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary uppercase font-black tracking-widest animate-pulse">Initializing Lead Vault...</div>;

  return (
    <main className="min-h-screen bg-[#050505] text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-3 h-3" /> Back to Terminal
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Lead <span className="text-primary">Intelligence.</span></h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Agile Healthcare Revenue Funnel v3.0</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-primary/40 transition-all min-w-[300px]"
            />
          </div>
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
            <Download className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="p-8 bg-[#111] border border-white/5 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Users className="w-5 h-5" /></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Leads</span>
          </div>
          <p className="text-4xl font-black italic">{leads.length}</p>
        </div>
        <div className="p-8 bg-[#111] border border-white/5 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><TrendingUp className="w-5 h-5" /></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Conversion Rate</span>
          </div>
          <p className="text-4xl font-black italic">--%</p>
        </div>
        <div className="p-8 bg-[#111] border border-white/5 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><ShieldCheck className="w-5 h-5" /></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Clinical Verified</span>
          </div>
          <p className="text-4xl font-black italic">{leads.filter(l => l.status === 'verified').length}</p>
        </div>
        <div className="p-8 bg-[#111] border border-white/5 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400"><Clock className="w-5 h-5" /></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Avg Response</span>
          </div>
          <p className="text-4xl font-black italic">2.4h</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="max-w-7xl mx-auto bg-[#111] border border-white/5 rounded-[40px] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Timestamp</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Client / Hospital</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Product Interest</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">District</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Source</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <motion.tr 
                key={lead.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-8 py-6">
                  <div className="text-xs font-mono text-white/40">{new Date(lead.timestamp).toLocaleDateString()}</div>
                  <div className="text-[10px] font-mono text-white/20">{new Date(lead.timestamp).toLocaleTimeString()}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="font-bold text-sm group-hover:text-primary transition-colors">{lead.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-black">{lead.hospital}</div>
                  <div className="text-[10px] text-white/20 font-mono mt-1">{lead.phone}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-xs text-white/60 line-clamp-2 max-w-xs leading-relaxed italic">
                    "{lead.interest || lead.enquiryType || 'General Inquiry'}"
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-primary/40" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{lead.district || 'HYD-HUB'}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[9px] px-2 py-1 bg-white/5 rounded-full text-white/40 uppercase font-black tracking-widest border border-white/5">
                    {lead.source.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    lead.status === 'new' ? 'text-primary' : 'text-white/20'
                  }`}>
                    {lead.status}
                  </span>
                </td>
              </motion.tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-32 text-center text-white/20 font-black uppercase tracking-[0.5em]">No Intelligence Captured</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
