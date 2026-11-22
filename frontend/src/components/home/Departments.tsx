'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Department } from '@/content/departments';
import s from './home.module.css';

/** Panel photo per department. A department with no photo shows its number. */
export type DepPhoto = { img: string; alt: string; style: React.CSSProperties; /** gradient layer under the photo */ under?: string };

const num = (k: number) => String(k + 1).padStart(2, '0');

/** "See orthopaedic devices", "See ENT devices", "See laboratory and diagnostics supplies". */
const ctaFor = (d: Department) => {
  if (d.slug === 'orthopaedics') return 'See orthopaedic devices';
  const name = /^.[A-Z]/.test(d.name) ? d.name : d.name.charAt(0).toLowerCase() + d.name.slice(1);
  return `See ${name} ${d.line.startsWith(`${d.name} supplies `) ? 'supplies' : 'devices'}`;
};

const fallback: React.CSSProperties = {
  background: 'radial-gradient(60% 70% at 50% 60%, rgba(214,150,118,0.16) 0%, rgba(22,18,17,0) 70%), #1D1817',
};

export default function Departments({ departments, photos }: { departments: Department[]; photos: Record<string, DepPhoto> }) {
  const [open, setOpen] = useState(0);
  const [all, setAll] = useState(false);
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A #dep-<slug> link (from any page) opens that panel.
  useEffect(() => {
    const onHash = (instant?: boolean) => {
      const m = /^#dep-([a-z-]+)$/.exec(window.location.hash);
      const k = m ? departments.findIndex(d => d.slug === m[1]) : -1;
      if (k < 0) return;
      setOpen(k);
      if (k >= 8) setAll(true);
      requestAnimationFrame(() =>
        document.getElementById('dep-detail')?.scrollIntoView({ block: 'start', behavior: instant || reduce() ? 'instant' : 'smooth' }));
    };
    onHash(true);
    const h = () => onHash();
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, [departments]);

  const pick = (k: number) => {
    setOpen(k);
    // One column (phone, tablet): the card sits under the tiles, so bring it into view.
    if (window.matchMedia('(max-width: 960px)').matches)
      document.getElementById('dep-detail')?.scrollIntoView({ block: 'nearest', behavior: reduce() ? 'instant' : 'smooth' });
  };

  const cur = departments[open];
  const photo = photos[cur.slug];

  return (
    <div className={s.depGrid}>
      <div className={`${s.tiles} ${all ? s.all : ""}`}>
        {departments.map((d, k) => (
          <button key={d.slug} type="button" id={`dep-btn-${num(k)}`} className={`${s.tile} ${k === open ? s.tOn : ''}`}
            aria-expanded={k === open} aria-controls="dep-detail" onClick={() => pick(k)}>
            {photos[d.slug] && <span className={s.tthumb} aria-hidden="true" style={{ backgroundImage: `url('${photos[d.slug].img}')` }} />}
            <span className={s.num} aria-hidden="true">{num(k)}</span>
            <span>{d.name}</span>
          </button>
        ))}
        {/* Phone: the first 8 tiles show; this opens the rest. */}
        <button type="button" className={s.more} onClick={() => setAll(true)}>Show all {departments.length} departments</button>
        {/* Wide screens: the space under the tiles finds a device by name (the head link does this on a phone). */}
        <Link className={s.azTile} href="/devices">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <span><b>Know the device name?</b><span>Find it in Devices A to Z</span></span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <div className={s.detail} id="dep-detail" role="region" aria-labelledby="dep-h">
        {photo
          ? <div key={cur.slug} className={s.fig} role="img" aria-label={photo.alt} style={{ ...photo.style, backgroundImage: `url('${photo.img}')${photo.under ? ', ' + photo.under : ''}` }} />
          : <div key={cur.slug} className={s.fig} style={fallback}><span className={s.big} aria-hidden="true">{num(open)}</span></div>}
        {/* Every panel is in the HTML, so crawlers read all 16 lines; closed ones are folded with CSS. */}
        {departments.map((d, k) => (
          <div key={d.slug} id={`dep-${d.slug}`} className={`${s.pan} ${k === open ? s.pOn : ''}`}>
            <h3>{d.name}</h3>
            <p>{d.line}</p>
            <Link className={s.btnW} href={`/departments/${d.slug}`}>{ctaFor(d)} <span aria-hidden="true">&rarr;</span></Link>
          </div>
        ))}
      </div>
    </div>
  );
}
