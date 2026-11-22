'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// A device page sits under its department (the breadcrumb says so), so it lights up Departments, not Devices A to Z.
const LINKS: [href: string, label: string, match: RegExp][] = [
  ['/#departments', 'Departments', /^\/(departments|devices\/.)/],
  ['/devices', 'Devices A to Z', /^\/devices\/?$/],
  ['/how-we-deliver', 'How we deliver', /^\/how-we-deliver/],
  ['/about', 'About', /^\/about/],
  ['/contact', 'Contact', /^\/contact/],
];

/** The five main links; the one for the current page is a filled pill. */
export default function NavLinks() {
  const path = usePathname() ?? '/';
  return (
    <>
      {LINKS.map(([href, label, match]) => (
        <Link key={href} href={href} aria-current={match.test(path) ? 'page' : undefined}
          onClick={e => e.currentTarget.closest('details')?.removeAttribute('open')}>{label}</Link>
      ))}
    </>
  );
}
