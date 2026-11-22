import type { Metadata } from 'next';
import Link from 'next/link';
import { site, og } from '@/content/site';
import { breadcrumb, faqPage, graph, orgRef, organization, url, webPage } from '@/content/schema';
import JsonLd from '@/components/JsonLd';
import { noPatient, sendLead, sendList } from '@/content/send';
import Breadcrumb from '@/components/Breadcrumb';
import s from '../about/info.module.css';

const path = '/contact';
const g = site.grievance;
const tel = `tel:${site.dispatch.tel}`;
const wa = (text: string) => `${site.whatsapp.url}?text=${encodeURIComponent(text)}`;
const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const metadata: Metadata = {
  title: { absolute: 'Contact Agile Healthcare: WhatsApp and emergency line' },
  description: `Ask for a device on WhatsApp ${site.whatsapp.display}. Emergency case, any hour: dispatch centre ${site.dispatch.display}. Office in LB Nagar, Hyderabad. We supply Telangana only.`,
  alternates: { canonical: path },
  openGraph: og(path, 'Contact Agile Healthcare: WhatsApp and emergency line', undefined, { url: '/images/og/og-contact.jpg', width: 1200, height: 630, alt: `Emergency case, any hour: dispatch centre ${site.dispatch.display}. WhatsApp ${site.whatsapp.display}.` }),
};


// kind: main = the black emergency pill, pill = outline pill. One action per row; a small note can sit under the need.
const desks: { need: string; note?: { href: string; label: string }; who: string; links: { href: string; label: string; kind: 'main' | 'pill' }[] }[] = [
  {
    need: 'Emergency case, or a problem with a set or device', note: { href: '#h-recall', label: 'Recall steps below' },
    who: 'Dispatch centre, any hour', links: [{ href: tel, label: `Call ${site.dispatch.display}`, kind: 'main' }],
  },
  { need: 'Planned case or quotation', who: 'WhatsApp desk', links: [{ href: wa('Planned case: '), label: `WhatsApp ${site.whatsapp.display}`, kind: 'pill' }] },
  { need: 'Purchase order or bill', who: 'Accounts desk (email)', links: [{ href: `mailto:${site.email}`, label: site.email, kind: 'pill' }] },
  {
    need: 'Complaint about our service, or about your data',
    who: `Grievance officer, ${g.name}`,
    links: [{ href: `mailto:${g.email}`, label: g.email, kind: 'pill' }, { href: `tel:${g.tel}`, label: `Call ${g.display}`, kind: 'pill' }],
  },
];

const MVPI = 'https://www.ipc.gov.in/mandates/materiovigilance-programme-of-india-mvpi.html';
const recall = [
  <>Call the <a className={s.tlRed} href={tel}>dispatch centre, {site.dispatch.display}</a>. Give the device name, the REF (catalogue) number and LOT number from the label, the case date and what went wrong.</>,
  <>Keep the device in your hospital until we tell you where to send it. Keep the pack and label of an unused device.</>,
  <>Decontaminate and bag a device taken out of a patient as your hospital policy says. Do not take it apart or re-sterilise it.</>,
];
const mvpi = <>You can also report it to the <a className={s.tlRed} rel="noopener noreferrer" href={MVPI}>Materiovigilance Programme of India (MvPI)</a>.</>;

const T = { fontFamily: 'Inter, sans-serif' };

const Pin = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, flex: 'none' }}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);

const SEND_Q = 'What should I send when I ask for a device?';
// The same six-item list as How we deliver (#book), from one source (content/send.ts).
const SEND_A = `${sendLead} ${sendList.map((x, i) => `${i + 1} ${x}`).join('. ')}.`;
const WHERE_Q = 'Where are we?';
const WHERE_A = [`Office: ${site.address.oneLine}.`, 'For a visit, call first.'];
const DESK_Q = 'Who do I contact for a case, an order, a bill or a complaint?';
const RECALL_Q = 'How do I report a device problem, or ask about a recall?';
const recallText = [
  'Call the dispatch centre. Give the device name, the REF (catalogue) number and LOT number from the label, the case date and what went wrong. Do not give the patient file number.',
  'Keep the device in your hospital until we tell you where to send it. Keep the pack and label of an unused device.',
  'Decontaminate and bag a device taken out of a patient as your hospital policy says. Do not take it apart or re-sterilise it.',
  'You can also report it to the Materiovigilance Programme of India (MvPI).',
];

