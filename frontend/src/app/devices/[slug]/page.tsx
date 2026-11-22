import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { site, waLink, og } from '@/content/site';
import { getDepartment } from '@/content/departments';
import { devicePages, getDevice, deviceHref, slugify, lowerName, article, type Device, type FaqItem } from '@/content/devices';
import { breadcrumb, faqPage, graph, medicalDevice, orgRef, url, webPage } from '@/content/schema';
import JsonLd from '@/components/JsonLd';
import FaqList from '@/components/FaqList';
import Breadcrumb from '@/components/Breadcrumb';
import DarkStage from '@/components/DarkStage';
import { AskBand } from '@/components/SiteChrome';
import SetFolds from '@/components/device/SetFolds';
import { callouts, drawings, tilt } from '@/components/device/art';
import s from '@/components/device/device.module.css';

export const dynamicParams = false;
export const generateStaticParams = () => devicePages.map(d => ({ slug: d.slug }));

/** Second picture for "What is ...?" when the hero already uses the device photo. Brand-free files in /public/images. */
const FIG: Record<string, { src: string; alt: string; width: number; height: number; dark?: boolean; zoom?: boolean; contain?: boolean; caption?: string; style?: CSSProperties }> = {
  // The hero shows the whole implant cut-out, so the figure shows the femoral component close up.
  'total-knee-implant': { src: '/images/total-knee-femoral-component.jpg', alt: 'Femoral component of a total knee implant, close up', width: 706, height: 706, dark: true,
    caption: 'The femoral component, close up. It covers the end of the thigh bone and moves on the plastic insert.' },
  // The hero shows the whole sheet, so the figure shows the knit close up.
  // A light card (the hero is dark); the light photo is clean at this size, the dark one shows noise.
  'hernia-mesh': { src: '/images/hernia-mesh-light.jpg', alt: 'Hernia mesh knit, close up', width: 673, height: 357,
    caption: 'The knit, close up. The surgeon may cut the sheet to size, or use a pre-shaped mesh.' },
};
/** Hero photo, where it should differ from the device's own picture. */
const HERO: Record<string, NonNullable<Device['image']>> = {
  // Cut-out made from hernia-mesh-light.jpg: the knit as light strands on a transparent ground.
  'hernia-mesh': { src: '/images/hernia-mesh-cut.png', alt: 'A sheet of knitted hernia mesh', width: 673, height: 357 },
};
/** Hero cut-outs shown mirrored, so the page does not repeat the home opening slide. */
const MIRROR = new Set(['total-knee-implant']);
/** "When the set arrives": the closing line, where a device needs its own (a knee: design and size matter more than side). */
const ARRIVE_TELL: Record<string, string> = {
  'total-knee-implant': 'Tell us the same day if the design (CR or PS) or the size is wrong.',
};
const CSSD = 'Implants in sealed sterile packs are used as packed. They are never re-sterilised. Your CSSD sterilises the reusable instruments and any implants supplied non-sterile, before the case. Check each label.';
/** Families where an implant fits one side only, so the closing line asks about the side. */
const SIDED = new Set(['Trauma plates', 'Trauma nails', 'Joint replacement']);
/** Uncountable names: "What is bone cement?", not "What is a bone cement?". */
const MASS = new Set(['bone-cement', 'bone-wax', 'hand-rub', 'skin-adhesive', 'surgical-hand-scrub', 'skin-preparation-solution', 'instrument-disinfectant', 'surface-disinfectant', 'nasal-packing']);
/** One fold order on every device page. */
const GROUP_ORDER = [/implant|device|mesh|stent|suture/i, /instrument/i, /paper/i, /if asked|optional|on request/i];
const groupRank = (title: string) => { const k = GROUP_ORDER.findIndex(re => re.test(title)); return k < 0 ? 1.5 : k; };
/** Cut-outs that keep their own colour on the hero (the knee has a plastic insert). The rest are shown neutral grey. */
const WARM = new Set(['total-knee-implant']);

type Props = { params: Promise<{ slug: string }> };

