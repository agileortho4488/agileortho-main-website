'use client';
import { useEffect, useRef, useState } from 'react';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
import Link from 'next/link';
import { waLink, site } from '@/content/site';
import Breadcrumb from '@/components/Breadcrumb';
import s from './search.module.css';

export type AzRow = {
  name: string; aka: string[]; dept: string; deptSlug: string; family: string; line: string;
  href: string; act: string; id: string; page: boolean;
};
export type AzDept = { name: string; slug: string; searchWord: string };
export type AzPopular = { name: string; href: string; src: string; width: number; height: number; look?: 'silver' | 'lift' | 'knee' | 'nail' | 'photo' };

type Hit = { r: AzRow; idx: number; akaHit: string | null; rank: number };

// Name, also-called names, department and family. A department name (or its search word) shows only that department.
function find(rows: AzRow[], depts: AzDept[], text: string): Hit[] {
  const q = text.trim().toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const dep = depts.find(d => d.name.toLowerCase() === q || d.searchWord === q);
  const hits: Hit[] = [];
  rows.forEach((r, idx) => {
    const name = r.name.toLowerCase();
    const inName = words.every(w => name.includes(w));
    const akaHit = inName ? null : r.aka.find(a => words.every(w => `${a.toLowerCase()} ${name}`.includes(w))) || null;
    const hay = `${r.name} ${r.aka.join(' ')} ${r.dept} ${r.family}`.toLowerCase();
    const ok = dep ? r.deptSlug === dep.slug : inName || !!akaHit || words.every(w => hay.includes(w));
    if (ok) hits.push({ r, idx, akaHit, rank: name.includes(q) || akaHit?.toLowerCase() === q ? 0 : inName || akaHit ? 1 : 2 });
  });
  return hits.sort((a, b) => a.rank - b.rank || a.idx - b.idx);
}

// Chip label: the first part of a long department name ('Neurosurgery and neuro-intervention' -> 'Neurosurgery'). The department page keeps the full name.

