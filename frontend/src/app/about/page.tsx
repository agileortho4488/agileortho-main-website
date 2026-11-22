import type { Metadata } from 'next';
import Link from 'next/link';
import { site, og, waLink } from '@/content/site';
import { AskBand } from '@/components/SiteChrome';
import { departments } from '@/content/departments';
import { breadcrumb, faqPage, graph, orgRef, organization, url, webPage } from '@/content/schema';
import JsonLd from '@/components/JsonLd';
import Breadcrumb from '@/components/Breadcrumb';
import s from './info.module.css';

const path = '/about';
const deptCount = departments.length;
const mail = (subject: string) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

export const metadata: Metadata = {
  title: { absolute: `About ${site.name} (${site.legalName})` },
  description: `${site.name} is the trading name of ${site.legalName}, a medical device distributor in Hyderabad. We supply hospitals and labs in Telangana.`,
  alternates: { canonical: path },
  openGraph: og(path, `About ${site.name} (${site.legalName})`, undefined, { url: '/images/og/og-about.jpg', width: 1200, height: 630, alt: 'Surgical instrument sets in their trays, and the Agile Healthcare logo' }),
};

// Papers purchase teams can ask for.
const papers = [
  { name: 'Drug licence', no: `DL No. ${site.drugLicence}` },
  { name: 'GST certificate', no: `GSTIN ${site.gstin}` },
  { name: 'Company incorporation certificate', no: `CIN ${site.cin}` },
  { name: 'Udyam (MSME) certificate', no: site.udyam },
];

// What we do for the buyer, then why they can trust us (facts from site.ts). The legal name line stays in the footer.
// Why we exist, in two lines: what goes wrong for a theatre, and what we do instead.
const why = 'Without a distributor, a case can stop for one missing size, or for a set left at the hospital gate.';
const promise = 'We collect the set after the case and bill only what was used.';
const whatText = `${why} ${promise} We supply devices for ${deptCount} departments, to hospitals and labs in Telangana only. We do not make devices or give medical advice.`;
const asOf = '2026-11-14'; // the date in site.numbersSource

// How we work: four promises. The papers have their own section below; the grievance officer is on Contact.
const how: { k: string; v: React.ReactNode }[] = [
  { k: 'A printed set list in every set', v: 'Every set travels with its printed set list, so your theatre staff can check each size and instrument before the case.' },
  { k: 'Two dispatch points', v: 'Sets leave our dispatch centre in LB Nagar or our second dispatch point in Miyapur, Hyderabad.' },
  { k: 'Telangana only', v: 'We supply hospitals and labs in Telangana, and nowhere else.' },
  { k: 'We tell you plainly', v: 'If we do not have a device, we tell you plainly, so your team can plan the case.' },
];

const faq = [
  { q: `What is ${site.name}?`, a: whatText },
  { q: 'Which papers can purchase teams get?', a: `Ask, and we send you copies of these papers. ${papers.map(p => `${p.name}: ${p.no}.`).join(' ')}` },
];

const DocIcon = () => (
  <svg aria-hidden="true" width="24" height="29" viewBox="0 0 28 34" fill="none" stroke="#8A0000" strokeWidth="1.8">
    <path d="M2 2h16l8 8v22H2z" /><path d="M18 2v8h8M7 17h14M7 22h14M7 27h9" />
  </svg>
);

export default function About() {
  return (
    <>
      <JsonLd data={graph(organization, webPage(path, `About ${site.name}`, 'AboutPage', { dateModified: asOf, about: orgRef, mainEntity: orgRef, breadcrumb: { '@id': `${url(path)}#breadcrumb` } }), breadcrumb(path, [{ name: 'Home', path: '/' }, { name: 'About', path }]), faqPage(path, faq))} />

      <section aria-labelledby="about-h1" className={s.hero}>
        <div className={s.glow} aria-hidden="true" />
        <div className={s.grain} aria-hidden="true" />
        <div className={`wrap ${s.heroGrid} ${s.rise}`}>
          <div>
            <Breadcrumb crumbs={[{ name: 'Home', path: '/' }, { name: 'About', path }]} />
            <p className={s.eyebrow}>About {site.name}, Hyderabad, Telangana</p>
            <h1 id="about-h1" className={s.display}>Your device distributor in Hyderabad.{' '}<br />{`Since ${site.foundingDate}.`}</h1>
            <p className={s.lead}>Licensed to supply medical devices to hospitals and labs in Telangana.</p>
            <div className={s.acts}>
              <a className={s.btnRose} href={waLink()}>Ask on WhatsApp <span className={s.nowrap}>{site.whatsapp.display} <span aria-hidden="true">&rarr;</span></span></a>
            </div>
          </div>
          <figure className={s.heroPhoto}>
            <img src="/images/operating-theatre.jpg" width={1600} height={1200} alt="An operating theatre, ready for a case (stock photo)" fetchPriority="high" decoding="async" />
          </figure>
          {/* Phone: the three numbers in one row, then the photo as a short strip. */}
          <ul role="list" className={s.heroStats}>
            {site.numbers.slice(0, 3).map(n => <li key={n.label}><b>{n.value}</b> <span>{n.label}</span></li>)}
          </ul>
          <p className={s.heroSrc}>{site.numbersSource}</p>
        </div>
      </section>

      <section aria-labelledby="what" className={`wrap ${s.what}`}>
        <div>
          <h2 id="what" className={s.h2}>What is {site.name}?</h2>
          <p className={s.whatP}>
            {why} {promise} We supply devices for <Link className={s.tl} href="/#departments">{deptCount} departments</Link>, to hospitals and labs
            in Telangana only. We do not make devices or give medical advice.
          </p>
        </div>
        <div>
          <dl className={`${s.stats} ${s.statsMain}`}>
            {site.numbers.slice(0, 3).map(n => <div key={n.label}><dt>{n.label}</dt><dd>{n.value}</dd></div>)}
          </dl>
          <p className={s.statsSrc}>{site.numbersSource}</p>
        </div>
      </section>

      <section aria-labelledby="how-h" className={`wrap ${s.sec} ${s.how}`}>
        <h2 id="how-h" className={s.h2}>How we work</h2>
        <ol role="list" className={s.steps}>
          {how.map((h, i) => <li key={h.k}><span className={s.howN} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><h3 className={s.k}>{h.k}</h3><p className={s.v}>{h.v}</p></li>)}
        </ol>
      </section>

      <section id="papers" aria-labelledby="papers-h" className={`wrap ${s.sec} ${s.papers}`}>
        <div className={s.papersHead}>
          <div>
            <h2 id="papers-h" className={s.h2} style={{ marginBottom: 14 }}>Which papers can purchase teams get?</h2>
            <p className={s.body} style={{ margin: 0, maxWidth: 640 }}>Ask, and we send you copies of these papers.</p>
          </div>
          <a className={s.pill} href={mail('Vendor papers')}>Ask for all papers by email</a>
        </div>
        <ul role="list" className={s.docs}>
          {papers.map(p => (
            <li key={p.name} className={s.doc}>
              <DocIcon />
              <p className={s.nm}>{p.name}</p>
              <p className={s.no}>{p.no}</p>
              <a className={s.tl} href={mail(`Copy of ${p.name.toLowerCase()}`)} aria-label={`Ask for a copy of the ${p.name.toLowerCase()}`}>Ask for a copy</a>
            </li>
          ))}
        </ul>
      </section>
      <AskBand title={<>Want our papers <br />or a first case? <span className="nb">WhatsApp us.</span></>} sos />
    </>
  );
}
