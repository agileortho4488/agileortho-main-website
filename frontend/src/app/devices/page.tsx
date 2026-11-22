import type { Metadata } from 'next';
import { devices, deviceHref, getDevice } from '@/content/devices';
import { departments, getDepartment } from '@/content/departments';
import { breadcrumb, graph, orgRef, url, webPage } from '@/content/schema';
import JsonLd from '@/components/JsonLd';
import { AskBand } from '@/components/SiteChrome';
import { og } from '@/content/site';
import DevicesAZ, { type AzRow, type AzPopular } from '@/components/search/DevicesAZ';

// Four device pages the home page row does not show (it shows the suture, mesh, stent and nail; the stent and nail cut-outs repeat here because they are the clearest pictures we have).
// All four are cut-outs of the named device, so the tiles share one dark treatment.
const POPULAR: { slug: string; src: string; width: number; height: number; look?: AzPopular['look'] }[] = [
  { slug: 'distal-radius-locking-plate', src: '/images/distal-radius-locking-plate.png', width: 600, height: 600, look: 'silver' },
  { slug: 'total-knee-implant', src: '/images/total-knee-implant.png', width: 600, height: 600, look: 'knee' },
  { slug: 'coronary-stent', src: '/images/coronary-stent.webp', width: 1177, height: 1717, look: 'lift' },
  { slug: 'proximal-femoral-nail', src: '/images/proximal-femoral-nail.webp', width: 784, height: 3179, look: 'nail' },
];

export const metadata: Metadata = {
  title: 'Medical devices A to Z, Hyderabad',
  description: 'Medical devices we supply to hospitals and labs in Telangana, A to Z. Each entry says what the device is, and what it is also called.',
  alternates: { canonical: '/devices' },
  openGraph: og('/devices', 'Medical devices A to Z, Hyderabad | Agile Healthcare', undefined, { url: '/images/og/og-devices.jpg', width: 1200, height: 630, alt: 'Four devices we supply: a distal radius locking plate, a total knee implant, coronary stents and a proximal femoral nail' }),
};


export default function DevicesPage() {
  const path = '/devices';
  const rows: AzRow[] = [...devices].sort((a, b) => a.name.localeCompare(b.name)).map(d => {
    const dep = getDepartment(d.department)!;
    return {
      name: d.name, aka: d.alsoCalled, dept: dep.name, deptSlug: dep.slug, family: d.family, line: d.short,
      href: deviceHref(d), act: d.faq.length > 0 ? 'Device page' : `${dep.name} page`, id: `dev-${d.slug}`, page: d.faq.length > 0,
    };
  });

  return (
    <>
      <JsonLd
        data={graph(
          webPage(path, 'Medical devices A to Z', 'CollectionPage', {
            breadcrumb: { '@id': `${url(path)}#breadcrumb` },
            mainEntity: { '@id': `${url(path)}#terms` },
            about: orgRef,
          }),
          breadcrumb(path, [{ name: 'Home', path: '/' }, { name: 'Devices A to Z', path }]),
          {
            '@type': 'DefinedTermSet',
            '@id': `${url(path)}#terms`,
            name: 'Devices A to Z',
            hasDefinedTerm: rows.map(r => ({ '@type': 'DefinedTerm', '@id': `${url(path)}#${r.id}`, name: r.name, description: r.line, ...(r.page ? { url: url(r.href) } : {}) })),
          },
        )}
      />
      <DevicesAZ
        rows={rows}
        depts={departments.map(d => ({ name: d.name, slug: d.slug, searchWord: d.searchWord }))}
        popular={POPULAR.flatMap(({ slug, ...img }) => { const d = getDevice(slug); return d ? [{ name: d.name, href: deviceHref(d), ...img }] : []; })}
      />
      <AskBand title={<>Not in the list? <br />Send the name <span className="nb">or a photo.</span></>} sub="We reply on WhatsApp, and tell you plainly if we do not have it." sos />
    </>
  );
}
