'use client';
import { useEffect } from 'react';

/**
 * Phone behaviour from the design: families after the first start shut, the count button
 * opens one, a chip or a #family link opens its family, and a floating WhatsApp button
 * shows once the hero button has scrolled away. Without JavaScript every family stays open.
 */
export default function FamilyToggles({ heroCta }: { heroCta: string }) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.js = '1'; // long families fold to 4 rows only when the "Show all" button can work
    const fams = [...document.querySelectorAll<HTMLElement>('[data-fam]')];
    const set = (el: HTMLElement, shut: boolean) => {
      el.toggleAttribute('data-shut', shut);
      el.querySelector('button[aria-controls]')?.setAttribute('aria-expanded', String(!shut));
    };
    const open = (id: string) => { const el = fams.find(f => f.id === id); if (el) set(el, false); };

    if (matchMedia('(max-width: 899px)').matches) fams.slice(1).forEach(f => set(f, true));
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash) {
      // A device row link (#dev-slug) opens the family that holds it.
      const target = document.getElementById(hash);
      const fam = target?.closest<HTMLElement>('[data-fam]');
      if (fam) { set(fam, false); if (target!.hasAttribute('data-extra')) fam.toggleAttribute('data-all', true); requestAnimationFrame(() => target!.scrollIntoView({ block: 'start' })); }
    }

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const all = t.closest<HTMLButtonElement>('[data-allrows]');
      if (all) { const f = all.closest<HTMLElement>('[data-fam]')!; const on = !f.hasAttribute('data-all'); f.toggleAttribute('data-all', on); all.setAttribute('aria-expanded', String(on)); all.textContent = on ? 'Show fewer' : `Show all ${f.querySelectorAll('[id^="dev-"]').length}`; return; }
      const btn = t.closest<HTMLButtonElement>('[data-fam] button[aria-controls]');
      if (btn) { const f = btn.closest<HTMLElement>('[data-fam]')!; set(f, !f.hasAttribute('data-shut')); return; }
      const chip = t.closest<HTMLAnchorElement>('a[data-chip]');
      if (chip) open(chip.hash.slice(1));
    };
    document.addEventListener('click', onClick);

    const cta = document.getElementById(heroCta);
    let io: IntersectionObserver | undefined;
    if (cta && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting || e.boundingClientRect.top > 0) delete root.dataset.fwa;
        else root.dataset.fwa = '1';
      });
      io.observe(cta);
    }
    return () => { document.removeEventListener('click', onClick); io?.disconnect(); delete root.dataset.fwa; };
  }, [heroCta]);
  return null;
}
