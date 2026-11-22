import Link from 'next/link';
import type { ReactNode } from 'react';
import { site, waLink } from '@/content/site';
import { departments } from '@/content/departments';
import NavLinks from './NavLinks';

const LOGO = '/brand/agile_healthcare_logo_horizontal_white.png';

export function Header() {
  return (
    <header className="hdr noprint">
      <div className="wrap hdr-in">
        <Link href="/" className="hdr-logo" aria-label="Agile Healthcare, home">
          <img src={LOGO} alt="Agile Healthcare" width={177} height={28} />
        </Link>
        <nav className="nav" aria-label="Main"><NavLinks /></nav>
        <a className="hdr-cta" href={waLink()}>Ask for a device</a>
        <details className="mnav">
          <summary aria-label="Menu">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </summary>
          <nav aria-label="Main menu"><NavLinks /></nav>
        </details>
      </div>
    </header>
  );
}

const DEFAULT_SUB = 'We supply hospitals and labs in Telangana. If we do not have it, we tell you plainly.';

/** Closing ask: the inset red card. Each page passes its own headline. */
export function AskBand({ title, sub = DEFAULT_SUB, wa = waLink(), sos = false, send = false }: {
  title: ReactNode; sub?: string; wa?: string; sos?: boolean; send?: boolean;
}) {
  return (
    <section id="ask" className="ask noprint" aria-labelledby="ask-h">
      <div className="ask-card dk">
        <div className="grain" aria-hidden="true" />
        <div className="ask-l">
          <h2 id="ask-h">{title}</h2>
          <p>{sub}</p>
        </div>
        <div className="ask-r">
          <a className="ask-btn" href={wa}>Ask on WhatsApp <span className="nb">{site.whatsapp.display} <span aria-hidden="true">&rarr;</span></span></a>
          {sos && (
            <p className="ask-sos">Emergency case, any hour: <span className="nb">dispatch centre <a href={`tel:${site.dispatch.tel}`}>{site.dispatch.display}</a></span></p>
          )}
          <p className="ask-note">Do not send patient details or patient photos.</p>
          {send && <Link className="ask-send" href="/how-we-deliver#book">What to send us</Link>}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const g = site.grievance;
  return (
    <footer className="ft dk">
      <div className="wrap">
        <div className="ft-top">
          <div className="ft-brand">
            <img src={LOGO} alt="Agile Healthcare" width={177} height={28} />
            <p>{site.name} is the trading name of {site.legalName}. {site.tagline}</p>
            <details className="ft-fold ft-co" open>
              <summary className="ft-h">Company details</summary>
              <p className="ft-ids">
                CIN {site.cin}<br />
                GSTIN {site.gstin}<br />
                Drug licence: DL No. {site.drugLicence}<br />
                Office: {site.address.oneLine}
              </p>
            </details>
          </div>
          <nav className="ft-pages" aria-label="Pages">
            <details className="ft-fold" open>
            <summary className="ft-h">Pages</summary>
            <ul>
              <li><Link href="/devices">Devices A to Z</Link></li>
              <li><Link href="/how-we-deliver">How we deliver</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/about#papers">Papers for purchase teams</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy policy</Link></li>
              <li><Link href="/terms">Terms of use</Link></li>
            </ul>
            </details>
          </nav>
          <details className="ft-fold" open>
            <summary className="ft-h">Help</summary>
            <dl className="ft-help">
              <div>
                <dt>Grievance officer: {g.name}</dt>
                <dd><a href={`mailto:${g.email}`}>{g.email}</a></dd>
                <dd><a href={`tel:${g.tel}`}>Grievance phone {g.display}</a></dd>
              </div>
              <div>
                <dt>Planned case: case booking</dt>
                <dd><a href={site.whatsapp.url}>WhatsApp {site.whatsapp.display}</a></dd>
              </div>
            </dl>
          </details>
          <div className="sos">
            <p className="sos-k">Emergency case, any hour</p>
            <p className="sos-l">Dispatch centre</p>
            <a className="sos-n" href={`tel:${site.dispatch.tel}`}>{site.dispatch.display}</a>
          </div>
        </div>
        <nav className="ft-deps" aria-label="Departments">
          <details className="ft-fold" open>
            <summary className="ft-h">Departments</summary>
            <ul>
              {departments.map(d => (
                <li key={d.slug}><Link href={`/departments/${d.slug}`}>{d.name}</Link></li>
              ))}
            </ul>
          </details>
        </nav>
        {/* Phone: the long lists start folded. Wide screens: the column labels are plain labels (not a toggle, not a tab stop). Runs before first paint; without JS they stay open. */}
        <script dangerouslySetInnerHTML={{ __html: "if(matchMedia('(max-width: 640px)').matches)document.querySelectorAll('.ft-fold').forEach(function(d){d.open=false});else document.querySelectorAll('.ft-fold>summary').forEach(function(s){s.tabIndex=-1})" }} />
        <div className="ft-legal">
          <p>{site.disclaimer} Found a mistake on a device page? Write to <a href={`mailto:${site.email}?subject=${encodeURIComponent('Device page error')}`}>{site.email}</a>.</p>
          <details className="credits">
            <summary>Photo credits</summary>
            <p>
              Science Museum, London / Wellcome Collection,{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>; Superbass,{' '}
              <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>; Frank C. Mueller,{' '}
              <a href="https://creativecommons.org/licenses/by-sa/2.5/">CC BY-SA 2.5</a>; Bullenwaechter,{' '}
              <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a> (Wikimedia Commons; cropped, cut out
              or recoloured, shared under the same licence). Scene photos: Unsplash and Pexels.
            </p>
          </details>
        </div>
      </div>
    </footer>
  );
}
