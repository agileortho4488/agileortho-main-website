"use client";

import React from 'react';
import { ShieldCheck, Award, Zap, UserCheck, Globe, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

const CERTS = [
  { icon: ShieldCheck, title: 'CDSCO Certified', desc: 'Central Drugs Standard Control Organisation verified.' },
  { icon: Award, title: 'ISO 13485:2016', desc: 'International standard for medical device quality management.' },
  { icon: Zap, title: '2-Hour Dispatch', desc: 'Guaranteed OT emergency dispatch capability statewide.' },
  { icon: UserCheck, title: 'Verified Master Partner', desc: 'Authorized representative for Meril Life Sciences.' },
  { icon: Globe, title: 'District Coverage', desc: 'Seamless logistics across all 33 districts of Telangana.' },
  { icon: Scale, title: 'CIN Registered', desc: 'Registered Private Limited company with full compliance.' },
];

export default function CertificationsWall() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {CERTS.map((cert, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="p-8 bg-[#0F172A] border border-white/5 rounded-3xl hover:border-primary/30 transition-all group"
        >
          <cert.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
          <h4 className="text-xl font-black uppercase tracking-tighter mb-2">{cert.title}</h4>
          <p className="text-sm text-white/40 leading-relaxed">{cert.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