/** Search results cut titles at about 60 characters (with " | Agile Healthcare"): drop the alias, then the city, to fit. */
const titleFor = (name: string, aka: string[]) => {
  const fits = (t: string) => t.length + ` | ${site.name}`.length <= 60;
  const full = `${name}${aka.length ? ` (${aka[aka.length - 1]})` : ''} in Hyderabad`;
  return fits(full) ? full : fits(`${name} in Hyderabad`) ? `${name} in Hyderabad` : name;
};
const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const sentences = (t: string) => t.split(/(?<=[.?!])\s+/).filter(Boolean);
/** Flattened 1200x630 share picture for a cut-out device (a transparent PNG previews badly). */
const ogFile = (slug: string) => `/images/og/og-${slug}.jpg`;
const hasOg = (slug: string) => existsSync(join(process.cwd(), 'public', ogFile(slug)));

/** The four standard questions become page sections; the rest go under "More questions". */
function sortFaq(faq: FaqItem[]) {
  const take = (re: RegExp) => faq.find(f => re.test(f.q));
  const what = take(/^What (is|are) /i);
  const when = take(/^When (is|are) /i);
  const set = take(/^What comes in /i);
  const size = take(/^How (is|are) .*(size|length|chosen)/i);
  const used = [what, when, set, size];
  return { what, when, set, size, rest: faq.filter(f => !used.includes(f)) };
}

/** A set line that names a related device page ("Locking screws, ...") is a whole-row link with an arrow at the end. */
function setItem(item: string, related: Device[]): ReactNode {
  const r = related.find(x => item.toLowerCase().startsWith(x.name.toLowerCase()));
  if (!r) return item;
  return <Link className={s.il} href={deviceHref(r)}><span>{item}</span><span className={s.ia} aria-hidden="true">&#8594;</span></Link>;
}

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="7" stroke="#8A0000" strokeWidth="1.5" />
    <path d="M5 8.2l2 2 4-4.4" stroke="#8A0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Chev = () => (
  <svg className={s.chev} aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = getDevice((await params).slug);
  if (!d) return {};
  // Aim for 140-158 characters: a set gets the delivery line, a single pack the short supply line.
  const isSetMeta = d.inSet.some(g => /instrument/i.test(g.title));
  const longTail = ' We bring the full set, with the instruments to place it, to hospitals in Telangana.';
  const singleTail = ' We bring the planned sizes in sealed packs to hospitals in Telangana.';
  const description = d.short.length >= 120 ? d.short
    : isSetMeta && (d.short + longTail).length <= 158 ? d.short + longTail
    : !isSetMeta && (d.short + singleTail).length <= 158 ? d.short + singleTail
    : `${d.short} Supplied to hospitals in Telangana.`;
  const img = hasOg(d.slug) ? { url: ogFile(d.slug), alt: d.image?.alt ?? d.name, width: 1200, height: 630 } : d.image ? { url: d.image.src, alt: d.image.alt, width: d.image.width, height: d.image.height } : undefined;
  return {
    title: titleFor(d.name, d.alsoCalled),
    description,
    alternates: { canonical: `/devices/${d.slug}` },
    openGraph: og(`/devices/${d.slug}`, `${titleFor(d.name, d.alsoCalled)} | ${site.name}`, description, img),
  };
}

