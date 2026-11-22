import Link from 'next/link';
import type { Metadata } from 'next';
import { site, og } from '@/content/site';
import { departments, getDepartment } from '@/content/departments';
import { getDevice, deviceHref } from '@/content/devices';
import { graph, organization, website, webPage, faqPage } from '@/content/schema';
import JsonLd from '@/components/JsonLd';
import { AskBand } from '@/components/SiteChrome';
import Opening, { type Slide } from '@/components/Opening';
import Departments, { type DepPhoto } from '@/components/home/Departments';
import s from '@/components/home/home.module.css';

const TITLE = 'Medical device distributor, Hyderabad | Agile Healthcare';
const DESCRIPTION =
  'Medical device distributor in Hyderabad. We deliver full sets to the operating theatre and collect them after the case. Telangana only. Ask on WhatsApp.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: og('/', TITLE, DESCRIPTION),
};

/** Device for a slug; fails the build if the content team renames it. */
const device = (slug: string) => {
  const d = getDevice(slug);
  if (!d) throw new Error(`Home page: device "${slug}" is missing from src/content`);
  return d;
};

/** "Orthopaedics: joint replacement", "Cardiology". */
const where = (slug: string) => {
  const d = device(slug);
  const dep = getDepartment(d.department)?.name ?? '';
  return d.department === 'orthopaedics' ? `${dep}: ${d.family.charAt(0).toLowerCase()}${d.family.slice(1)}` : dep;
};

const OPENING: [slug: string, img: string, alt: string, kind: Slide['kind']][] = [
  ['total-knee-implant', '/images/total-knee-implant.png', 'Femoral component of a total knee implant', 'knee'],
  ['hernia-mesh', '/images/hernia-mesh-dark.jpg', 'Hernia mesh (surgical mesh), lit on a black background', 'photo'],
  ['coronary-stent', '/images/coronary-stent.webp', 'Two coronary stents', 'cut'],
  ['proximal-femoral-nail', '/images/proximal-femoral-nail.webp', 'Proximal femoral nail with two neck screws and a distal locking screw', 'tall'],
];
const slides: Slide[] = OPENING.map(([slug, img, alt, kind]) => {
  const d = device(slug);
  return { name: d.name, to: where(slug), href: deviceHref(d), img, alt, kind };
});

const tile = 'radial-gradient(60% 60% at 50% 50%, rgba(242,240,237,0.10) 0%, rgba(242,240,237,0) 72%)';
const scene = (img: string, alt: string, pos = '50% 50%'): DepPhoto =>
  ({ img, alt, style: { backgroundColor: '#161211', backgroundSize: 'cover', backgroundPosition: pos } });
// Every department panel has a picture; none falls back to the orthopaedic plate.
const photos: Record<string, DepPhoto> = {
  orthopaedics: { img: '/images/distal-radius-locking-plate.png', alt: 'Distal radius locking plate',
    under: tile, style: { backgroundColor: '#161211', backgroundSize: '92% auto, 100% 100%', filter: 'saturate(.12) brightness(1.08) contrast(1.06)' } },
  spine: scene('/images/orthopaedic-instrument-trays.jpg', 'Instrument trays of a surgical set'),
  cardiology: { img: '/images/coronary-stent.webp', alt: 'Two coronary stents',
    style: { backgroundColor: '#EAE7E2', backgroundSize: 'auto 82%' } },
  'cardiac-surgery': scene('/images/coronary-stents-light.jpg', 'Two coronary stents, close up'),
  neurosurgery: scene('/images/instrument-tray-blue-drape.jpg', 'Surgical instruments on a sterile blue drape'),
  vascular: { img: '/images/coronary-stent.webp', alt: 'Two stents', style: { backgroundColor: '#161211', backgroundSize: 'auto 82%' } },
  'endo-surgery': scene('/images/trocar-set.jpg', 'Trocars for keyhole surgery'),
  'plastic-surgery': scene('/images/suture-needle-holder.jpg', 'A suture held in a needle holder'),
  gynaecology: scene('/images/ligating-clip-cartridges.jpg', 'Ligating clip cartridges'),
  urology: scene('/images/instrument-tray-blue-drape.jpg', 'Surgical instruments on a sterile blue drape', '25% 50%'),
  ent: scene('/images/orthopaedic-instrument-trays.jpg', 'Instrument trays of a surgical set', '75% 50%'),
  'critical-care': scene('/images/operating-theatre.jpg', 'An operating theatre', '50% 40%'),
  'ot-infection-control': scene('/images/instrument-tray-blue-drape.jpg', 'Surgical instruments on a sterile blue drape', '75% 50%'),
  'wound-care': scene('/images/hernia-mesh-dark.jpg', 'Surgical mesh lit on a black background'),
  'sleep-respiratory': scene('/images/stethoscope.jpg', 'A stethoscope'),
  'laboratory-diagnostics': scene('/images/lab-centrifuge-tubes.jpg', 'Centrifuge and blood collection tubes', '100% 50%'),
};

