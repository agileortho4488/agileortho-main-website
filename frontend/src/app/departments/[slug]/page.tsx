import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { departments, getDepartment } from '@/content/departments';
import { devices, slugify, lowerName, article, type Device } from '@/content/devices';
import { site, waLink, og } from '@/content/site';
import { familySets, bullets } from '@/content/department-sets';
import { AskBand } from '@/components/SiteChrome';
import { breadcrumb, graph, url, webPage } from '@/content/schema';
import JsonLd from '@/components/JsonLd';
import Breadcrumb from '@/components/Breadcrumb';
import DarkStage from '@/components/DarkStage';
import FamilyToggles from '@/components/department/FamilyToggles';
import { familyPic, heroDevice, heroPhoto, ogImage } from '@/components/department/media';
import s from '@/components/department/department.module.css';

export const dynamicParams = false;
export const generateStaticParams = () => departments.map(d => ({ slug: d.slug }));

type Props = { params: Promise<{ slug: string }> };


/** Hero title, hero line and the intro answer, where the plain "<Name> devices" pattern reads wrong. */
const COPY: Record<string, { h1: string; lead: string; intro: string; adj: string }> = {
  orthopaedics: {
    h1: 'Orthopaedic implants and instruments',
    lead: 'Plates, screws, nails, wires and joint replacement parts, packed as a full set, brought to your theatre and collected after the case.',
    intro: 'We supply {n} groups of orthopaedic devices. Each set comes with the instruments to place it, and our rider collects the set after the case.',
    adj: 'orthopaedic',
  },
  cardiology: {
    h1: 'Cardiology devices for the cath lab',
    lead: 'Stents, balloons, guide wires and sheaths, each in its own sterile pack, for planned and emergency cases.',
    intro: 'We supply these devices for angioplasty in the cath lab. Each device comes in its own sterile pack. These are not sets, so nothing is collected after the case.',
    adj: 'cardiology',
  },
};

/** "Orthopaedics" -> "orthopaedics", but "ENT" and "OT and ..." stay as written. */
const lower = lowerName;
const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const CSSD = 'Implants in sealed sterile packs are used as packed. They are never re-sterilised. Your CSSD sterilises the reusable instruments and any implants supplied non-sterile, before the case. Check each label.';
/** Departments where nothing is sterilised before use, so the CSSD line does not apply. */
const NO_CSSD = new Set(['laboratory-diagnostics', 'sleep-respiratory']);
const cap = (t: string) => t[0].toUpperCase() + t.slice(1);
/** Phone: a long family shows this many devices, then a "Show all" button. */
const SHOW = 2;
const rowHref = (x: Device) => (x.faq.length ? `/devices/${x.slug}` : `/devices#dev-${x.slug}`);
/** Row order where the case has an order (cath lab: sheath, wire, balloon, stent); others stay A to Z. */
const ORDER: Record<string, string[]> = { cardiology: ['introducer-sheath', 'guide-wire', 'balloon-catheter', 'coronary-stent'] };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = getDepartment((await params).slug);
  if (!d) return {};
  const title = `${d.name} devices in Hyderabad`;
  const img = ogImage[d.slug];
  return { title, description: d.line, alternates: { canonical: `/departments/${d.slug}` },
    openGraph: og(`/departments/${d.slug}`, `${title} | ${site.name}`, d.line, img ? { url: img, width: 1200, height: 630, alt: `${d.name} devices` } : undefined) };
}