export default async function DevicePage({ params }: Props) {
  const d = getDevice((await params).slug);
  if (!d || !d.faq.length) notFound();
  const dep = getDepartment(d.department)!;
  const path = `/devices/${d.slug}`;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: dep.name, path: `/departments/${dep.slug}` },
    { name: d.family, path: `/departments/${dep.slug}#${slugify(d.family)}` },
    { name: d.name, path },
  ];

  const q = sortFaq(d.faq);
  // "a K-wire", "an ENT laser", "bone cement", "embolisation particles".
  const nm = lowerName(d.name);
  const plural = /[^s]s$/.test(d.name);
  const np = MASS.has(d.slug) || plural ? nm : `${article(d.name)} ${nm}`;
  const isAre = plural ? 'are' : 'is';
  // Machines have parts, not sizes; lab supplies, machines and disinfectants are not sterilised and not used "in a case".
  const machine = d.inSet.some(g => /^(Machine|Equipment|Pump)/.test(g.title));
  const noSterile = d.inSet.some(g => g.title === 'Machine') || d.department === 'laboratory-diagnostics' || /disinfectant|hand-rub|hand-scrub/.test(d.slug);
  const noCase = noSterile || d.department === 'sleep-respiratory';
  const noSize = machine || noCase || MASS.has(d.slug) || plural;
  const related = d.related.map(getDevice).filter(Boolean) as Device[];
  const wa = waLink(d.name);
  const sos = site.emergencyLine.replace(site.dispatch.display, '').trim();
  // Hero line without "A <name> is", as in the design: "A thin metal plate ...".
  const lede = d.short.replace(new RegExp(`^an? ${esc(d.name)} is `, 'i'), '').replace(/^./, c => c.toUpperCase());
  // "What is" answer, minus the sentences the hero already says.
  // If what is left starts with "It ..." or "They ...", keep the whole answer so the pronoun has its noun.
  const whatLeft = q.what ? sentences(q.what.a).filter(t => !d.short.includes(t)).join(' ') : '';
  const whatText = q.what && /^(It|They|This|These|Its)\b/.test(whatLeft) ? q.what.a : whatLeft;
  const whenText = q.when ? q.when.a : [...d.whyUsed, ...d.howUsed].join(' ');
  const img = HERO[d.slug] ?? d.image;
  const cutOut = !!img && /\.(png|webp)$/i.test(img.src);
  const [tiltLg, tiltSm] = tilt[d.slug] ?? [0, 0];
  const drawing = drawings[d.slug];
  const fig = FIG[d.slug];
  const figure = drawing ? (
    <figure className={s.figure}>
      <drawing.art />
      <figcaption>{drawing.caption}</figcaption>
    </figure>
  ) : fig ? (
    <figure className={`${s.figPhoto} ${fig.dark ? s.figDark : ''} ${fig.zoom ? s.figZoom : ''} ${fig.contain ? s.figContain : ''}`}>
      <span className={s.figImg}><img src={fig.src} alt={fig.alt} width={fig.width} height={fig.height} loading="lazy" decoding="async" style={fig.style} /></span>
      {fig.caption && <figcaption>{fig.caption}</figcaption>}
    </figure>
  ) : null;
  // Instruments in the list make it a set; single packs (mesh, sutures) are "sent with".
  const isSet = d.inSet.some(g => /instrument/i.test(g.title));
  const setTitle = q.set ? q.set.q : isSet ? `What comes in ${article(d.name)} ${nm} set?` : 'What comes with each order?';
  const sizeRows = d.sizes;
  // Ask card: label and the short option list (first clause of each size row), as in the design.
  // Two set columns: the first group, then the rest. Groups move from the end of the second column into the first
  // while that evens out the heights (a heading counts as two lines, a long line as more than one).
  const weight = (gs: Device['inSet']) => gs.reduce((n, g) => n + 2 + g.items.reduce((m, i) => m + 1 + i.length / 60, 0), 0);
  const inSet = [...d.inSet].sort((a, b) => groupRank(a.title) - groupRank(b.title));
  // Split at the point that best evens the two columns, keeping the one fold order (column 1 reads first).
  let cut = 1;
  for (let k = 1; k < inSet.length; k++)
    if (Math.abs(weight(inSet.slice(0, k)) - weight(inSet.slice(k))) < Math.abs(weight(inSet.slice(0, cut)) - weight(inSet.slice(cut)))) cut = k;
  const setCols = [inSet.slice(0, cut), inSet.slice(cut)];
  // A short set (4 rows or fewer per column) gets a shorter dark band.
  const shortSet = Math.max(...setCols.map(c => c.reduce((n, g) => n + g.items.length, 0))) <= 4;
  // Size lead: the sentence on how the surgeon plans the size; the table carries the rest.
  const sizeLead = q.size ? (sentences(q.size.a).find(t => /plan|chooses|choose/i.test(t)) ?? sentences(q.size.a)[0]) : '';

  return (
    <>
      <JsonLd
        data={graph(
          medicalDevice(d),
          webPage(path, `${titleFor(d.name, d.alsoCalled)} | ${site.name}`, 'MedicalWebPage', {
            about: { '@id': `${url(path)}#device` },
            reviewedBy: orgRef,
            ...(d.checkedOn ? { lastReviewed: d.checkedOn } : {}),
            breadcrumb: { '@id': `${url(path)}#breadcrumb` },
          }),
          breadcrumb(path, crumbs),
          ...(q.rest.length ? [faqPage(path, q.rest)] : []),
        )}
      />

      <section aria-labelledby="dev-h1" className={s.hero}>
        <div className={`${s.heroCopy} ${img ? '' : s.noArt}`}>
          <div className={s.hc}>
            <Breadcrumb crumbs={crumbs} className={`${s.crumb} ${s.rise}`} sep={s.sep} />
            <h1 id="dev-h1" className={`${s.h1} ${s.rise} ${s.d1}`}>{d.name}</h1>
            <p className={`${s.lede} ${s.rise} ${s.d2}`}>{lede}</p>
            {d.alsoCalled.length > 0 && <p className={`${s.aka} ${s.rise} ${s.d3}`}>Also called {d.alsoCalled.join(', ')}.</p>}
            <div className={`${s.acts} ${s.rise} ${s.d4} ${s.noprint}`}>
              <a className={s.hcta} href={wa}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z" /></svg>
                Ask for this device
              </a>
              <a className={s.chip} href={`tel:${site.dispatch.tel}`}>
                <span className={s.ic} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
                </span>
                <span className={s.lb}>{sos}</span>
                <b>{site.dispatch.display}</b>
              </a>
            </div>
          </div>
          {img && (
            <div className={`${s.hv} ${s.noprint}`}>
              {cutOut ? (
                <DarkStage className={s.stage} floor>
                  <div className={`${s.dev} ${WARM.has(d.slug) ? s.warm : ''} ${MIRROR.has(d.slug) ? s.mirror : ''} ${d.slug === 'hernia-mesh' ? s.sheetCut : ''}`} style={{ '--tilt': `${tiltLg}deg`, '--tilt-sm': `${tiltSm}deg` } as CSSProperties}>
                    <img src={img.src} alt={img.alt} width={img.width} height={img.height} fetchPriority="high" decoding="async" />
                    {callouts[d.slug] && (
                      <div className={s.co} aria-hidden="true">
                        {callouts[d.slug].map(c => (
                          <div className={s.pin} key={c.text} style={{ left: `${c.x}%`, top: `${c.y}%` }}>
                            <span className={s.dot} />
                            <div className={`${s.arm} ${c.side === 'r' ? s.armR : c.side === 'l' ? s.armL : s.armB}`}><span>{c.text}</span></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DarkStage>
              ) : (
                <div className={s.stage}>
                  <div className={s.photo}>
                    <img src={img.src} alt={img.alt} width={img.width} height={img.height} fetchPriority="high" decoding="async" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="what" className={s.sheet}>
        <div className={`${s.split} ${s.center} ${figure ? '' : s.solo}`}>
          <div className={s.cell}>
            <h2 id="what" className={s.h2}>{q.what ? q.what.q : `What ${isAre} ${np}?`}</h2>
            {whatText && <p className={s.body}>{whatText}</p>}
            {whenText && (
              <>
                <h3 id="when" className={s.h3}>{q.when ? q.when.q : `When ${isAre} ${np} used?`}</h3>
                <p className={s.body}>{whenText}</p>
              </>
            )}
          </div>
          {figure}
        </div>
      </section>

      {d.inSet.length > 0 && (
        <section aria-labelledby="set" className={`${s.band} ${shortSet ? s.bandShort : ''}`}>
          <div className={s.bandIn}>
            <h2 id="set" className={s.h2}>{setTitle}</h2>
            <div className={s.setGrid} data-set>
              {setCols.filter(c => c.length).map((col, ci) => (
                <div className={s.cell} key={ci}>
                  {col.map((g, gi) => (
                    <details className={s.more} open data-first={ci === 0 && gi === 0 ? '' : undefined} key={g.title}>
                      <summary><h3 className={s.grp}>{g.title}</h3><Chev /></summary>
                      <ul role="list" className={s.items}>
                        {g.items.map(i => <li key={i}>{setItem(i, related)}</li>)}
                      </ul>
                    </details>
                  ))}
                </div>
              ))}
            </div>
            {sizeRows.length > 0 && <p className={s.toSize}><a href="#size">{q.size || !noSize ? 'How the size is chosen' : 'What to tell us'} <span aria-hidden="true">&#8595;</span></a></p>}
            <SetFolds />
          </div>
        </section>
      )}

      <div className={s.sheetTight}>
        <div className={s.split}>
          <div className={s.cell}>
            {sizeRows.length > 0 && (
              <section aria-labelledby="size" className={s.sizeSec}>
                <h2 id="size" className={s.h2}>{q.size ? q.size.q : noSize ? 'What to tell us when you ask' : `How is the size of ${np} chosen?`}</h2>
                {sizeLead && <p className={s.body}>{sizeLead}</p>}
                <ul role="list" className={s.sz}>
                  {sizeRows.map(z => <li key={z.label}><b>{z.label}</b><span>{z.value}</span></li>)}
                </ul>
              </section>
            )}
            <section aria-labelledby="cssd" className={s.arrive}>
              <h2 id="cssd" className={s.h2}>{isSet ? 'When the set arrives' : 'When the order arrives'}{d.checks.length > 0 ? ', check that:' : ''}</h2>
              {d.checks.length > 0 && (
                <>
                  <ul role="list" className={s.chk}>
                    {d.checks.map(c => <li key={c}><Check /><span>{c}</span></li>)}
                  </ul>
                </>
              )}
              {/* The CSSD line, word for word (MASTER_SPEC G), once per set page. */}
              {isSet && !noSterile && <p className={s.body} style={{ marginTop: 20 }}>{CSSD}</p>}
              <p className={s.body} style={{ marginTop: 20, fontWeight: 500 }}>
                {machine ? 'Tell us the same day if a part is missing or damaged.'
                  : isSet ? ARRIVE_TELL[d.slug] ?? (SIDED.has(d.family) ? 'Tell us the same day if the side or size is wrong.' : 'Tell us the same day if a size or an item is wrong.')
                  : 'Tell us the same day if a pack is wrong. Keep it sealed.'}{' '}
                <Link href="/contact#recall">Who to call <span aria-hidden="true">&#8594;</span></Link>
              </p>
            </section>
            {q.rest.length > 0 && (
              <section aria-labelledby="faq" className={s.faqIn}>
                <h2 id="faq" className={s.h2}>More questions</h2>
                <FaqList items={q.rest} />
              </section>
            )}
            {/* One plain link row (it was a lone card beside the questions), with the checked note under it. */}
            <div className={s.afterRow}>
              {!noSterile && (
                <ul role="list" className={s.go}>
                  <li><Link href="/how-we-deliver#h-packed">Who sterilises what <span aria-hidden="true">&#8594;</span></Link></li>
                </ul>
              )}
            </div>
          </div>
          <div className={s.rail}>
            {sizeRows.length > 0 && (
              <aside className={`${s.side} ${s.noprint}`} aria-labelledby="side-h">
                <h2 id="side-h" className={s.sideH}>Ask for this device</h2>
                <p className={s.sideP}>Send these {sizeRows.length} details on WhatsApp. <Link href="/contact#h-send">What else to send <span aria-hidden="true">&#8594;</span></Link></p>
                <a className={s.cta} href={wa}>Ask on WhatsApp {site.whatsapp.display}</a>
                <p className={s.sos}>{sos.replace(/ dispatch centre$/, '')} <a href={`tel:${site.dispatch.tel}`}>{site.dispatch.display}</a></p>
              </aside>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="rel" className={s.sheetEnd}>
          <div className={s.wide}>
            <h2 id="rel" className={s.h2}>Related devices</h2>
            <ul role="list" className={s.rel} style={{ '--n': related.length } as CSSProperties}>
              {related.map(r => (
                <li key={r.slug}>
                  <Link href={deviceHref(r)}>
                    {/* No thumbnails: one look for every card. Every card shows the device's master line; a device with no page links to its family. */}
                    <span className={s.rtx}><b>{r.name}</b><span>{sentences(r.short)[0]}</span></span>
                    <span className={s.rar} aria-hidden="true">&#8594;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <AskBand title={noCase || machine ? `Need ${np}?` : `Need ${np} for a case?`} wa={wa} />
    </>
  );
}
