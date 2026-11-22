import Link from 'next/link';
import type { Metadata } from 'next';
import { site, og } from '@/content/site';
import { breadcrumb, faqPage, graph, orgRef, url, webPage } from '@/content/schema';
import JsonLd from '@/components/JsonLd';
import s from '@/components/service/service.module.css';
import { sendList, sendLead, noPatient } from '@/content/send';
import Breadcrumb from '@/components/Breadcrumb';

const path = '/how-we-deliver';
const title = 'Surgical set delivery in Hyderabad, Telangana';
const description =
  'We pack every size and instrument on the set list in LB Nagar, Hyderabad, deliver the set to your CSSD or theatre and collect it after the case. Telangana only.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: og(path, `${title} | ${site.name}`, description, { url: '/images/og/og-how-we-deliver.jpg', width: 1200, height: 630, alt: 'Surgical instrument sets, ready for a case' }),
};

// Page copy. The FAQPage JSON-LD is built from the same strings, so visible text and schema match word for word.
const packed = 'Each set has the sizes on its printed set list and the instruments to place each device. The printed set list travels with the set, so your theatre staff can check it.';
// Who sterilises what: two rows, then one line. The FAQ answer is built from the same strings.
// The CSSD line, word for word (MASTER_SPEC G).
const sterilise = 'Implants in sealed sterile packs are used as packed. They are never re-sterilised. Your CSSD sterilises the reusable instruments and any implants supplied non-sterile, before the case. Check each label.';
const delivered = [
  'Sets leave from our dispatch centre in LB Nagar, Hyderabad, or our second dispatch point in Miyapur. Our rider brings the set to your CSSD or operating theatre, as your hospital asks. We do not leave it at the hospital gate.',
];
const lab = 'Lab supplies, such as reagents, blood collection tubes and urine containers, go to the lab by rider. They are not collected back.';
const night = 'Yes, if we have the set. Call the dispatch centre. Your CSSD still needs time to sterilise the non-sterile items before the case.';
const collected = 'Our rider collects the set after the case, once your hospital has decontaminated the used instruments. We bill only what was used.';
const beforeRider = [
  'Let your hospital decontaminate the used instruments.',
  'Keep every unused implant pack sealed and put it back in the set.',
  'Put the lot sticker of each implant used in the patient file.',
];
// Route of a set (02). The six-item booking list lives on this page only (#book); Contact links to it.
const route = [
  { b: 'LB Nagar, Hyderabad', s: 'Dispatch centre' },
  { b: 'Miyapur', s: 'Second dispatch point' },
  { b: 'Your CSSD or operating theatre', s: 'By our rider' },
];

const faq = [
  { q: 'How is the set packed?', a: packed },
  { q: 'Who sterilises the set?', a: sterilise },
  { q: 'Where do you deliver the set?', a: `${delivered.join(' ')} ${lab}` },
  { q: 'Do you deliver for emergency cases at night?', a: night },
  { q: 'How do you collect the set?', a: `${collected} Before our rider comes, please: ${beforeRider.join(' ')}` },
  { q: 'How do I book a set?', a: `${sendLead} ${sendList.map((x, i) => `${i + 1} ${x}`).join('. ')}. ${noPatient}` },
];

const bookLink = `${site.whatsapp.url}?text=${encodeURIComponent('Book a set: ')}`;

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

