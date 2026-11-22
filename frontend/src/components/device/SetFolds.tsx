'use client';
import { useEffect } from 'react';

/**
 * "What comes in the set": every group is a disclosure. On a phone the first group stays open and the
 * others start shut (as in the design); on a wider screen all stay open and the summaries do not fold.
 * Without JavaScript every group stays open.
 */
export default function SetFolds() {
  useEffect(() => {
    const grid = document.querySelector('[data-set]');
    if (!grid) return;
    const phone = matchMedia('(max-width: 640px)');
    const groups = [...grid.querySelectorAll<HTMLDetailsElement>('details')];
    // A short list (8 rows or fewer) stays open, so no group looks unfinished.
    const rows = grid.querySelectorAll('li').length;
    if (phone.matches && rows > 8) groups.forEach(g => { if (!g.hasAttribute('data-first')) g.open = false; });
    const onClick = (e: Event) => {
      if (!phone.matches && (e.target as HTMLElement).closest('summary')) e.preventDefault();
    };
    grid.addEventListener('click', onClick);
    return () => grid.removeEventListener('click', onClick);
  }, []);
  return null;
}
