import Link from 'next/link';
import type { Crumb } from '@/content/schema';

/** Breadcrumb on the dark hero. The last crumb is the current page; its JSON-LD twin is schema.breadcrumb(). */
export default function Breadcrumb({ crumbs, className = '', sep = '' }: { crumbs: Crumb[]; className?: string; sep?: string }) {
  const last = crumbs[crumbs.length - 1];
  return (
    <nav aria-label="Breadcrumb" className={`crumb ${className}`}>
      <ol role="list">
        {crumbs.slice(0, -1).map(c => (
          <li key={c.path}><Link href={c.path}>{c.name}</Link><span className={sep} aria-hidden="true"> / </span></li>
        ))}
        <li><span aria-current="page">{last.name}</span></li>
      </ol>
    </nav>
  );
}