const head = (text: string, n: number) =>
  n ? `${n} ${n === 1 ? 'result' : 'results'} for “${text.trim()}”` : 'No device matches that name.';

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export default function DevicesAZ({ rows, depts, popular }: { rows: AzRow[]; depts: AzDept[]; popular: AzPopular[] }) {
  const [q, setQ] = useState('');
  const [announced, setAnnounced] = useState('');
  const [typed, setTyped] = useState(false);
  const [fromUrl, setFromUrl] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const resultsHead = useRef<HTMLHeadingElement>(null);
  const [fab, setFab] = useState(false);
  const [stuck, setStuck] = useState(false);
  const navTop = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    try {
      const v = (new URLSearchParams(window.location.search).get('q') || '').slice(0, 80);
      if (v) { setQ(v); setAnnounced(v); setFromUrl(true); }
    } catch {}
    // The letter bar is sticky: 'Back to top' shows only once the bar has left its place (the reader is below the top of the list).
    const io = navTop.current && 'IntersectionObserver' in window
      ? new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0)) : null;
    if (io && navTop.current) io.observe(navTop.current);
    // Phone: a floating "Letters" button shows once the reader has scrolled into the list.
    const onScroll = () => { const a = document.getElementById('az'); setFab(!!a && window.scrollY > a.offsetTop + 400); };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Links arrive as #dev-<slug> or #az-<letter>: open that entry (and its letter).
    const open = () => {
      const el = document.getElementById(location.hash.slice(1));
      if (!el) return;
      const g = el.closest<HTMLDetailsElement>('details[data-az]');
      if (g) g.open = true;
      const dx = el.querySelector('details');
      if (dx) dx.open = true;
      if (g || dx) el.scrollIntoView({ block: 'start' });
    };
    // Phone: only the first letter starts open, so the list is short; a letter link opens its group.
    if (window.matchMedia('(max-width: 560px)').matches && !location.hash)
      document.querySelectorAll<HTMLDetailsElement>('details[data-az]').forEach((g, k) => { if (k > 0) g.open = false; });
    open();
    window.addEventListener('hashchange', open);
    return () => { io?.disconnect(); window.removeEventListener('hashchange', open); window.removeEventListener('scroll', onScroll); clearTimeout(timer.current); };
  }, []);

  const change = (v: string) => {
    setQ(v);
    setTyped(true);
    setFromUrl(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAnnounced(v), 600);
  };
  const toResults = () => requestAnimationFrame(() => {
    resultsHead.current?.focus({ preventScroll: true });
    resultsHead.current?.scrollIntoView({ block: 'start' });
  });

  const raw = q.trim();
  const hits = find(rows, depts, q);
  const n = hits.length;
  // Close matches: a name word that starts with the first 3 letters typed. Never filler.
  const stem = (raw.toLowerCase().split(/\s+/)[0] || '').slice(0, 3);
  const near = n === 0 && stem.length === 3
    ? rows.filter(r => `${r.name} ${r.aka.join(' ')}`.toLowerCase().split(/[^a-z0-9]+/).some(w => w.startsWith(stem))).slice(0, 3)
    : [];
  const ann = announced.trim();
  const activeDept = depts.find(d => d.name === raw);
  // The six departments asked for most (the list order), plus the one picked; "See all" opens the rest.
  const shownDepts = depts; // all 16 as chips

  const byL = new Map<string, AzRow[]>();
  rows.forEach(r => { const c = r.name[0].toUpperCase(); byL.set(c, [...(byL.get(c) || []), r]); });
  const groups = [...byL.entries()].sort(([a], [b]) => a.localeCompare(b));
  // The A to Z list is one flow of whole letters; CSS columns balance it by real height.
  const wide = () => !window.matchMedia('(max-width: 560px)').matches;

  return (
    <>
      <div className={s.hero}>
        <section aria-labelledby="sh" className={s.heroIn}>
          <div className={s.hgrid}>
            <div className={s.hleft}>
              <div>
                <Breadcrumb crumbs={[{ name: 'Home', path: '/' }, { name: 'Devices A to Z', path: '/devices' }]} className={s.crumb} />
                <p className={s.eb}>Supplied in Hyderabad and Telangana</p>
                <h1 id="sh" className={`${s.h1} ${s.rise}`}>Devices A to Z</h1>
                <p className={`${s.lede} ${s.rise}`} style={{ animationDelay: '.06s' }}>
                  Search by any name hospitals use, for example wrist plate or TKR. Then ask on WhatsApp.
                </p>
              </div>
              <div className={s.hsearch}>
                <label htmlFor="q" className={s.lbl}>Type a device name</label>
                <form role="search" aria-label="Search devices A to Z" className={s.form}
                  onSubmit={e => { e.preventDefault(); toResults(); }}>
                  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5E5A55" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
                  <input id="q" name="q" type="search" enterKeyHint="search" value={q} onChange={e => change(e.target.value)}
                    placeholder="For example: wrist plate" autoComplete="off" spellCheck={false} autoCapitalize="none" autoCorrect="off" className={s.input} />
                </form>
                <p id="dch" className={s.lbl} style={{ marginTop: 24 }}>Or pick a department</p>
                <ul className={s.dchips} aria-labelledby="dch">
                  {shownDepts.map(d => (
                    <li key={d.slug} className={activeDept?.slug === d.slug ? s.dkeep : undefined}>
                      <button type="button" aria-pressed={activeDept?.slug === d.slug}
                        onClick={() => { change(activeDept?.slug === d.slug ? '' : d.name); setAnnounced(d.name); }}>
                        {d.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <nav className={s.hfig} aria-labelledby="poph">
              <p id="poph" className={s.hfl}>Most asked device pages</p>
              {popular.map(p => (
                <Link key={p.href} className={s.hf} href={p.href}>
                  <span className={s.hfi}><span className="stg-floor" aria-hidden="true" /><img className={p.look ? s[p.look] : undefined} src={p.src} alt="" width={p.width} height={p.height} /></span>
                  <span className={s.hfn}>{p.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </div>

      <p className={s.sr} role="status" aria-live="polite">{ann ? head(ann, find(rows, depts, ann).length) : ''}</p>

      {raw && (
        <section aria-labelledby="rh" className={s.results}>
          <h2 id="rh" ref={resultsHead} tabIndex={-1} className={s.rh}>{head(raw, n)}</h2>
          {n > 0 ? (
            <ul className={s.rlist}>
              {hits.map(({ r, akaHit }, k) => {
                const key = r.id.slice(4);
                const others = r.aka.filter(a => a !== akaHit);
                return (
                  <li key={r.id} className={fromUrl ? s.rise : undefined} style={fromUrl ? { animationDelay: `${Math.min(k, 5) * 0.04}s` } : undefined}>
                    <Link href={r.href} className={s.row} aria-label={r.page ? `${r.name}, ${r.dept}, device page` : `${r.name}: see it in ${r.dept}`}
                      aria-describedby={`${r.aka.length ? `ra-${key} ` : ''}rl-${key}`}>
                      <span className={s.rmain}>
                        <span className={s.rtop}>
                          <span className={s.rname}>{r.name}</span>
                          <span className={s.rdept}>{r.dept}</span>
                        </span>
                        {r.aka.length > 0 && (
                          <span id={`ra-${key}`} className={s.raka}>
                            Also called {akaHit ? <><b>{akaHit}</b>{others.length ? `, ${others.join(', ')}` : ''}</> : r.aka.join(', ')}
                          </span>
                        )}
                        <span id={`rl-${key}`} className={s.rline}>{r.line}</span>
                      </span>
                      <span className={s.act} aria-hidden="true"><span>{r.act}</span><span className={s.arr}>&#8594;</span></span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className={s.none}>
              <div>
                <h3 className={s.noneH}>Send the name or a photo.</h3>
                <p className={s.noneP}>We supply hospitals and labs in Telangana. If we do not have it, we tell you plainly.</p>
                {/* Only text the reader typed goes into the prefill; a ?q= link cannot pre-type a message. */}
                <a className={s.btnR} href={typed ? waLink(raw) : waLink()}>
                  Ask on WhatsApp <span className={s.nw}>{site.whatsapp.display} <span aria-hidden="true">&#8594;</span></span>
                </a>
              </div>
              {near.length > 0 && (
                <div>
                  <p className={s.closeH}>Close matches</p>
                  <ul className={s.closeL}>
                    {near.map(r => (
                      <li key={r.id}>
                        <Link className={s.cl} href={r.href}>
                          <span><span className={s.clN}>{r.name}</span><span className={s.clA}>{r.act}</span></span>
                          <span aria-hidden="true">&#8594;</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      <section id="az" aria-labelledby="azh" className={s.az}>
        <div className={s.azhead}>
          <h2 id="azh" className={s.azh}>Devices we supply, A to Z</h2>
          <p className={s.azdeps}>{rows.length} devices in {depts.length} departments</p>
        </div>
        <div className={s.azguide}>
          <p className={s.azkey}>Names in red with an arrow <span className={s.azpgKey} aria-hidden="true"><Arrow /></span> have their own page. Open any other name to see what it is and which department uses it.</p>
        </div>
        <span ref={navTop} aria-hidden="true" className={s.navTop} />
        <nav aria-label="Jump to letter" className={`${s.aznav} ${stuck ? s.stuck : ''}`} id="az-letters">
          <div className={s.azbar} data-at="start"
            onScroll={e => { const b = e.currentTarget; b.dataset.at = b.scrollLeft < 8 ? 'start' : b.scrollLeft + b.clientWidth >= b.scrollWidth - 8 ? 'end' : 'mid'; }}>
            {/* Every letter keeps its place; a letter with no devices is shown dimmed, not as a link. */}
            {LETTERS.map(ch => byL.has(ch) ? (
              <a key={ch} className={s.azl} href={`#az-${ch}`} aria-label={`Devices starting with ${ch}`}
                onClick={() => { const d = document.getElementById(`az-${ch}`) as HTMLDetailsElement | null; if (d) d.open = true; }}>{ch}</a>
            ) : <span key={ch} className={`${s.azl} ${s.azoff}`} aria-hidden="true" aria-disabled="true">{ch}</span>)}
          </div>
          <a className={s.aztop} href="#az"><span className={s.aztopT} aria-hidden="true">Back to top </span><span aria-hidden="true">&#8593;</span><span className={s.sr}>Back to top</span></a>
        </nav>
        <a className={`${s.fab} ${fab ? s.fabOn : ''}`} href="#az-letters" tabIndex={fab ? 0 : -1} aria-hidden={!fab}><span aria-hidden="true">&#8593;</span> Letters</a>
        <div className={s.azcols}>
          {groups.map(([ch, items]) => (
            <details key={ch} id={`az-${ch}`} className={s.azg} data-az="" open>
              <summary className={s.azgs} onClick={e => { if (wide()) e.preventDefault(); }}>
                <h3 className={s.azgh}>{ch}</h3>
                <span className={s.azcount}>{items.length} {items.length === 1 ? 'device' : 'devices'}</span>
              </summary>
              <span aria-hidden="true" className={s.azrule} />
              <div className={s.azlist}>
                {items.map(r => (
                  <div key={r.id} id={r.id} className={s.aze}>
                    {r.page ? (
                      <Link className={s.azgo} href={r.href} aria-label={`${r.name}, ${r.dept}, device page`}>
                        <span className={s.azt}>
                          <span className={s.azn}>{r.name}</span>
                          <span className={s.azdp}>{r.dept}</span>
                        </span>
                        <span className={s.azpg} aria-hidden="true"><Arrow /></span>
                      </Link>
                    ) : (
                    <details className={s.azx}>
                      <summary>
                        <span className={s.azt}>
                          <span className={s.azn}>{r.name}</span>
                          <span className={s.azdp}>{r.dept}</span>
                        </span>
                        <span className={s.azc} aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></span>
                      </summary>
                      <div className={s.azb}>
                        {r.aka.length > 0 && <p className={s.aka}>Also called {r.aka.join(', ')}</p>}
                        <p>{r.line}</p>
                        <p className={s.azk}>
                          <a href={waLink(r.name)} aria-label={`Ask on WhatsApp about ${r.name}`}>Ask on WhatsApp &#8594;</a>
                          <Link href={r.href} aria-label={`${r.name}: see it in ${r.dept}`}>{r.act}</Link>
                        </p>
                      </div>
                    </details>
                    )}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
