'use client';

import { useEffect, useRef, useState } from 'react';
import { site, waLink } from '@/content/site';
import s from './opening.module.css';

export type Slide = { name: string; to: string; href: string; img: string; alt: string; kind: 'knee' | 'photo' | 'cut' | 'tall' };

const D = 6000; // ms per slide

/** Home opening: the device carousel (port of Slider.dc.html). Slides change every 6 s; hover, focus, a hidden tab and reduced motion pause them. */

export default function Opening({ slides }: { slides: Slide[] }) {
  const n = slides.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hoverHold, setHoverHold] = useState(false);
  const [focusHold, setFocusHold] = useState(false);
  const [hidden, setHidden] = useState(false);
  // The first photo fades in once it has loaded (2.5 s fallback); the timer waits for it.
  const [entered, setEntered] = useState(false);
  const userChose = useRef(false);
  const left = useRef(D);
  const start = useRef(0);
  const held = hoverHold || focusHold;
  const running = entered && !paused && !held && !hidden;

  // Reduced motion starts paused; the viewer can still press play.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPaused(mq.matches);
    const onMq = () => { if (!userChose.current) setPaused(mq.matches); };
    const onVis = () => setHidden(document.hidden);
    mq.addEventListener('change', onMq);
    document.addEventListener('visibilitychange', onVis);
    onVis();
    const ready = () => setEntered(true);
    const pre = slides.map((sl, k) => { const im = new Image(); if (k === 0) { im.onload = ready; im.onerror = ready; } im.src = sl.img; return im; });
    const rt = setTimeout(ready, 2500);
    return () => { clearTimeout(rt); pre.forEach(im => { im.onload = null; im.onerror = null; }); mq.removeEventListener('change', onMq); document.removeEventListener('visibilitychange', onVis); };
  }, [slides]);

  // Phone header: the "Ask for a device" pill hides while the hero WhatsApp button is in view (CSS reads the flag).
  const ctaRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(([e]) => root.toggleAttribute('data-hero-cta', e.isIntersecting));
    io.observe(el);
    return () => { io.disconnect(); root.removeAttribute('data-hero-cta'); };
  }, []);

  // A new slide gets the full time; a pause keeps what was left. (Declared before the timer, so it runs first.)
  useEffect(() => { left.current = D; }, [i]);
  useEffect(() => {
    if (!running) return;
    start.current = Date.now();
    const t = setTimeout(() => setI(x => (x + 1) % n), left.current);
    return () => { clearTimeout(t); left.current = Math.max(0, left.current - (Date.now() - start.current)); };
  }, [i, running, n]);

  const mouse = (e: React.PointerEvent) => e.pointerType === 'mouse';
  const hold = {
    onPointerEnter: (e: React.PointerEvent) => { if (mouse(e)) setHoverHold(true); },
    onPointerLeave: (e: React.PointerEvent) => { if (mouse(e)) setHoverHold(false); },
  };

  return (
    <section className={s.sl} id="intro" aria-labelledby="hero-h1">
      <div className={s.heroMain}>
        <div className={s.txt}>
          {/* The visual top line is the h1; the eyebrow wording is its hidden prefix, so screen readers hear it once. */}
          <p className={`${s.up} ${s.eyebrow}`} aria-hidden="true">
            Medical device distributor in Hyderabad<span className={s.eyTail}> for hospitals and labs in Telangana</span>
          </p>
          <h1 className={`${s.up} ${s.disp}`} id="hero-h1" style={{ animationDelay: '.06s' }}>
            <span className={s.sr}>Medical device distributor in Hyderabad for hospitals and labs in Telangana: </span>
            The full set,<br />to your theatre.<br />
            <span className={s.accent}>Collected <span className={s.nb}>after the case.</span></span>
          </h1>
          <p className={`${s.up} ${s.sub}`} style={{ animationDelay: '.12s' }}>
            Send the device name on WhatsApp. We bring the full set to your theatre.
          </p>
          <div className={`${s.up} ${s.acts}`} style={{ animationDelay: '.2s' }}>
            <a ref={ctaRef} className={s.cta} href={waLink()}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z" /></svg>
              Ask on WhatsApp {site.whatsapp.display}
            </a>
            <a className={`${s.chip} ${s.glass}`} href={`tel:${site.dispatch.tel}`}>
              <span className={s.ic} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
              </span>
              <span className={s.lb}>Emergency case, any hour: dispatch centre</span>
              <b>{site.dispatch.display}</b>
            </a>
          </div>
        </div>

        <div
          className={`${s.stage} ${s.up} ${entered ? '' : s.pre}`}
          style={{ animationDelay: '.1s' }}
          role="region"
          aria-roledescription="carousel"
          aria-label="Devices we supply"
          aria-live={paused || held ? 'polite' : 'off'}
          onFocus={e => { if ((e.target as HTMLElement).matches(':focus-visible')) setFocusHold(true); }}
          onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusHold(false); }}
        >
          <div className={s.key} aria-hidden="true" />
          <div className={s.floor} aria-hidden="true" />
          {slides.map((sl, k) => (
            <div key={sl.name} className={`${s.slide} ${k === i ? s.on : ''}`} role="group" aria-roledescription="slide"
              aria-hidden={k !== i} aria-label={`${k + 1} of ${n}: ${sl.name}`}>
              <div className={s.dev}>
                <div className={`${s.art} ${sl.kind === 'photo' ? s.photo : `${s.cut} ${sl.kind === 'cut' ? '' : s[sl.kind]}`}`}
                  role="img" aria-label={sl.alt} style={{ backgroundImage: `url('${sl.img}')` }} />
              </div>
            </div>
          ))}

          <div className={s.row}>
            <div className={s.caps}>
              {slides.map((sl, k) => (
                <div key={sl.name} className={`${s.cap} ${k === i ? s.on : ''}`} aria-hidden={k !== i}>
                  <a href={sl.href} tabIndex={-1} aria-label={`${sl.name}, ${sl.to}`} {...hold}>
                    <span className={s.nm}>{sl.name}</span>
                    <span className={s.to}>{sl.to} <span aria-hidden="true">&rarr;</span></span>
                  </a>
                </div>
              ))}
            </div>
            <div className={s.ind}>
              <span className={s.count} aria-hidden="true">{`0${i + 1} / 0${n}`}</span>
              <span className={s.track} aria-hidden="true">
                <span key={i} className={`${s.bar} ${running ? '' : s.hold}`} style={{ animationDuration: `${D}ms` }} />
              </span>
              <button type="button" className={s.pz} {...hold}
                aria-label={paused ? 'Play the device slides' : 'Pause the device slides'}
                onClick={() => { userChose.current = true; setPaused(!paused); setFocusHold(false); setHoverHold(false); }}>
                {paused
                  ? <svg aria-hidden="true" width="14" height="14" viewBox="0 0 10 10"><path d="M1 0 L10 5 L1 10 Z" fill="currentColor" /></svg>
                  : <svg aria-hidden="true" width="14" height="14" viewBox="0 0 10 10"><rect x="1" y="0" width="2.5" height="10" fill="currentColor" /><rect x="6.5" y="0" width="2.5" height="10" fill="currentColor" /></svg>}
              </button>
            </div>
          </div>

          <ul className={s.vh}>
            {slides.map((sl, k) => (
              <li key={sl.name}><a href={sl.href} onFocus={() => setI(k)}>{sl.name}, {sl.to}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