export default function HowWeDeliver() {
  return (
    <>
      <JsonLd
        data={graph(
          webPage(path, 'Surgical set delivery', 'WebPage', { breadcrumb: { '@id': `${url(path)}#breadcrumb` }, mainEntity: { '@id': `${url(path)}#service` } }),
          breadcrumb(path, [{ name: 'Home', path: '/' }, { name: 'How we deliver', path }]),
          {
            '@type': 'Service',
            '@id': `${url(path)}#service`,
            name: 'Surgical set delivery to the operating theatre',
            serviceType: 'Surgical set delivery to the operating theatre',
            category: 'Medical device distribution',
            url: url(path),
            provider: orgRef,
            areaServed: { '@type': 'State', name: 'Telangana' },
            audience: { '@type': 'Audience', audienceType: 'Hospitals and labs' },
            description,
          },
          faqPage(path, faq.filter(f => f.a)),
        )}
      />

      {/* 1 Opener */}
      <div className={`dk ${s.stage}`}>
        <section aria-labelledby="h-top" className={`${s.inner} ${s.hero}`}>
          <div className={s.heroTxt}>
            <Breadcrumb crumbs={[{ name: 'Home', path: '/' }, { name: 'How we deliver', path }]} className={s.crumb} />
            <h1 id="h-top" className={s.h1}>
              <span className={s.eyb}>Surgical sets, Hyderabad and Telangana<span className={s.sr}>:</span></span>{' '}
              <span className={s.disp}>
                <span className={s.r1}>Packed.</span>{' '}
                <span className={`${s.r2} ${s.rose}`}>Delivered.</span>{' '}
                <span className={s.r3}>Collected.</span>
              </span>
            </h1>
            <p className={`${s.sub} ${s.r4}`}>We pack every size and instrument on the set list, bring it to your CSSD or operating theatre, and collect it after the case.</p>
            <div className={`${s.cta} ${s.r4}`}>
              <a href={bookLink} className={s.btnRose}>Ask on WhatsApp {site.whatsapp.display} <span aria-hidden="true">&rarr;</span></a>
              <a href={`tel:${site.dispatch.tel}`} className={`${s.telPill} ${s.glass}`}>
                <span className={s.telIcon} aria-hidden="true"><PhoneIcon /></span>
                <span className={s.telLb}>Emergency case, any hour: dispatch centre</span>
                <b className={s.telNum}>{site.dispatch.display}</b>
              </a>
            </div>
          </div>
          <figure className={`${s.photo} ${s.r3}`}>
            <img src="/images/orthopaedic-instrument-trays.jpg" width={1600} height={1067} alt="Surgical instrument sets, ready for a case" />
            <figcaption className={s.photoCap}>A packed set: every size on the printed set list.</figcaption>
          </figure>
        </section>
      </div>

      <ol role="list" aria-label="How we deliver, in 3 steps" className={s.steps}>
        {/* 01 Packed */}
        <li>
          <section aria-labelledby="h-packed" className={s.light}>
            <div className={`${s.inner} ${s.two}`}>
              <div>
                <p className={s.ey}>01 · Packed</p>
                <h2 id="h-packed" className={s.h2s}>{faq[0].q}</h2>
                <p className={s.lead}>{packed}</p>
                <p style={{ margin: 0 }}><Link href="/devices/distal-radius-locking-plate" className={s.txt}><span>Example: what comes in a distal radius locking plate <span className="nb">set <span aria-hidden="true">&rarr;</span></span></span></Link></p>
              </div>
              <div className={s.side}>
                <h3 className={s.h3s}>{faq[1].q}</h3>
                <p className={s.whoCap}>{sterilise}</p>
              </div>
            </div>
          </section>
        </li>

        {/* 02 Delivered */}
        <li>
          <section aria-labelledby="h-delivered" className={`dk ${s.stage}`}>
            <div className={s.glow} aria-hidden="true" />
            <div className={`${s.inner} ${s.deliv}`}>
              <div>
                <p className={s.ey}>02 · Delivered</p>
                <h2 id="h-delivered" className={s.h2s}>{faq[2].q}</h2>
                <p className={s.lead}>{delivered[0]}</p>
                <div className={s.night}>
                  <h3 className={s.h3s}>{faq[3].q}</h3>
                  <p className={s.body}>{night}</p>
                  <a href={`tel:${site.dispatch.tel}`} className={s.callD}><PhoneIcon /> Call {site.dispatch.display}</a>
                </div>
              </div>
              <div className={`${s.card} ${s.glass}`}>
                <ol className={s.route} aria-label="Route of a set">
                  {route.map(r => <li key={r.b}><b>{r.b}</b><span>{r.s}</span></li>)}
                </ol>
                {/* Lab buyers: their line sits in the card, under its own subhead. */}
                <div className={s.labBox}>
                  <h3 className={s.labH}>Lab supplies</h3>
                  <p className={s.labP}>{lab}</p>
                </div>
              </div>
            </div>
          </section>
        </li>

        {/* 03 Collected */}
        <li>
          <section aria-labelledby="h-collected" className={s.light}>
            <div className={`${s.inner} ${s.two} ${s.noBottom}`}>
              <div>
                <p className={s.ey}>03 · Collected</p>
                <h2 id="h-collected" className={`${s.h2s} ${s.natural}`}>{faq[4].q}</h2>
                <p className={s.lead} style={{ marginBottom: 8 }}>{collected}</p>
                <p style={{ margin: 0 }}><Link href="/contact#recall" className={s.txt}><span>Wrong side, missing size or broken seal? See who to <span className="nb">call&nbsp;<span aria-hidden="true">&rarr;</span></span></span></Link></p>
              </div>
              <div className={s.side}>
                <p className={s.before}>Before our rider comes, please:</p>
                <ul role="list" className={s.rows}>
                  {beforeRider.map((t, i) => (
                    <li key={t}><span className={s.sn} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </li>
      </ol>

      {/* How to book + ask: the page's one maroon band. The ask line appears once on this page, here (MASTER SPEC F). */}
      <section id="ask" aria-labelledby="h-book" className={s.bookSec}>
        <div className={`dk ${s.band}`}>
          <div className={s.grain} aria-hidden="true" />
          <div className={s.book} id="book">
            <div className={s.bookL}>
              <h2 id="h-book" className={s.bookH}>{faq[5].q}</h2>
              <p className={s.bookLead}>{sendLead}</p>
              <a href={bookLink} className={s.btnW}>Ask on WhatsApp <span className={s.nowrap}>{site.whatsapp.display} <span aria-hidden="true">&rarr;</span></span></a>
            </div>
            <div className={s.bookCard}>
              <ol role="list" className={s.bkList}>
                {sendList.map((t, i) => <li key={t} className={i === sendList.length - 1 ? s.bkCond : undefined}><span className={s.bkN} aria-hidden="true">{i + 1}</span>{t}</li>)}
              </ol>
              <a href={bookLink} className={`${s.btnW} ${s.btnAgain}`}>Ask on WhatsApp <span className={s.nowrap}>{site.whatsapp.display} <span aria-hidden="true">&rarr;</span></span></a>
              <p className={s.note}>{noPatient}</p>
              <p className={s.note}>Not sure of the name? <Link href="/devices" className={s.tl}>Find the device name in our A to Z</Link></p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
