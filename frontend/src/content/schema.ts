// JSON-LD builders. The full Organization goes on Home, About and Contact; other pages reference its @id.
import { SITE_URL, site } from './site';
import { departments } from './departments';
import type { Device } from './devices';

export const ORG_ID = `${SITE_URL}/#org`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const orgRef = { '@id': ORG_ID };
export const url = (path: string) => (path === '/' ? SITE_URL :`${SITE_URL}${path}`);

export const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: site.name,
  alternateName: [site.alternateName],
  legalName: site.legalName,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: site.description,
  foundingDate: site.foundingDate,
  telephone: site.dispatch.tel,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  areaServed: { '@type': 'State', name: 'Telangana' },
  // The second dispatch point, shown on Contact (Open in Maps).
  location: [{ '@type': 'Place', name: 'Second dispatch point, Miyapur', address: { '@type': 'PostalAddress', addressLocality: 'Miyapur, Hyderabad', addressRegion: site.address.state, addressCountry: site.address.country } }],
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'emergency', telephone: site.dispatch.tel, areaServed: 'Telangana', hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' } },
    { '@type': 'ContactPoint', contactType: 'customer service', telephone: site.whatsapp.tel, areaServed: 'Telangana' },
    { '@type': 'ContactPoint', contactType: 'purchase', email: site.email, areaServed: 'Telangana' },
    { '@type': 'ContactPoint', contactType: 'accounts', email: site.email, areaServed: 'Telangana' },
    { '@type': 'ContactPoint', contactType: 'recall and device complaints', telephone: site.dispatch.tel, areaServed: 'Telangana' },
    { '@type': 'ContactPoint', contactType: 'grievance officer', name: site.grievance.name, email: site.grievance.email, telephone: site.grievance.tel, areaServed: 'Telangana' },
  ],
  knowsAbout: departments.map(d => d.name),
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'CIN', value: site.cin },
    { '@type': 'PropertyValue', propertyID: 'GSTIN', value: site.gstin },
    { '@type': 'PropertyValue', propertyID: 'Drug licence', value: site.drugLicence },
    { '@type': 'PropertyValue', propertyID: 'Udyam', value: site.udyam },
  ],
};

export const website = { '@type': 'WebSite', '@id': WEBSITE_ID, url: SITE_URL, name: site.name, publisher: orgRef };

export type Crumb = { name: string; path: string };

export const breadcrumb = (path: string, crumbs: Crumb[]) => ({
  '@type': 'BreadcrumbList',
  '@id': `${url(path)}#breadcrumb`,
  // Every crumb carries an item URL (Google needs it); a place on the home page uses its anchor (/#departments).
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: url(c.path) })),
});

export const webPage = (path: string, name: string, type = 'WebPage', extra: Record<string, unknown> = {}) => ({
  '@type': type,
  '@id': `${url(path)}#page`,
  url: url(path),
  name,
  isPartOf: { '@id': WEBSITE_ID },
  publisher: orgRef,
  ...extra,
});

export const faqPage = (path: string, faq: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  '@id': `${url(path)}#faq`,
  isPartOf: { '@id': `${url(path)}#page` },
  mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

/** Departments with a matching schema.org MedicalSpecialty. The others carry none. */
const SPECIALTY: Record<string, string> = { orthopaedics: 'Orthopedic', cardiology: 'Cardiovascular', neurosurgery: 'Neurologic', ent: 'Otolaryngologic', 'endo-surgery': 'Surgical' };

export const medicalDevice = (d: Device) => {
  const path = `/devices/${d.slug}`;
  return {
    '@type': 'MedicalDevice',
    '@id': `${url(path)}#device`,
    name: d.name,
    ...(d.alsoCalled.length ? { alternateName: d.alsoCalled } : {}),
    description: d.short,
    url: url(path),
    ...(d.image ? { image: { '@type': 'ImageObject', url: url(d.image.src), width: d.image.width, height: d.image.height, caption: d.image.alt } } : {}),
    ...(SPECIALTY[d.department] ? { relevantSpecialty: { '@id': `https://schema.org/${SPECIALTY[d.department]}` } } : {}),
    subjectOf: { '@id': `${url(path)}#page` },
  };
};

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