// Devices with their own page, not the knee or the plate (the opening and the first department panel show those).
// Light photos multiply into the tile, so a white backdrop disappears.
// cover: a photo cropped to fill the tile (the device is small in the frame); the cut-outs fit a box with 8% air.
const POPULAR: [slug: string, img: string, w: number, h: number, cover: boolean, style?: React.CSSProperties][] = [
  ['suture-with-needle', '/images/suture-needle-holder.jpg', 867, 707, false, { mixBlendMode: 'multiply', filter: 'saturate(.4) contrast(1.05)', scale: '1.1' }],
  ['hernia-mesh', '/images/hernia-mesh-light.jpg', 673, 357, false, { mixBlendMode: 'multiply', filter: 'grayscale(1) contrast(1.1)', scale: '.8' }],
  ['coronary-stent', '/images/coronary-stent.webp', 1177, 1717, false, { rotate: '-28deg', mixBlendMode: 'multiply' }],
  ['proximal-femoral-nail', '/images/proximal-femoral-nail.webp', 784, 3179, false, { transform: 'rotate(-38deg) scale(1.5)', filter: 'saturate(.35) contrast(1.1)', mixBlendMode: 'multiply' }],
];
/** First sentence of the master line, without "A <name> is": "A small mesh tube that ...". */
const useLine = (name: string, short: string) => {
  const first = short.split(/(?<=\.)\s/)[0];
  const rest = first.replace(new RegExp(`^an? ${name} is `, 'i'), '');
  return rest === first ? first : rest.charAt(0).toUpperCase() + rest.slice(1);
};

// Master wording for the three delivery lines; How we deliver copies them.
const STEPS = [
  'We pack the full set: the sizes on its printed set list and the instruments to place each device.',
  'Our rider brings the set to your CSSD or operating theatre, as your hospital asks.',
  'Our rider collects the set after the case, once your hospital has decontaminated the used instruments.',
];
const PAY = 'You pay only for what was used.';
const DEP_Q = 'Which hospital departments do you supply?';
// Visible answer line and FAQPage answer: one string, word for word (the tiles name the departments).
const DEP_A = `Pick one of the ${departments.length} departments to see the devices we supply for it.`;
const DEL_Q = 'How do you deliver a set?';

export default function Home() {
  return (
    <>
      <JsonLd data={graph(organization, website, webPage('/', TITLE, 'WebPage', { description: DESCRIPTION }),
        faqPage('/', [{ q: DEL_Q, a: `${STEPS.join(' ')} ${PAY}` }, { q: DEP_Q, a: DEP_A }]))} />

      <Opening slides={slides} />

      <div className={s.sheet}>
        <section id="departments" className={s.deps} aria-labelledby="dep-h">
          <div className="wrap">
            <div className={s.depHead}>
              <h2 id="dep-h" className={s.h2}>{DEP_Q}</h2>
              <div>
                <p className={s.answer}>{DEP_A}</p>
                <p className={s.azLink}>
                  <Link className={s.link} href="/devices">Find a device by name: Devices A to Z <span aria-hidden="true">&rarr;</span></Link>
                </p>
              </div>
            </div>
            <Departments departments={departments} photos={photos} />
          </div>
        </section>

        <section className={s.popsSec} aria-labelledby="pop-h">
          <div className="wrap">
            <h2 id="pop-h" className={s.h2s}>Devices hospitals ask for often</h2>
            <div className={s.pops}>
              {POPULAR.map(([slug, img, w, h, cover, style]) => {
                const d = device(slug);
                return (
                  <Link key={slug} className={s.pop} href={deviceHref(d)}>
                    <span className={`${s.popi} ${cover ? s.popCover : ''}`}><img src={img} alt="" width={w} height={h} loading="lazy" style={style} /></span>
                    <span className={s.popn}><span>{d.name}</span><span aria-hidden="true">&rarr;</span></span>
                    <span className={s.popd}><b>{getDepartment(d.department)?.name}</b>{useLine(d.name, d.short)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className={s.delSec} aria-labelledby="del-h">
          <div className={s.band}>
            <div className={s.glow} aria-hidden="true" />
            <div className={s.grain} aria-hidden="true" />
            <div className={s.delGrid}>
              <div>
                <h2 id="del-h" className={s.h2}>{DEL_Q}</h2>
                <ol className={s.steps} role="list">
                  {STEPS.map((t, k) => (
                    <li key={k}><span className={s.sn} aria-hidden="true">0{k + 1}</span><span>{t}</span></li>
                  ))}
                </ol>
                <p className={s.pay}>{PAY}</p>
                <Link className={`${s.btnW} ${s.lt}`} href="/how-we-deliver">See how we deliver <span aria-hidden="true">&rarr;</span></Link>
              </div>
              <figure className={s.delFig}>
                <img src="/images/instrument-tray-blue-drape.jpg" alt="Surgical instruments laid out on a sterile blue drape (stock photo)"
                  width={1600} height={1067} loading="eager" decoding="async" />
              </figure>
            </div>
            {/* One licence line closes the band; GSTIN, CIN and the other papers are on About and in the footer. */}
            <div className={s.bandFoot}>
              <p><span className={s.bfK}>Drug licence</span> {site.drugLicence}</p>
              <Link className={s.srcLink} href="/about#papers">Papers for purchase teams <span aria-hidden="true">&rarr;</span></Link>
            </div>
          </div>
        </section>
      </div>
      <AskBand title={<>Need a device? <br />Send the name <span className="nb">or a photo.</span></>} sos />
    </>
  );
}