export default async function DepartmentPage({ params }: Props) {
  const d = getDepartment((await params).slug);
  if (!d) notFound();
  const path = `/departments/${d.slug}`;
  const definition = d.definition;
  const order = ORDER[d.slug] ?? [];
  const rank = (x: Device) => (order.includes(x.slug) ? order.indexOf(x.slug) : order.length);
  const list = devices.filter(x => x.department === d.slug).sort((a, b) => rank(a) - rank(b));

  // Family order from the department text, then any family only the device rows name.
  const names = [...new Set([...d.families.map(f => f.name), ...list.map(x => x.family)])];
  const families = names
    .map(name => {
      const rows = list.filter(x => x.family === name);
      const def = d.families.find(f => f.name === name)?.definition ?? '';
      const tells = rows.flatMap(x => {
        const t = x.tellUs?.replace(/^Tell us:\s*/, '');
        return t ? [rows.length > 1 ? `${x.name}: ${t}` : cap(t)] : [];
      });
      return { name, id: slugify(name), def, rows, tells, set: familySets[name] };
    })
    .filter(f => f.rows.length > 0);
  const total = String(families.length).padStart(2, '0');
  const hero = heroDevice[d.slug];
  const photo = heroPhoto[d.slug];
  const showCssd = /\bsets?\b/i.test(definition);
  const copy = COPY[d.slug];
  const adj = copy?.adj ?? lower(d.name);
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Departments', path: '/#departments' }, { name: d.name, path }];

  return (
    <>
      <JsonLd
        data={graph(
          webPage(path, `${d.name} devices in Hyderabad`, 'CollectionPage', { breadcrumb: { '@id': `${url(path)}#breadcrumb` } }),
          // The middle crumb is a page fragment, so the structured data names only real pages.
          breadcrumb(path, crumbs.filter(c => !c.path.includes('#'))),
          {
            '@type': 'ItemList',
            '@id': `${url(path)}#itemlist`,
            itemListElement: list.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, description: x.short, ...(x.faq.length ? { url: url(rowHref(x)) } : {}) })),
          },
        )}
      />
      <FamilyToggles heroCta="dept-cta" />

      <div className={s.hero}>
        <div className={s.heroLight} aria-hidden="true" />
        <section aria-labelledby="dept-h1" className={s.heroIn}>
          <div>
            <Breadcrumb className={`${s.rise} ${s.crumb}`}
              crumbs={crumbs} />
            <h1 id="dept-h1" className={`${s.rise} ${s.h1}`}>{copy?.h1 ?? `${d.name} devices`}</h1>
            <p className={`${s.rise} ${s.lead}`}>{copy?.lead ?? d.line}</p>
            <div className={`${s.rise} ${s.acts}`}>
              <a id="dept-cta" className={s.cta} href={waLink(d.name)}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z" /></svg>
                Ask on WhatsApp {site.whatsapp.display}
              </a>
              <a className={s.sosBar} href={`tel:${site.dispatch.tel}`}>
                <span className={s.ic} aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg></span>
                <span className={s.lb}>Emergency case, any hour: dispatch centre</span>
                <b>{site.dispatch.display}</b>
              </a>
            </div>
          </div>
          {hero && (
            <div className={s.heroArt}>
              <DarkStage className={s.stage} floor>
                <div className={s.dev} style={{ height: hero.size }}>
                  <img src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} style={{ rotate: `${hero.rotate}deg` }} fetchPriority="high" decoding="async" />
                </div>
              </DarkStage>
            </div>
          )}
          {!hero && photo && (
            <div className={s.heroArt}>
              <img className={s.heroPhoto} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} style={{ objectPosition: photo.pos }} fetchPriority="high" decoding="async" />
            </div>
          )}
        </section>
      </div>

      <section aria-labelledby="find" className={s.body}>
        <div className={s.intro}>
          <h2 id="find" className={s.h2}>Which {adj} devices do you supply?</h2>
          <div>
            {(copy?.intro || definition) && <p className={s.introP}>{(copy?.intro ?? definition).replace('{n}', NUM[families.length] ?? String(families.length))}</p>}
            {showCssd && <p className={s.cssd}><Link className={s.gwa} href="/how-we-deliver#h-packed">Who sterilises what <span aria-hidden="true">&#8594;</span></Link></p>}
          </div>
        </div>

        {families.length > 1 && (
          <nav className={s.chips} aria-label="Device families">
            <ul role="list">
              {families.map(f => <li key={f.id}><a data-chip href={`#${f.id}`}>{f.name}</a></li>)}
            </ul>
          </nav>
        )}

        {families.map((f, i) => {
          const solo = families.length === 1;
          // One group only: a second picture only where it differs from the hero (familyPic decides).
          const pic = familyPic[f.name];
          // One group of single packs: the intro already says "not sets", so the panel shows only "Tell us".
          const showSet = f.set && !(solo && f.set.supplied);
          return (
            <div key={f.id} id={f.id} data-fam className={`${s.fam} ${f.rows.length <= 2 ? s.famSmall : ''} ${solo ? s.famSolo : ''}`}>
              <div>
                <div className={s.fhead}>
                  {pic && !solo && <img className={`${s.fthumb} ${pic.contain || pic.cut ? s.fthumbContain : ''}`} src={pic.src} alt="" width={64} height={64} loading="lazy" decoding="async" />}
                  <div className={s.ftitle}>
                    {!solo && <span aria-hidden="true" className={s.num}>{String(i + 1).padStart(2, '0')} / {total}</span>}
                    <h3 id={`${f.id}-h`} className={s.h3}>{f.name}</h3>
                  </div>
                  {!solo && (
                    <button type="button" className={s.ftog} aria-expanded="true" aria-controls={`${f.id}-b`}>
                      {f.rows.length} {f.rows.length === 1 ? 'device' : 'devices'}
                    </button>
                  )}
                </div>
                <div className={s.fbody}>
                  {f.def && <p className={s.def}>{f.def}</p>}
                  {pic && <img className={`${s.tile} ${pic.contain ? s.tileContain : ''} ${pic.cut ? s.tileCut : ''}`} src={pic.src} alt={pic.alt} width={pic.width} height={pic.height} loading="eager" decoding="async" />}
                </div>
              </div>
              <div id={`${f.id}-b`} className={s.fbody} style={{ minWidth: 0 }}>
                {i === 0 && list.some(x => x.faq.length) && list.some(x => !x.faq.length) && (
                  <p className={s.arrowKey}>Names with an arrow <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg> have their own page.</p>
                )}
                <div className={s.cards}>
                  {f.rows.map((x, k) => {
                    // Every row gets its plain-English line, a group of one too.
                    const hasDesc = x.short !== f.def;
                    const by = [hasDesc && `${x.slug}-d`, x.alsoCalled.length && `${x.slug}-a`].filter(Boolean).join(' ') || undefined;
                    // Only a device with its own page is a link (the whole row); the others are plain text.
                    const page = x.faq.length > 0;
                    const txt = (
                      <span className={s.rowTxt}>
                        <span className={s.nmw}>
                          <span id={`${x.slug}-n`} className={s.nm}>{x.name}</span>
                          {page && <svg className={s.ar} aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>}
                        </span>
                        {hasDesc && <span id={`${x.slug}-d`} className={s.desc}>{x.short}</span>}
                        {x.alsoCalled.length > 0 && <span id={`${x.slug}-a`} className={s.also}>Also called {x.alsoCalled.join(', ')}</span>}
                      </span>
                    );
                    const extra = k >= SHOW && !solo ? '' : undefined;
                    return page
                      ? <a key={x.slug} id={`dev-${x.slug}`} data-extra={extra} className={s.row} href={rowHref(x)} aria-labelledby={`${x.slug}-n`} aria-describedby={by}>{txt}</a>
                      : <div key={x.slug} id={`dev-${x.slug}`} data-extra={extra} className={`${s.row} ${s.rowAskRow}`}>{txt}<a className={s.rowAsk} href={waLink(x.name)} aria-label={`Ask on WhatsApp for ${x.name}`}>Ask on WhatsApp</a></div>;
                  })}
                </div>
                {f.rows.length > SHOW && !solo && <button type="button" className={s.allRows} data-allrows aria-expanded="false">Show all {f.rows.length}</button>}
                {(f.tells.length > 0 || f.set) && (
                  <details className={s.send} open={solo || i === 0}>
                    <summary>{showSet ? `${f.name}: what comes, and what to tell us` : `${f.name}: what to tell us when you ask`}</summary>
                    <div className={`${s.sendin} ${showSet ? s.two : s.oneCol}`}>
                      {showSet && f.set && (
                        <div>
                          <p className={s.lbl}>{f.set.supplied ? 'Supplied as' : 'In the set'}</p>
                          {f.set.supplied
                            ? <p className={s.oneLine}>{cap(f.set.inSet)}</p>
                            : <ul>{bullets(f.set.inSet).map(t => <li key={t}>{t}</li>)}</ul>}
                          {f.set.note && <p className={s.oneLine}>{f.set.note}</p>}
                        </div>
                      )}
                      <div>
                        <p className={s.lbl}>Tell us</p>
                        {f.set?.tell ? <ul>{bullets(f.set.tell).map(t => <li key={t}>{t}</li>)}</ul> : f.tells.length > 0 && <ul>{f.tells.map(t => <li key={t}>{t}</li>)}</ul>}
                      </div>
                    </div>
                  </details>
                )}
              </div>
            </div>
          );
        })}
        {families.length === 0 && <p className={s.empty}>The device list for this department is being written.</p>}
        {/* The CSSD line, word for word (MASTER_SPEC G), once under the families. */}
        {families.length > 0 && !NO_CSSD.has(d.slug) && <p className={s.introP} style={{ marginTop: 32 }}>{CSSD}</p>}

      </section>

      <AskBand title={`Need ${article(adj)} ${adj} device? Send the name or a photo.`} wa={waLink(d.name)} send />
      <a className={s.fwa} href={waLink(d.name)}>Ask on WhatsApp <span aria-hidden="true">&#8594;</span></a>
    </>
  );
}
