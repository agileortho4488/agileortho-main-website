'use client';
import { useState } from 'react';
import Link from 'next/link';

export type Row = { name: string; aka: string[]; dept: string; family: string; line: string; href: string; id: string };

// Every typed word must appear in the name, also-called names, department or family.
const match = (r: Row, words: string[]) => {
  const hay = `${r.name} ${r.aka.join(' ')} ${r.dept} ${r.family}`.toLowerCase();
  return words.every(w => hay.includes(w));
};

export default function DeviceSearch({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState('');
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const hits = words.length ? rows.filter(r => match(r, words)) : [];

  return (
    <div>
      <form className="search" role="search" onSubmit={e => e.preventDefault()}>
        <label htmlFor="q" className="muted small">Search by device name, also-called name or department</label>
        <input id="q" type="search" value={q} onChange={e => setQ(e.target.value)} autoComplete="off" />
      </form>
      <div aria-live="polite">
        {words.length > 0 && (
          <>
            <h2 style={{ marginTop: 24 }}>{hits.length ? `${hits.length} ${hits.length === 1 ? 'result' : 'results'}` : 'No device matches that name.'}</h2>
            <ul className="list">
              {hits.map(r => (
                <li key={r.id}>
                  <strong><Link href={r.href}>{r.name}</Link></strong> <span className="muted small">{r.dept}</span>
                  <br />
                  <span className="muted">{r.line}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