export default function Contact() {
  return (
    <>
      <JsonLd data={graph(
        organization,
        webPage(path, `Contact ${site.name}`, 'ContactPage', { about: orgRef, breadcrumb: { '@id': `${url(path)}#breadcrumb` } }),
        breadcrumb(path, [{ name: 'Home', path: '/' }, { name: 'Contact', path }]),
        faqPage(path, [
          { q: WHERE_Q, a: WHERE_A.join(' ') },
          { q: DESK_Q, a: desks.map(d => `${d.need}: ${d.who}, ${d.links.map(l => l.label).join(' or ')}.`).join(' ') },
          { q: SEND_Q, a: `${SEND_A} ${noPatient}` },
          { q: RECALL_Q, a: recallText.map((t, i) => `${i + 1} ${t}`).join(' ') },
        ]),
      )} />

      <section aria-labelledby="h-contact" className={s.hero}>
        <div className={s.glow} aria-hidden="true" />
        <div className={s.grain} aria-hidden="true" />
        <div className={`wrap ${s.heroGrid}`}>
          <div className={s.heroCol}>
            <Breadcrumb crumbs={[{ name: 'Home', path: '/' }, { name: 'Contact', path }]} className={s.crumbC} />
            <h1 id="h-contact" className={s.h1c}>
              <span className={`${s.eyebrowRose} ${s.rise}`}>{`Contact ${site.name}, Hyderabad`}<span className={s.srOnly}>:</span></span>{' '}
              <span className={`${s.display} ${s.rise} ${s.d1}`}>Who to call, and when.</span>
            </h1>
            <p className={`${s.lead} ${s.rise} ${s.d2}`}>Send the device name. We bring it to your theatre. Use WhatsApp for a planned case. Call the dispatch centre for an emergency.</p>
            <div className={`${s.rise} ${s.d3} ${s.heroAct}`}>
              <a className={s.btnRose} href={wa('Ask for a device: ')}>
                Ask on WhatsApp <span className={s.nowrap}>{site.whatsapp.display} <span aria-hidden="true">&rarr;</span></span>
              </a>
            </div>
          </div>
          <section className={`${s.sos} ${s.rise} ${s.d1}`} aria-labelledby="h-em">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h2 id="h-em" className={s.sosH}>Emergency case, any hour</h2>
              <p style={{ margin: 0, fontSize: 15, color: '#B9B4AE' }}>Dispatch centre</p>
              <p className={s.sosNum}><a href={tel}>{site.dispatch.display}</a></p>
              <p style={{ margin: '4px 0 0', maxWidth: '40ch', fontSize: 15, lineHeight: 1.5, color: '#CFC9C2' }}>
                Call for a case today, a missing set or a device problem, at any hour.
              </p>
            </div>
            <a className={s.call} href={tel}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
              Call the dispatch centre
            </a>
          </section>
        </div>
      </section>

      <div className={`wrap ${s.cBody}`}>
        <section aria-labelledby="h-where" className={s.where}>
          <div className={s.stack}>
            <h2 id="h-where" className={s.h2s}>{WHERE_Q}</h2>
            <p className={s.txt} style={{ margin: 0 }}>{WHERE_A[0]}</p>
            <p className={s.maps}>
              <a href={mapsUrl(`Urmila Devi Complex Chintalakunta LB Nagar ${site.address.city} ${site.address.postalCode}`)}><Pin /><b>LB Nagar</b><span className={s.mapsSub}>Open in Maps</span></a>
              <a href={mapsUrl(`Miyapur ${site.address.city}`)}><Pin /><b>Miyapur</b><span className={s.mapsSub}>Open in Maps</span></a>
            </p>
            <p className={s.office}>{WHERE_A[1]}</p>
          </div>
          <div className={s.mapCard}>
            <svg viewBox="0 -8 480 380" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sketch map of Hyderabad: our dispatch centre in LB Nagar and our second dispatch point in Miyapur, both inside the Outer Ring Road">
              <path d="M232 34 C 300 30, 372 52, 412 100 C 450 146, 452 214, 420 262 C 388 310, 318 334, 248 332 C 176 330, 104 306, 70 254 C 38 204, 44 138, 84 92 C 120 52, 176 36, 232 34 Z" fill="rgba(242,240,237,0.025)" stroke="rgba(242,240,237,0.5)" strokeWidth="2" />
              <path d="M236 70 C 290 68, 346 86, 374 122 C 404 160, 404 212, 378 250 C 352 288, 298 304, 244 302 C 188 300, 134 284, 108 244 C 84 206, 88 156, 116 120 C 144 86, 188 72, 236 70 Z" fill="none" stroke="rgba(242,240,237,0.22)" strokeWidth="1.2" />
              <path d="M240 118 C 270 118, 296 140, 298 172 C 300 206, 276 230, 242 232 C 208 234, 182 210, 182 176 C 182 142, 208 118, 240 118 Z" fill="none" stroke="rgba(242,240,237,0.2)" strokeWidth="1" strokeDasharray="2 5" />
              <path d="M150 140 C 200 168, 250 172, 326 230" fill="none" stroke="#C9A79C" strokeWidth="1.5" strokeDasharray="4 6" />
              <circle cx="150" cy="140" r="7" fill="#F2F0ED" /><circle cx="150" cy="140" r="16" fill="none" stroke="rgba(242,240,237,0.3)" />
              <circle cx="326" cy="230" r="9" fill="#E9A28C" /><circle cx="326" cy="230" r="22" fill="none" stroke="rgba(233,162,140,0.35)" />
              <text x="150" y="94" textAnchor="middle" fill="#F2F0ED" style={T} fontSize="15" fontWeight="600">Miyapur</text>
              <text x="150" y="112" textAnchor="middle" fill="#CFC9C2" style={T} fontSize="13">second dispatch point</text>
              <text x="316" y="276" textAnchor="middle" fill="#F2F0ED" style={T} fontSize="15" fontWeight="600">LB Nagar</text>
              <text x="316" y="294" textAnchor="middle" fill="#CFC9C2" style={T} fontSize="13">dispatch centre</text>
              <text x="240" y="22" textAnchor="middle" fill="#B0AAA3" style={T} fontSize="13" letterSpacing="2">HYDERABAD</text>
              <text x="412" y="96" textAnchor="start" fill="#E8E4DF" style={T} fontSize="13" fontWeight="600" letterSpacing="1" transform="translate(-30 -20)">ORR</text>
              <text x="240" y="356" textAnchor="middle" fill="#CFC9C2" style={T} fontSize="13" letterSpacing=".5">Outer Ring Road (ORR). Sketch, not to scale.</text>
            </svg>
          </div>
        </section>

        <section aria-labelledby="h-desk" className={`${s.block} ${s.desks}`} style={{ gap: 16 }}>
          <h2 id="h-desk" className={s.h2s}>{DESK_Q}</h2>
          <table className={s.dt}>
            <thead>
              <tr><th scope="col">Need</th><th scope="col">Contact</th><th scope="col">How to reach</th></tr>
            </thead>
            <tbody>
              {desks.map(d => (
                <tr key={d.need} className={d.links[0].kind === 'main' ? s.emRow : undefined}>
                  <th scope="row">{d.need}{d.note && <a className={s.needNote} href={d.note.href}>{d.note.label} <span aria-hidden="true">&darr;</span></a>}</th>
                  <td><span className={s.hl} aria-hidden="true">Contact: </span>{d.who}</td>
                  <td>
                    <span className={s.lk}>{d.links.map(l => <a key={l.href} href={l.href} className={l.kind === 'main' ? s.lkMain : undefined}>{l.label}</a>)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: '#45403B' }}>The grievance officer replies within {g.replyDays} days. <Link className={`${s.tlRed} ${s.tap}`} href="/privacy">How we use your data</Link></p>
        </section>

        <section aria-labelledby="h-send" className={`${s.block} ${s.sendRow}`}>
          <div className={s.sendHead}>
            <h2 id="h-send" className={s.h2s}>{SEND_Q}</h2>
            <p className={s.txt} style={{ fontSize: 16, margin: 0 }}>{noPatient}</p>
          </div>
          <div className={s.sendTxt}>
            <p className={s.txt} style={{ margin: 0, fontWeight: 600 }}>{sendLead}</p>
            <ol role="list" className={s.sendList}>
              {sendList.map((x, i) => <li key={x}><span className={s.n} aria-hidden="true">{i + 1}</span><span>{x}</span></li>)}
            </ol>
            <p className={s.linkRow}><Link className={s.tlRed} href="/devices">Not sure of the name? Find it in Devices A to Z <span aria-hidden="true">&rarr;</span></Link></p>
          </div>
        </section>

        <section id="recall" aria-labelledby="h-recall" className={s.block} style={{ gap: 16 }}>
          <h2 id="h-recall" className={s.h2s} tabIndex={-1}>{RECALL_Q}</h2>
          <ol role="list" className={`${s.nums} ${s.three} ${s.recall}`}>
            {recall.map((r, i) => (
              <li key={i}><span className={s.n} aria-hidden="true">{i + 1}</span><span>{r}</span></li>
            ))}
          </ol>
          {/* One note under all three steps, so the step columns stay level. */}
          <p className={`${s.recallWarn} ${s.recallWarnAll}`}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></svg>Do not give the patient file number.</p>
          <p className={s.mvpi}>{mvpi}</p>
        </section>

      </div>
    </>
  );
}
